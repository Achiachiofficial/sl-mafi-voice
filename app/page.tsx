'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Settings, MessageSquare, Phone, Send, Copy, X, Mic, Volume2, History, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GeminiFullApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCallMode, setCallMode] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Girl-1');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await response.json();
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.content };
      setMessages(prev => [...prev, aiMsg]);
      
      if (isCallMode) {
        speak(aiMsg.content);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined') {
      const synth = window.speechSynthesis;
      const utterance = new SynthesisUtterance(text);
      const voices = synth.getVoices();
      if (selectedVoice.includes('Girl')) {
        utterance.voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Female')) || voices[0];
      } else {
        utterance.voice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Male')) || voices[1];
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      synth.speak(utterance);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-screen bg-[#131314] text-[#e3e3e3] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-[#1e1f20] p-4 flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-xl">Gemini</span>
              <X className="cursor-pointer" onClick={() => setSidebarOpen(false)} />
            </div>
            
            <button onClick={() => {setMessages([]); setSidebarOpen(false);}} className="flex items-center gap-3 bg-[#333537] p-4 rounded-2xl hover:bg-[#444746] transition mb-4">
              <Plus size={20} /> <span>New Chat</span>
            </button>

            <div className="flex-1 overflow-y-auto space-y-2">
              <p className="text-xs text-gray-500 font-bold ml-2 uppercase">Recent</p>
              <div className="p-3 hover:bg-[#333537] rounded-xl cursor-pointer flex items-center gap-3 text-sm">
                <History size={16}/> පරණ චැට් එකක්...
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Voice Settings</p>
              <select 
                value={selectedVoice} 
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-[#333537] p-3 rounded-xl outline-none text-sm appearance-none border border-gray-600 focus:border-blue-500"
              >
                <option value="Girl-1">Natural Girl 1</option>
                <option value="Girl-2">Natural Girl 2</option>
                <option value="Boy-1">Natural Boy 1</option>
                <option value="Boy-2">Natural Boy 2</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative">
        <header className="p-4 flex justify-between items-center">
          <Menu className="cursor-pointer hover:text-white" onClick={() => setSidebarOpen(true)} />
          <div className="bg-[#333537] px-4 py-1 rounded-full text-xs font-medium text-gray-400">Gemini 1.5 Flash</div>
          <Phone className="cursor-pointer text-blue-400" onClick={() => setCallMode(true)} />
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-28">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <MessageSquare size={64} />
              <p className="mt-4 text-xl">මම ඔබට අද උදව් කරන්නේ කෙසේද?</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`group relative max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-[#333537] text-white' : 'bg-transparent text-[#e3e3e3]'}`}>
                {m.content}
                {m.role === 'assistant' && (
                  <button onClick={() => copyText(m.content)} className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition text-gray-500 flex items-center gap-1 text-[10px] uppercase">
                    <Copy size={10}/> Copy
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="absolute bottom-0 w-full p-4 bg-[#131314]">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-center bg-[#1e1f20] rounded-full px-6 py-3 gap-3 border border-gray-700 focus-within:border-gray-500">
            <input
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
              value={input}
              placeholder="Enter prompt here..."
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="text-blue-400"><Send size={22} /></button>
          </form>
        </div>
      </div>

      {/* CALL MODE */}
      <AnimatePresence>
        {isCallMode && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#131314] z-[100] flex flex-col items-center justify-around py-10"
          >
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                <Volume2 size={48} className="text-white" />
              </div>
              <h2 className="mt-8 text-2xl font-light tracking-[0.2em] text-blue-400">GEMINI LIVE</h2>
            </div>

            <div className="max-w-md text-center px-6 min-h-[80px]">
              <p className="text-lg text-gray-300 italic">
                {messages[messages.length - 1]?.role === 'assistant' ? messages[messages.length - 1].content : "Listening..."}
              </p>
            </div>

            <div className="flex gap-8">
              <button onClick={() => setCallMode(false)} className="p-6 bg-red-500/10 border border-red-500/50 text-red-500 rounded-full">
                <X size={32} />
              </button>
              <button className="p-6 bg-blue-600 text-white rounded-full animate-bounce">
                <Mic size={32} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
