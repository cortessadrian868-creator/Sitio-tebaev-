import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, Trash2, ArrowRightLeft, Sparkles, X, CornerDownLeft, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ChatAssistantProps {
  onClose?: () => void;
}

export default function ChatAssistant({ onClose }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      content: "¡Hola! Bienvenido al **Consultor Escolar Inteligente** de TEBAEV Mahuixtlan. \n\nSoy una Inteligencia Artificial entrenada para aclararte cualquier duda sobre las **inscripciones, uniformes, planta docente, reglamentos, actividades extraescolares y materias** del plantel.\n\n¿En qué te puedo asesorar el día de hoy?",
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const endOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);
    setErrorText(null);

    // Map conversation for Gemini endpoint API
    // Need: [{ role: "user" | "assistant", content: "..." }]
    const payloadMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content
    }));

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages })
      });
      const data = await response.json();

      if (response.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.text,
            timestamp: new Date()
          }
        ]);
      } else {
        setErrorText(data.error || "No pudimos procesar tu respuesta en este momento.");
      }
    } catch (err) {
      setErrorText("No hay conexión con el servidor escolar de Inteligencia Artificial.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputVal);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "initial-welcome-refresh",
        role: "assistant",
        content: "¡Listo! He borrado nuestro historial de preguntas. \n\n¿Tienes alguna otra consulta sobre el Telebachillerato Mahuixtlan?",
        timestamp: new Date()
      }
    ]);
  };

  const PRELOADED_QUESTIONS = [
    { text: "Requisitos de Inscripción 📝", query: "¿Cuáles son los requisitos de inscripción para nuevo ingreso y reinscripción?" },
    { text: "¿Qué uniforme usan? 👕", query: "Explícame cómo es el uniforme escolar tanto de diario como deportivo" },
    { text: "Talleres y capacitaciones 💻", query: "¿Cuáles son las capacitaciones para el trabajo de 3º a 6º semestre?" },
    { text: "¿Hay algún costo? 💰", query: "¿Cuánto cuesta la cuota escolar semestral y para qué se usa?" }
  ];

  return (
    <div id="ai-assistant-card-container" className="p-1.5 sm:p-4 rounded-3xl bg-slate-900/5 border border-slate-255 shadow-xs">
      <div className="bg-white rounded-2xl border border-slate-100 flex flex-col h-[600px] overflow-hidden text-left relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-tebaev-green to-tebaev-lightgreen text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-tebaev-gold relative border border-white/10 shrink-0">
              <Bot className="h-5.5 w-5.5" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-display font-extrabold text-sm tracking-tight">Orientación Escolar IA</h4>
                <div className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-tebaev-gold/20 text-tebaev-gold border border-tebaev-gold/20 font-mono font-semibold uppercase">
                  <Sparkles className="h-2 w-2" /> Gemini AI
                </div>
              </div>
              <p className="text-[10px] text-slate-100 font-medium tracking-wide">Asistente Virtual • TEBAEV Mahuixtlan</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Reiniciar chat"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Messaging Box */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Logo / User Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-slate-200 text-slate-700"
                      : "bg-tebaev-green/10 text-tebaev-green"
                  }`}
                >
                  {msg.role === "user" ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs border text-left leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-tebaev-green text-white border-tebaev-green"
                        : "bg-white text-slate-800 border-slate-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <p
                    className={`text-[9px] text-slate-400 font-mono ${
                      msg.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 mr-auto max-w-[85%]"
              >
                <div className="w-8 h-8 rounded-full bg-tebaev-green/10 text-tebaev-green flex items-center justify-center shrink-0">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 text-xs flex items-center justify-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tebaev-green animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-tebaev-green animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-tebaev-green animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </span>
                  <span className="text-slate-500 font-medium">Asesor escolar redactando...</span>
                </div>
              </motion.div>
            )}

            {errorText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2"
              >
                <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                <p>{errorText}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={endOfChatRef} />
        </div>

        {/* Suggested Queries */}
        {messages.length === 1 && (
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-left">
            <span className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 uppercase block mb-1.5">
              Preguntas recomendadas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRELOADED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.query)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-bold text-slate-600 transition-colors cursor-pointer text-left"
                >
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input box */}
        <div className="p-3 bg-white border-t border-slate-100">
          <form onSubmit={handleFormSubmit} className="flex gap-2 items-center">
            <input
              type="text"
              required
              disabled={loading}
              placeholder="Haz tu consulta sobre TEBAEV Mahuixtlan..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-slate-50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-tebaev-green focus:border-tebaev-green focus:bg-white transition-all focus:shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="p-3 shrink-0 bg-tebaev-green text-white hover:bg-tebaev-lightgreen rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-md shadow-tebaev-green/10 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Enviar mensaje"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mt-1 px-1">
            <span>Powered by Gemini API</span>
            <span className="flex items-center gap-1">
              Enter para enviar <CornerDownLeft className="h-2 w-2" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
