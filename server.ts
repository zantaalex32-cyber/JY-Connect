import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'jy-connect-backend', timestamp: new Date().toISOString() });
  });

  // Server-side Gemini API proxy for JY Assistant
  app.post('/api/gemini/assistant', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { prompt, context } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!apiKey) {
        return res.status(503).json({
          error: 'Gemini API key is not configured on the server. Please check environment variables.',
          offlineSupported: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are the JY Assistant for the Bahá’í Junior Youth Spiritual Empowerment Program.
You assist animators, youth mentors, and cluster coordinators with:
- Planning engaging, uplifting 90-minute Junior Youth meetings
- Creative arts, crafts, cooperative drama, and music activities
- Meaningful community service projects suited for youth aged 11 to 15
- Guiding questions for reflection, moral discernment, and consultation
- Outlining quarterly progress narratives and cluster reports
- Organizing schedules and collaborative games that build mutual trust

MANDATORY GUIDELINES:
1. NEVER invent, fabricate, or misquote official Bahá’í sacred writings, statistics, or institutional guidance.
2. When referencing official Junior Youth study texts, strictly reference recognized materials:
   - Breezes of Confirmation (hope, perseverance, divine confirmations)
   - Wellspring of Joy (friendship, generosity, true happiness)
   - Habit of Service (spirit of service, humility, helping community)
   - Learning About Freedom (freewill, noble choices, freedom from negative influences)
   - Walking the Straight Path (honesty, truthfulness, integrity)
   - Glimmerings of Hope (resilience, overcoming tests)
   - Thinking About Numbers (intellectual powers, clarity of thought)
   - Spirit of Faith (spiritual reality, prayer, noble character)
3. Keep suggestions warm, practical, collaborative, respectful of local community conditions, and age-appropriate (11–15 years).
${context ? `Active Context: ${JSON.stringify(context)}` : ''}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
        }
      });

      return res.json({ text: response.text });
    } catch (err: any) {
      console.error('Gemini Assistant Error:', err);
      return res.status(500).json({
        error: err.message || 'Error communicating with Gemini model',
        offlineSupported: true
      });
    }
  });

  // Development: Mount Vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`JY Connect server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
