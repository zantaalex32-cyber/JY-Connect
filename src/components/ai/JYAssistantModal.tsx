import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, BookOpen, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Material, JuniorYouthGroup, ReportData } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sourceReferences?: string[];
}

interface JYAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: Material[];
  groups: JuniorYouthGroup[];
  reports: ReportData[];
  clusterName: string;
}

export function JYAssistantModal({
  isOpen,
  onClose,
  materials,
  groups,
  reports,
  clusterName
}: JYAssistantModalProps) {
  if (!isOpen) return null;

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Allāh-u-Abhā! I am your JY Assistant. I can help animators and coordinators with:
• Planning 90-minute Junior Youth meeting flows
• Cooperative game ideas and quotation illumination activities
• Meaningful community service projects for youth aged 11–15
• Formulating deep consultation questions for Ruhi Junior Youth texts
• Drafting quarterly and cycle cluster reports

Note: I strictly adhere to official Bahá’í guidance and never invent sacred texts, quotations, or institutional statistics. How may I assist your service today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickPrompts = [
    '3 reflection questions for Breezes of Confirmation Lesson 4',
    'Cooperative game idea that fosters mutual trust without competition',
    'Community service project idea for urban neighborhood',
    'Draft a quarterly progress report narrative',
    '90-minute session outline balancing study, prayer, art, and games'
  ];

  // Curated offline knowledge fallback in case of no connectivity or missing API key
  const getCuratedOfflineResponse = (prompt: string): string => {
    const q = prompt.toLowerCase();

    if (q.includes('breezes of confirmation') || q.includes('reflection question')) {
      return `Here are 3 authentic consultation and reflection questions for *Breezes of Confirmation*:

1. **On Effort & Confirmation:** In the story of Musonda, how did taking the first step in faith attract unexpected assistance from friends and family?
2. **On Perseverance:** What is the difference between facing a difficult test and becoming discouraged? How can prayer and honest consultation restore our hope?
3. **On Mutual Support:** When someone in our group feels tired or hesitant, what specific words or actions can we offer to uplift them without making them feel judged?

*(Reference: Breezes of Confirmation, Ruhi Institute Junior Youth Series)*`;
    }

    if (q.includes('game') || q.includes('cooperative') || q.includes('icebreaker')) {
      return `Here is a time-tested cooperative game for Junior Youth:

**The Compassion Circle (or Web of Unity)**
• **Objective:** Demonstrate that every member of the group is interconnected and essential.
• **Materials:** A ball of colored yarn.
• **Instructions:**
  1. Participants sit in a circle. The first person holds the end of the yarn and shares one quality they appreciate in a peer across the circle, then rolls the ball while holding their strand.
  2. The next youth catches it, expresses appreciation for another friend, and rolls the ball while holding their piece.
  3. Soon, a complex, beautiful web connects every single youth.
  4. Test the web by placing a light object (like a balloon or paper flower) in the center. Then reflect: "What happens to the web if even one person lets go? How does our group uphold one another in daily life?"`;
    }

    if (q.includes('service') || q.includes('project')) {
      return `Here are 2 practical service project ideas tailored for youth aged 11–15:

1. **Neighborhood Story & Reading Corner for Younger Children:**
   • The junior youth organize an outdoor reading hour at a local park or community center, reading uplifting virtues stories to children aged 5–9 and helping them with simple drawing activities.
   • *Moral Capability Developed:* Care for the younger generation, articulate speech, patience, and selfless service.

2. **Elderly Neighbor Yard Care & Flower Planting:**
   • Youth consult with elders in their neighborhood, offering to rake leaves, weed garden patches, and plant cheerful local flowers.
   • *Moral Capability Developed:* Respect for elders, community solidarity, and humility.`;
    }

    if (q.includes('report') || q.includes('narrative')) {
      return `Here is a structured draft template for your Cluster Progress Narrative:

**1. Progress & Numerical Summary:**
During this cycle in ${clusterName}, our Junior Youth groups maintained regular weekly gatherings, focusing on deepening in moral reasoning and spiritual perception.

**2. Key Achievements:**
• High attendance consistency and active participation in consultations.
• Parents demonstrated strong partnership through home visits and consultation evenings.
• Successful completion of study cycle units with celebration of learning.

**3. Challenges Overcome:**
• Facilitating balanced discussions where shy participants find their voice.
• Coordinating animator study circles to ensure continuous accompaniment.

**4. Plans for Next Cycle:**
• Expand training through Ruhi Book 5 to welcome new animators.
• Coordinate the upcoming cluster-wide camp and community service day.`;
    }

    return `Thank you for your inquiry regarding the Junior Youth Spiritual Empowerment Program.

A vital principle is that junior youth (ages 11–15) possess profound spiritual perception, an innate yearning for justice, and an eagerness to contribute to society. 

To explore this further:
• Refer to **Ruhi Institute Book 5: Releasing the Powers of Junior Youth**.
• Consult the official portal: **bahai.org/action/community-building/junior-youth**.
• Discuss with your cluster coordinator to align with your cluster's current plan of action.`;
  };

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      // Call full-stack server endpoint
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText.trim(),
          context: {
            clusterName,
            totalGroups: groups.length,
            availableMaterials: materials.map((m) => m.title).slice(0, 10)
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const json = await res.json();
      const replyText = json.text || getCuratedOfflineResponse(userText);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      // Graceful offline fallback
      const offlineReply = getCuratedOfflineResponse(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-offline-${Date.now()}`,
          sender: 'assistant',
          text: offlineReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>JY Assistant</span>
                <span className="text-[10px] font-mono bg-sky-900 text-sky-200 border border-sky-700 px-1.5 py-0.2 rounded font-normal">
                  Powered by Gemini 3.8
                </span>
              </h2>
              <div className="text-[11px] text-slate-300">
                Planning, activity guidance, and reflection for Junior Youth animators
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-mono text-base px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Safeguarding notice */}
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 flex items-center gap-2 shrink-0">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            The assistant respects official Bahá’í Junior Youth curricula and avoids inventing sacred verses or quotations.
          </span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-lg p-3 whitespace-pre-wrap leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-sky-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}
              >
                <div>{m.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
              <span>Consulting Junior Youth educational framework...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
          <span className="text-slate-400 font-semibold shrink-0">Ideas:</span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-slate-700 rounded border border-slate-200 whitespace-nowrap transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputPrompt);
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            placeholder="Ask about meeting structure, discussion questions, games, arts, reports..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={loading}
            className="flex-1 p-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-sky-500 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
