"use client";

import { useState, useRef, useEffect } from "react";

const s = (v: string) => `hsl(${v})`;

const suggestions = [
  "Como posso economizar mais dinheiro?",
  "Qual o melhor investimento para iniciantes?",
  "Como montar uma reserva de emergência?",
  "Como sair das dívidas mais rápido?",
  "Explique o que é Tesouro Selic",
  "Como investir R$ 500 por mês?",
];

export default function AiChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const message = text || input.trim();
    if (!message || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, chatId }),
      });
      const data = await res.json();
      if (data.chatId) setChatId(data.chatId);
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Desculpe, ocorreu um erro. Tente novamente." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      <div style={{ marginBottom: "16px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: s("230 20% 92%"), fontFamily: "Space Grotesk, sans-serif" }}>
          🤖 Copiloto IA
        </h1>
        <p style={{ fontSize: "13px", color: s("230 12% 50%"), marginTop: "2px" }}>
          Seu assistente financeiro inteligente
        </p>
      </div>

      {/* CHAT AREA */}
      <div style={{
        flex: 1, background: s("234 24% 11%"), border: `1px solid ${s("234 18% 18%")}`,
        borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {messages.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "20px" }}>
              <div style={{ width: "60px", height: "60px", background: s("252 82% 68%"), borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>🤖</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: "600", color: s("230 20% 92%"), marginBottom: "6px" }}>
                  Olá! Sou seu Copiloto Financeiro
                </div>
                <div style={{ fontSize: "13px", color: s("230 12% 50%") }}>
                  Pergunte qualquer coisa sobre finanças pessoais
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", maxWidth: "500px" }}>
                {suggestions.map(s_ => (
                  <button key={s_} onClick={() => sendMessage(s_)} style={{
                    fontSize: "12px", padding: "6px 12px", borderRadius: "20px",
                    border: `1px solid ${s("234 18% 22%")}`, background: s("234 20% 14%"),
                    color: s("230 12% 65%"), cursor: "pointer",
                  }}>{s_}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                background: msg.role === "user" ? s("252 82% 68%") : s("234 20% 16%"),
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
              }}>
                {msg.role === "user" ? "👤" : "🤖"}
              </div>
              <div style={{
                maxWidth: "75%", padding: "10px 14px", borderRadius: "12px",
                background: msg.role === "user" ? s("252 50% 18%") : s("234 20% 14%"),
                fontSize: "13px", color: s("230 20% 88%"), lineHeight: "1.6",
                whiteSpace: "pre-wrap",
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: s("234 20% 16%"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🤖</div>
              <div style={{ padding: "10px 14px", borderRadius: "12px", background: s("234 20% 14%"), display: "flex", gap: "4px", alignItems: "center" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: s("252 82% 68%"), animation: `pulse 1s ${i * 0.2}s infinite` }}></div>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={{ padding: "16px", borderTop: `1px solid ${s("234 18% 18%")}`, display: "flex", gap: "8px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Pergunte sobre finanças, investimentos, metas..."
            style={{
              flex: 1, padding: "10px 14px", borderRadius: "10px",
              background: s("234 20% 14%"), border: `1px solid ${s("234 18% 22%")}`,
              color: s("230 20% 92%"), fontSize: "13px", outline: "none",
            }}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
            padding: "10px 16px", borderRadius: "10px", background: s("252 82% 68%"),
            border: "none", color: "#fff", cursor: "pointer", fontSize: "16px",
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}