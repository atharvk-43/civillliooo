import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages } from 'ai';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are CiviBot, an expert AI Assistant for the Civillio platform specializing in Indian civic services. You always provide:
- Step-by-step guidance on Indian government services (PAN card, Voter ID, Aadhaar, Passport, etc.)
- Accurate information on grievance procedures, RTI applications, and municipal services
- Latest government schemes, eligibility criteria, and application processes
- Civil engineering project information and infrastructure development updates
- Always cite the official government portal when mentioning processes

You are friendly, professional, and extremely thorough. When you have web search results, use them to give the most up-to-date and accurate answer possible.`;

async function searchWeb(query: string): Promise<string> {
    try {
        const resp = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_key: process.env.TAVILY_API_KEY,
                query,
                search_depth: 'advanced',
                max_results: 5,
                include_answer: true
            })
        });
        const data = await resp.json();
        if (!data.results?.length) return '';

        const answer = data.answer ? `Summary: ${data.answer}\n\n` : '';
        const sources = data.results
            .map((r: any) => `📄 ${r.title}\n${r.content}`)
            .join('\n\n---\n\n');
        return `${answer}Sources:\n${sources}`;
    } catch {
        return '';
    }
}

function shouldSearch(message: string): boolean {
    // Keywords that indicate the user needs live/specific information
    const searchKeywords = [
        'latest', 'current', 'today', 'recent', 'news', '2024', '2025', '2026',
        'how to apply', 'apply for', 'process', 'procedure', 'steps', 'documents required',
        'pan card', 'voter id', 'aadhaar', 'passport', 'driving licence',
        'income tax', 'gst', 'property tax', 'municipal', 'government',
        'scheme', 'yojana', 'subsidy', 'grant', 'loan', 'insurance',
        'grievance', 'complaint', 'rti', 'tender', 'circular', 'notification',
        'fee', 'charges', 'amount', 'deadline', 'date', 'portal', 'website',
        'status', 'track', 'certificate', 'registration', 'license',
        'civil', 'road', 'construction', 'infrastructure', 'project',
        'rules', 'regulations', 'act', 'law', 'amendment', 'policy'
    ];
    const lower = message.toLowerCase();
    return searchKeywords.some(kw => lower.includes(kw));
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            console.error('[v0] Missing GROQ_API_KEY');
            return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), { status: 401 });
        }

        // Extract text from the latest user message
        const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
        let userText = '';
        
        if (lastUserMessage?.content) {
            userText = typeof lastUserMessage.content === 'string' 
                ? lastUserMessage.content 
                : lastUserMessage.content;
        }

        // Decide whether to search the web
        let webContext = '';
        if (userText && shouldSearch(userText) && process.env.TAVILY_API_KEY) {
            console.log('[CiviBot] Web search triggered for:', userText);
            webContext = await searchWeb(userText);
        }

        // Build dynamic system prompt with optional web context
        const systemPrompt = webContext
            ? `${SYSTEM_PROMPT}\n\nLIVE WEB SEARCH RESULTS (use this to answer accurately):\n\n${webContext}\n\nBased on the above real-time data, provide a comprehensive, well-structured answer.`
            : SYSTEM_PROMPT;

        // Prepare messages in correct format for groq
        const formattedMessages = messages.map((msg: any) => ({
            role: msg.role,
            content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
        }));

        const result = streamText({
            model: groq('llama-3.3-70b-versatile'),
            messages: formattedMessages,
            system: systemPrompt,
            temperature: 0.3
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("[v0] Chat API Error:", error);
        return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
