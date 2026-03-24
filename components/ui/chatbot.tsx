"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, Send, Copy, Check, Sparkles, RotateCcw, ChevronDown } from "lucide-react"

// ─── CiviBot SVG Icon ────────────────────────────────────────────────────────
const CiviBotIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 1a9 9 0 0 0-9 9v5a2 2 0 0 0 2 2h1v-4H4a7 7 0 0 1 14 0v4h-2v-4h1v7a2 2 0 0 1-2 2h-4v2h4a4 4 0 0 0 4-4v-7a9 9 0 0 0-9-9z" />
        <circle cx="12" cy="4" r="1.5" />
        <rect x="11" y="5.5" width="2" height="3" />
        <path fillRule="evenodd" clipRule="evenodd" d="M5.5 10A2.5 2.5 0 0 1 8 7.5h8A2.5 2.5 0 0 1 18.5 10v6A2.5 2.5 0 0 1 16 18.5H8A2.5 2.5 0 0 1 5.5 16v-6zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7-1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-6.5 2.5l1 1.5h3l1-1.5H9.5z" />
    </svg>
)

// ─── Types ───────────────────────────────────────────────────────────────────
type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

// ─── Suggested Quick Questions ────────────────────────────────────────────────
const QUICK_QUESTIONS = [
    "🪪 How do I apply for a PAN card?",
    "🗳️ How to register for Voter ID?",
    "📋 What documents are needed for Aadhaar?",
    "📝 How to file a civic grievance online?",
    "🏗️ Latest infrastructure projects in India?",
]

// ─── Simple Markdown-like formatter ──────────────────────────────────────────
function formatMessage(text: string) {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let i = 0

    while (i < lines.length) {
        const line = lines[i]

        // Empty line → spacing
        if (!line.trim()) { elements.push(<div key={i} className="h-1" />); i++; continue }

        // Heading ##
        if (line.startsWith("## ")) {
            elements.push(<p key={i} className="font-bold text-sm mt-1 mb-0.5 text-purple-400">{line.slice(3)}</p>)
            i++; continue
        }
        // Heading ###
        if (line.startsWith("### ")) {
            elements.push(<p key={i} className="font-semibold text-sm mt-1 text-purple-300/80">{line.slice(4)}</p>)
            i++; continue
        }
        // Bullet point
        if (line.startsWith("- ") || line.startsWith("* ")) {
            elements.push(
                <div key={i} className="flex gap-2 items-start">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                    <span className="text-sm leading-relaxed">{applyInline(line.slice(2))}</span>
                </div>
            )
            i++; continue
        }
        // Numbered list
        const numberedMatch = line.match(/^(\d+)\.\s(.*)/)
        if (numberedMatch) {
            elements.push(
                <div key={i} className="flex gap-2 items-start">
                    <span className="mt-0.5 text-xs font-bold text-purple-400 shrink-0 w-4">{numberedMatch[1]}.</span>
                    <span className="text-sm leading-relaxed">{applyInline(numberedMatch[2])}</span>
                </div>
            )
            i++; continue
        }

        // Normal paragraph
        elements.push(<p key={i} className="text-sm leading-relaxed">{applyInline(line)}</p>)
        i++
    }

    return <div className="space-y-1">{elements}</div>
}

function applyInline(text: string): React.ReactNode {
    // Bold **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
            ? <strong key={i} className="font-semibold text-white/95">{part.slice(2, -2)}</strong>
            : <span key={i}>{part}</span>
    )
}

// ─── Copy Button ─────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)
    const copy = async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <button
            onClick={copy}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white/80"
            title="Copy message"
        >
            {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
        </button>
    )
}

// ─── Timestamp ───────────────────────────────────────────────────────────────
function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// ─── Main Chatbot Component ───────────────────────────────────────────────────
export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showScrollBtn, setShowScrollBtn] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Auto-scroll to bottom
    const scrollToBottom = useCallback(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading, scrollToBottom])

    // Show scroll-to-bottom button
    const handleScroll = () => {
        const el = scrollContainerRef.current
        if (!el) return
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100
        setShowScrollBtn(!isNearBottom)
    }

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto"
            inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px"
        }
    }, [input])

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 200)
        }
    }, [isOpen])

    const sendMessage = async (overrideText?: string) => {
        const text = (overrideText ?? input).trim()
        if (!text || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        const history = [...messages, userMessage].map(m => ({
            role: m.role,
            parts: [{ type: "text", text: m.content }]
        }))

        const assistantId = (Date.now() + 1).toString()
        setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "", timestamp: new Date() }])

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history })
            })

            if (!response.ok || !response.body) {
                setMessages(prev => prev.map(m => m.id === assistantId
                    ? { ...m, content: "Something went wrong. Please try again." } : m))
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
                                m.id === assistantId ? { ...m, content: m.content + parsed.delta } : m
                            ))
                        }
                    } catch { /* skip */ }
                }
            }
        } catch {
            setMessages(prev => prev.map(m => m.id === assistantId
                ? { ...m, content: "Network error. Please check your connection." } : m))
        } finally {
            setIsLoading(false)
        }
    }

    const clearChat = () => {
        if (messages.length === 0) return
        setMessages([])
    }

    return (
        <>
            {/* ── Floating Action Button ─────────────────────────────────── */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                {/* Tooltip hint when closed */}
                {!isOpen && messages.length === 0 && (
                    <div className="animate-bounce-slow bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                        Ask CiviBot anything ✨
                    </div>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50 ${isOpen
                        ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
                        : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white"
                        }`}
                    aria-label="Toggle CiviBot"
                >
                    {/* Pulse ring */}
                    {!isOpen && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-purple-500/40 pointer-events-none" />
                    )}
                    <span className="relative z-10 transition-transform duration-300">
                        {isOpen
                            ? <X className="h-6 w-6" />
                            : <CiviBotIcon className="h-6 w-6" />
                        }
                    </span>
                </button>
            </div>

            {/* ── Chat Window ───────────────────────────────────────────────── */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[600px] z-50 flex flex-col rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.4)] border border-white/10"
                    style={{
                        background: "linear-gradient(145deg, #0f0c29, #1a1040, #141030)",
                        animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)"
                    }}
                >
                    <style>{`
                        @keyframes slideUp {
                            from { opacity: 0; transform: translateY(20px) scale(0.95); }
                            to   { opacity: 1; transform: translateY(0)     scale(1);    }
                        }
                        @keyframes msgIn {
                            from { opacity: 0; transform: translateY(8px); }
                            to   { opacity: 1; transform: translateY(0);   }
                        }
                        @keyframes dotPulse {
                            0%,80%,100% { transform: scale(0.6); opacity:0.4; }
                            40%         { transform: scale(1.2); opacity:1;   }
                        }
                        .dot1 { animation: dotPulse 1.2s infinite 0s; }
                        .dot2 { animation: dotPulse 1.2s infinite 0.2s; }
                        .dot3 { animation: dotPulse 1.2s infinite 0.4s; }
                        .msg-in { animation: msgIn 0.3s ease forwards; }
                        ::-webkit-scrollbar { width: 4px; }
                        ::-webkit-scrollbar-track { background: transparent; }
                        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }
                    `}</style>

                    {/* ── Header ────────────────────────────────────────────── */}
                    <div className="relative shrink-0 px-5 py-4 flex items-center justify-between"
                        style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.4), rgba(124,58,237,0.4))", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        {/* Decorative glow */}
                        <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
                        <div className="absolute -top-6 right-10 w-20 h-20 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

                        <div className="flex items-center gap-3 relative z-10">
                            {/* Avatar with glow */}
                            <div className="relative">
                                <div className="h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)" }}>
                                    <CiviBotIcon className="h-5 w-5" />
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-[#1a1040] shadow-sm" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white text-base tracking-tight">CiviBot</span>
                                    <span className="flex items-center gap-1 bg-white/10 text-[10px] font-semibold text-emerald-300 px-1.5 py-0.5 rounded-full">
                                        <Sparkles className="h-2.5 w-2.5" />AI
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                                    </span>
                                    <span className="text-[11px] text-white/50 font-medium">Online · Web Search Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 relative z-10">
                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="p-2 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/10 transition-all duration-150"
                                    title="Clear chat"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/10 transition-all duration-150"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* ── Messages Area ─────────────────────────────────────── */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                    >
                        {messages.length === 0 ? (
                            /* Welcome screen */
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-5 px-4">
                                <div className="relative">
                                    <div className="h-20 w-20 rounded-3xl flex items-center justify-center text-white shadow-2xl"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)" }}>
                                        <CiviBotIcon className="h-10 w-10" />
                                    </div>
                                    <div className="absolute inset-0 rounded-3xl bg-purple-500/30 blur-xl -z-10 scale-125" />
                                </div>

                                <div>
                                    <h3 className="text-white font-bold text-lg">Hi, I'm CiviBot! 👋</h3>
                                    <p className="text-white/40 text-sm mt-1 leading-relaxed">
                                        Your AI assistant for Indian civic services.<br />I search the web in real-time!
                                    </p>
                                </div>

                                {/* Quick question chips */}
                                <div className="w-full space-y-2 mt-2">
                                    <p className="text-white/30 text-xs font-medium uppercase tracking-wider">Try asking</p>
                                    <div className="flex flex-col gap-2">
                                        {QUICK_QUESTIONS.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => sendMessage(q.replace(/^[^\s]+ /, ""))}
                                                className="w-full text-left text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((m, idx) => {
                                    const isUser = m.role === "user"
                                    const isEmpty = !m.content && !isUser
                                    return (
                                        <div
                                            key={m.id}
                                            className={`msg-in flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                                            style={{ animationDelay: `${Math.min(idx * 30, 200)}ms` }}
                                        >
                                            {/* Bot avatar */}
                                            {!isUser && (
                                                <div className="h-7 w-7 rounded-xl flex items-center justify-center text-white shrink-0 mt-auto shadow-md"
                                                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                                                    <CiviBotIcon className="h-3.5 w-3.5" />
                                                </div>
                                            )}

                                            <div className={`flex flex-col gap-1 max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>
                                                {/* Bubble */}
                                                {isEmpty ? (
                                                    /* Typing indicator */
                                                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
                                                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                                        <span className="dot1 h-2 w-2 rounded-full bg-purple-400 inline-block" />
                                                        <span className="dot2 h-2 w-2 rounded-full bg-purple-400 inline-block" />
                                                        <span className="dot3 h-2 w-2 rounded-full bg-purple-400 inline-block" />
                                                    </div>
                                                ) : (
                                                    <div className={`group relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${isUser
                                                        ? "rounded-br-sm text-white"
                                                        : "rounded-bl-sm text-white/90"
                                                        }`}
                                                        style={isUser
                                                            ? { background: "linear-gradient(135deg, #6366f1, #7c3aed)" }
                                                            : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }
                                                        }
                                                    >
                                                        {isUser
                                                            ? <span className="whitespace-pre-wrap">{m.content}</span>
                                                            : formatMessage(m.content)
                                                        }
                                                        {/* Copy button for AI messages */}
                                                        {!isUser && m.content && (
                                                            <div className="absolute -bottom-3 right-2">
                                                                <CopyButton text={m.content} />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Timestamp */}
                                                {m.content && (
                                                    <span className="text-[10px] text-white/25 px-1">
                                                        {formatTime(m.timestamp)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* User avatar */}
                                            {isUser && (
                                                <div className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0 mt-auto shadow-md text-xs font-bold text-white"
                                                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
                                                    U
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Scroll to bottom button */}
                    {showScrollBtn && (
                        <button
                            onClick={scrollToBottom}
                            className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg transition-all duration-200 z-10"
                        >
                            <ChevronDown className="h-3.5 w-3.5" />
                            New messages
                        </button>
                    )}

                    {/* ── Input Area ────────────────────────────────────────── */}
                    <div className="shrink-0 px-4 py-3"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(20px)" }}>

                        {/* Search indicator */}
                        {isLoading && (
                            <div className="flex items-center gap-2 mb-2 px-1">
                                <div className="flex gap-1">
                                    <span className="dot1 h-1 w-1 rounded-full bg-purple-400 inline-block" />
                                    <span className="dot2 h-1 w-1 rounded-full bg-purple-400 inline-block" />
                                    <span className="dot3 h-1 w-1 rounded-full bg-purple-400 inline-block" />
                                </div>
                                <span className="text-[11px] text-purple-300/70">CiviBot is searching the web...</span>
                            </div>
                        )}

                        <div className="flex items-end gap-2">
                            <div className="flex-1 relative"
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "16px",
                                    transition: "border-color 0.2s"
                                }}
                                onFocus={() => { }}
                            >
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault()
                                            sendMessage()
                                        }
                                    }}
                                    disabled={isLoading}
                                    placeholder="Ask anything about civic services..."
                                    rows={1}
                                    className="w-full bg-transparent text-white text-sm placeholder-white/25 px-4 py-3 resize-none outline-none leading-relaxed"
                                    style={{ maxHeight: "120px", fontFamily: "inherit" }}
                                />
                            </div>

                            {/* Send button */}
                            <button
                                onClick={() => sendMessage()}
                                disabled={isLoading || !input.trim()}
                                className="h-11 w-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                                style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
                            >
                                <Send className="h-4 w-4" style={{ transform: input.trim() ? "translateX(1px)" : "none" }} />
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-white/15 mt-2">
                            Shift+Enter for new line · Powered by Groq & Tavily
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
