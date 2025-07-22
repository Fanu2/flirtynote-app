"use client";

import { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Heart, Download, Sparkles, Share2 } from "lucide-react";
import html2canvas from 'html2canvas';

export default function FlirtyNote() {
  const [name, setName] = useState('');
  const [tone, setTone] = useState('romantic');
  const [font, setFont] = useState('cursive');
  const [bg, setBg] = useState('bg-pink-50');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const generateMessage = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, tone })
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Failed to generate message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current);
    const link = document.createElement('a');
    link.download = 'flirtynote.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-4">💌 FlirtyNote.ai</h1>
      <Card className="p-4">
        <CardContent className="space-y-4">
          <Input
            placeholder="Your crush's name..."
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded-md"
            value={tone}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTone(e.target.value)}
          >
            <option value="romantic">Romantic 💖</option>
            <option value="flirty">Flirty 😘</option>
            <option value="poetic">Poetic ✨</option>
            <option value="cheesy">Cheesy 🧀</option>
          </select>

          <select
            className="w-full p-2 border rounded-md"
            value={font}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFont(e.target.value)}
          >
            <option value="cursive">Cursive ✍️</option>
            <option value="serif">Serif 🖋️</option>
            <option value="monospace">Monospace 💻</option>
          </select>

          <select
            className="w-full p-2 border rounded-md"
            value={bg}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBg(e.target.value)}
          >
            <option value="bg-pink-50">Pink 🌸</option>
            <option value="bg-red-100">Red Rose 🌹</option>
            <option value="bg-yellow-100">Sunshine ☀️</option>
            <option value="bg-purple-100">Lavender 💜</option>
          </select>

          <Button onClick={generateMessage} disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Heart className="mr-2" />}
            Generate Message
          </Button>

          {message && (
            <div
              ref={cardRef}
              className={`${bg} p-4 rounded-lg border border-pink-300 text-center`}
              style={{ fontFamily: font }}
            >
              <p className="text-pink-600 text-lg leading-relaxed whitespace-pre-wrap">
                {message}
              </p>
              <div className="mt-4">
                <Sparkles className="inline text-pink-400" size={24} />
              </div>
            </div>
          )}

          {message && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={downloadCard} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                <Download className="mr-2" /> Download as Card
              </Button>
              <Button onClick={shareToWhatsApp} className="w-full bg-green-500 hover:bg-green-600 text-white">
                <Share2 className="mr-2" /> Share to WhatsApp
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
