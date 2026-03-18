import { huggingface } from '@ai-sdk/huggingface';
import { streamText, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.HUGGINGFACE_API_KEY) {
            return new Response(JSON.stringify({ error: "Missing HUGGINGFACE_API_KEY in .env.local" }), { status: 401 });
        }

        const modelMessages = await convertToModelMessages(messages);

        const result = streamText({
            model: huggingface('meta-llama/Meta-Llama-3-8B-Instruct'),
            messages: modelMessages,
            system: "You are the Civillio AI Assistant. You help users navigate the platform, answer questions about civil engineering, grievances, and ERP features, and act friendly and professional."
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: "Failed to process chat request" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
