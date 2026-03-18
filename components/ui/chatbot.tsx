"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, User } from "lucide-react"
import { Button } from "./button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./card"
import { Input } from "./input"
import { ScrollArea } from "./scroll-area"

const CiviBotIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        {/* Headset Arc & Microphone */}
        <path d="M12 1a9 9 0 0 0-9 9v5a2 2 0 0 0 2 2h1v-4H4a7 7 0 0 1 14 0v4h-2v-4h1v7a2 2 0 0 1-2 2h-4v2h4a4 4 0 0 0 4-4v-7a9 9 0 0 0-9-9z" />
        {/* Antenna */}
        <circle cx="12" cy="4" r="1.5" />
        <rect x="11" y="5.5" width="2" height="3" />
        {/* Bot Head and Face Cutouts */}
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.5 10A2.5 2.5 0 0 1 8 7.5h8A2.5 2.5 0 0 1 18.5 10v6A2.5 2.5 0 0 1 16 18.5H8A2.5 2.5 0 0 1 5.5 16v-6zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7-1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-6.5 2.5l1 1.5h3l1-1.5H9.5z"
        />
    </svg>
)

type Message = {
    id: string
    role: "user" | "assistant"
    content: string
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isLoading])

    const sendMessage = async () => {
        const text = input.trim()
        if (!text || isLoading) return

        const userMessage: Message = { id: Date.now().toString(), role: "user", content: text }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        // Build history for context
        const history = [...messages, userMessage].map(m => ({
            role: m.role,
            parts: [{ type: "text", text: m.content }]
        }))

        const assistantId = (Date.now() + 1).toString()
        setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }])

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history })
            })

            if (!response.ok || !response.body) {
                setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: "Sorry, something went wrong. Please try again." } : m))
                setIsLoading(false)
                return
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ""

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split("\n")
                buffer = lines.pop() ?? ""

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue
                    const raw = line.slice(6).trim()
                    if (raw === "[DONE]") continue
                    try {
                        const parsed = JSON.parse(raw)
                        if (parsed.type === "text-delta" && parsed.delta) {
                            setMessages(prev => prev.map(m =>
                                m.id === assistantId
                                    ? { ...m, content: m.content + parsed.delta }
                                    : m
                            ))
                        }
                    } catch {
                        // skip malformed lines
                    }
                }
            }
        } catch {
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: "Network error. Please check your connection." } : m))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] ${isOpen ? "bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-300" : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-none text-white"
                    }`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <CiviBotIcon className="h-6 w-6" />}
            </Button>

            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-[340px] sm:w-[380px] h-[550px] shadow-2xl z-50 flex flex-col border border-border/40 bg-background/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-border/50 px-5 py-4 bg-gradient-to-b from-muted/50 to-transparent shrink-0">
                        <CardTitle className="flex items-center gap-3 text-lg font-semibold tracking-tight">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm">
                                <CiviBotIcon className="h-5 w-5" />
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
                                    CiviBot
                                </span>
                                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                    </span>
                                    Online
                                </span>
                            </div>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden relative bg-muted/10">
                        <ScrollArea className="h-full px-5 py-5 w-full">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-4 mt-6">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-2 shadow-inner">
                                        <CiviBotIcon className="h-8 w-8 text-purple-500 opacity-80" />
                                    </div>
                                    <p className="text-sm font-medium">Hi! I am CiviBot. ✨<br /><span className="text-xs opacity-70 font-normal">How can I help you today?</span></p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {messages.map((m) => {
                                        if (!m.content && m.role === "assistant") return null
                                        return (
                                            <div
                                                key={m.id}
                                                className={`flex gap-3 text-sm ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                {m.role === "assistant" && (
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 shadow-sm mt-auto">
                                                        <CiviBotIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                )}
                                                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] shadow-sm leading-relaxed ${m.role === "user"
                                                    ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm"
                                                    : "bg-background border border-border/40 rounded-bl-sm"}`}
                                                >
                                                    <span className="whitespace-pre-wrap">{m.content}</span>
                                                </div>
                                                {m.role === "user" && (
                                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20 shadow-sm mt-auto">
                                                        <User className="h-4 w-4 text-primary" />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                    {isLoading && messages[messages.length - 1]?.content === "" && (
                                        <div className="flex gap-3 text-sm justify-start">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 shadow-sm mt-auto">
                                                <CiviBotIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="px-5 py-4 rounded-2xl bg-background border border-border/40 rounded-bl-sm flex items-center gap-1.5 shadow-sm">
                                                <span className="w-1.5 h-1.5 bg-purple-500/60 rounded-full animate-bounce" />
                                                <span className="w-1.5 h-1.5 bg-purple-500/60 rounded-full animate-bounce delay-150" />
                                                <span className="w-1.5 h-1.5 bg-purple-500/60 rounded-full animate-bounce delay-300" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={scrollRef} />
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-md shrink-0">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                sendMessage()
                            }}
                            className="flex relative items-center w-full focus-within:ring-2 focus-within:ring-purple-500/50 rounded-full transition-all bg-muted border border-border/40 shadow-inner"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                                className="pr-12 py-6 rounded-full border-transparent bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 border-0 shadow-none text-sm"
                                placeholder="Message CiviBot..."
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-1.5 h-9 w-9 rounded-full shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                <Send className="h-4 w-4 ml-0.5" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </>
    )
}
