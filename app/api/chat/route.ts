import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY in .env.local" }), { status: 401 });
        }

        const modelMessages = await convertToModelMessages(messages);

        const result = streamText({
            model: groq('llama-3.3-70b-versatile'),
            // @ts-ignore
            maxSteps: 5, // Allows the AI to call tools and reply autonomously!
            messages: modelMessages,
            system: "You are CiviBot, an expert AI Assistant. Use the 'searchTheWeb' tool ONLY if you need to fetch real-world rules, news, or complex data you don't confidently know.",
            tools: {
                searchTheWeb: tool({
                    description: 'Searches the internet for highly accurate, up-to-date facts, current events, government rules, and news. Use this when the requested information is not in your training data.',
                    parameters: z.object({
                        query: z.string().describe('The precise URL-encoded search query or keywords to look up on the web. Example: "Latest Indian Voter ID rules 2026"')
                    }),
                    // @ts-ignore
                    execute: async ({ query }: { query: string }) => {
                        console.log("CiviBot is searching the web for:", query);
                        const resp = await fetch('https://api.tavily.com/search', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                api_key: process.env.TAVILY_API_KEY,
                                query: query,
                                search_depth: "basic",
                                max_results: 3
                            })
                        });
                        const data = await resp.json();
                        if (!data.results) return "No results found.";
                        return data.results.map((r: any) => `Title: ${r.title}\nContent: ${r.content}`).join('\n\n');
                    }
                })
            }
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: "Failed to process chat request" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
