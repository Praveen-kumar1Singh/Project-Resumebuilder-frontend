import { GEMENI_API_KEY } from "../config/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = GEMENI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Use the correct model that actually exists
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // This model exists and works
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

// ✅ Simple function to generate content (instead of chat session)
export const generateAISummary = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to generate AI summary: " + error.message);
  }
};

// ✅ Alternative: If you need chat functionality
export const createChatSession = () => {
  return model.startChat({
    generationConfig,
    history: [],
  });
};
