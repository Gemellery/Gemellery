import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_CHAT_API_KEY;

if (!apiKey) {
  console.warn("Warning: GEMINI_CHAT_API_KEY environment variable is not set. Chatbot will not function.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, context } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    if (!apiKey) {
      res.status(500).json({ error: "GEMINI_CHAT_API_KEY is not configured on the server." });
      return;
    }

    const systemPrompt = `You are a helpful AI assistant for a website called Gemellery.
    Gemellery is a platform for buying and selling gemstones, creating custom jewelry designs, and managing gemstone inventory.
    Be concise, friendly, and helpful. Guide users to relevant sections of the site if asked.
    
    Current context from user: ${context || 'None'}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to help users on Gemellery." }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    res.status(200).json({ response: text });
    
  } catch (error: any) {
    console.error("Error in AI Chatbot:", error);
    res.status(500).json({ error: "Failed to generate AI response", details: error.message });
  }
};
