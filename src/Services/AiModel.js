import { GEMENI_API_KEY } from "../config/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = GEMENI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ USE THE CORRECT MODEL THAT WORKS
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // THIS MODEL EXISTS
});

// ✅ ONLY EXPORT THIS FUNCTION - DELETE AIChatSession
export const generateAISummary = async (resumeData) => {
  try {
    const { position, skills = "", experience = "" } = resumeData;
    
    const prompt = `Generate 3 professional resume summaries for a ${position} with skills in ${skills}. 
    Create summaries for Senior, Mid-level, and Fresher experience levels.
    Return as JSON array with objects containing "experience_level" and "summary" fields.`;

    console.log("🔄 Calling Gemini AI with model: gemini-1.5-flash");
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ AI Response:", text);
    
    // Parse JSON response
    const cleanText = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanText);
    
  } catch (error) {
    console.error("❌ AI Error:", error);
    throw new Error("AI service unavailable. Please try again.");
  }
};

// 🚫 DO NOT EXPORT AIChatSession - DELETE IT COMPLETELY
