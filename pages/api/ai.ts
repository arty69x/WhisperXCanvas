import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, history } = req.body;

  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: "You are WhisperXStudio AI, a professional assistant for a high-fidelity visualization platform. Help the user with their workspace, archive, and forge tasks." }] },
        ...(history || []),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate content' });
  }
}
