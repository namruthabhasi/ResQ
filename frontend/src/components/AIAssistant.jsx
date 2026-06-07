import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Cpu, User, RefreshCw, AlertTriangle, MessageSquareCode } from 'lucide-react';

export default function AIAssistant({ initialSearchQuery, clearInitialSearchQuery }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello, I am ResQ AI, running locally on your device. I can provide safety recommendations and first-aid instructions. Ask me any emergency question."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warningBanner, setWarningBanner] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle incoming query from the Home Screen search
  useEffect(() => {
    if (initialSearchQuery) {
      setInputValue(initialSearchQuery);
      handleSendMessage(null, initialSearchQuery);
      clearInitialSearchQuery();
    }
  }, [initialSearchQuery]);

  // Set up Speech Recognition (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInputValue(transcript);
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please type your query.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Simple emergency keyword scanner
  const scanForKeywords = (text) => {
    const dangerWords = ['bleed', 'blood', 'cpr', 'chok', 'burn', 'drown', 'snake', 'stroke', 'fracture', 'broken', 'fire', 'trapped'];
    const matched = dangerWords.some(word => text.toLowerCase().includes(word));
    if (matched) {
      setWarningBanner(
        "⚠️ IMMEDIATE HAZARD DETECTED: If you are dealing with an active medical crisis or physical entrapment, check the pre-loaded guides in the Survival Toolkit first or call emergency services immediately."
      );
    } else {
      setWarningBanner(null);
    }
  };

  const handleSendMessage = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const queryText = textOverride || inputValue;
    if (!queryText.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);
    scanForKeywords(queryText);

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          disaster_context: null
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.content }
        ]);
      } else {
        throw new Error("API error response");
      }
    } catch (err) {
      // Fallback response for offline status
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Local AI Engine Offline**

I could not connect to the local Gemma AI server (http://localhost:11434). 

**Standard Survival Guidelines:**
- Protect yourself first from immediate hazards (rising water, smoke, collapsing structures).
- Browse pre-loaded offline content in the **Survival Toolkit** tab.
- Locate emergency shelters or contacts in the navigation tabs.
- *Ensure Ollama is running and gemma is pulled on the server.*`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared. Ask me any emergency question."
      }
    ]);
    setWarningBanner(null);
  };

  const quickQuestions = [
    "How do I purify drinking water?",
    "What are the steps for Hands-Only CPR?",
    "What goes in an earthquake Go-Bag?",
    "How do I treat a deep bleeding cut?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] border border-command-border/30 rounded-2xl glass-panel overflow-hidden">
      {/* Assistant Header */}
      <div className="bg-slate-950/70 border-b border-command-border/30 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-emergency-blue/10 p-2.5 rounded-xl border border-emergency-blue/30 text-emergency-blue">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Gemma AI Dispatcher</h3>
            <span className="text-[10px] text-emergency-emerald uppercase tracking-widest font-mono font-semibold">
              LOCAL INTERFACE READY
            </span>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-xs text-command-muted hover:text-white px-3 py-1.5 border border-command-border/30 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Session
        </button>
      </div>

      {/* Warning Banner inside Assistant */}
      {warningBanner && (
        <div className="bg-gradient-to-r from-red-950/40 via-red-950/25 to-red-950/40 border-b border-red-500/25 text-red-200 text-xs md:text-sm px-6 py-3 font-semibold flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-emergency-red shrink-0" />
          <span>{warningBanner}</span>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`p-2.5 rounded-xl border shrink-0 h-10 w-10 flex items-center justify-center ${
                isUser
                  ? 'bg-emergency-emerald/10 border-emergency-emerald/30 text-emergency-emerald'
                  : 'bg-emergency-blue/10 border-emergency-blue/30 text-emergency-blue'
              }`}>
                {isUser ? <User className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl border text-sm md:text-base leading-relaxed ${
                isUser
                  ? 'bg-slate-900/80 border-emergency-emerald/20 text-emerald-100 rounded-tr-none'
                  : 'bg-slate-950/60 border-command-border/20 text-slate-100 rounded-tl-none font-semibold'
              }`}>
                {/* Format paragraphs/newlines inside message */}
                {msg.content.split('\n').map((para, pIdx) => {
                  if (para.startsWith('- ') || para.startsWith('* ')) {
                    return <li key={pIdx} className="ml-4 list-disc py-0.5">{para.substring(2)}</li>;
                  }
                  if (para.trim() === '') return <div key={pIdx} className="h-2" />;
                  return <p key={pIdx} className="mb-1.5">{para}</p>;
                })}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="p-2.5 rounded-xl border bg-emergency-blue/10 border-emergency-blue/30 text-emergency-blue shrink-0 h-10 w-10 flex items-center justify-center">
              <Cpu className="w-5 h-5 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl border border-command-border/20 bg-slate-950/60 text-slate-400 text-sm font-mono flex items-center gap-2">
              <span className="w-2 h-2 bg-emergency-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-emergency-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-emergency-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span>Gemma analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Grid */}
      {messages.length === 1 && !loading && (
        <div className="px-6 py-2 shrink-0 border-t border-command-border/10 bg-slate-950/30">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block mb-2">
            Suggested Enquiries
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={(e) => handleSendMessage(e, q)}
                className="text-left text-xs bg-slate-900/50 hover:bg-slate-900 border border-command-border/30 hover:border-emergency-blue/40 text-slate-300 px-3.5 py-2.5 rounded-xl transition-all font-semibold"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Form Input */}
      <form
        onSubmit={handleSendMessage}
        className="bg-slate-950/90 border-t border-command-border/30 p-4 flex gap-2 shrink-0 items-center"
      >
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3.5 rounded-xl border transition-all ${
            isListening
              ? 'bg-emergency-red/20 border-emergency-red text-emergency-red animate-pulse shadow-glow-red'
              : 'bg-slate-900 border-command-border/40 hover:border-emergency-blue/50 text-slate-400 hover:text-white'
          }`}
          title="Voice input (Speech to Text)"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isListening ? "Listening..." : "Type safety question..."}
          className="flex-1 bg-slate-900/80 border border-command-border/40 focus:border-emergency-blue/80 rounded-xl py-3 px-4 text-sm md:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emergency-blue/20"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="bg-emergency-blue hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-emergency-blue text-command-bg font-bold p-3.5 rounded-xl transition-colors shadow-glow-blue"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
