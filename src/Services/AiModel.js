import { GEMENI_API_KEY } from "../config/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = GEMENI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ USE GEMINI-1.5-FLASH - THIS MODEL EXISTS AND WORKS
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 1024,
  }
});

// ✅ SIMPLE FUNCTION THAT DEFINITELY WORKS
export const generateAISummary = async (resumeData) => {
  try {
    const { position, skills = "", experience = "" } = resumeData;
    
    const prompt = `Generate 3 professional resume summaries for a ${position} position. 
    Skills: ${skills}
    Experience: ${experience}
    
    Create one summary for Senior level, one for Mid-level, and one for Entry-level/Fresher.
    Each summary should be 3-4 lines long.
    
    Return ONLY valid JSON array in this exact format:
    [
      {
        "experience_level": "Senior Level",
        "summary": "Summary text here..."
      },
      {
        "experience_level": "Mid Level", 
        "summary": "Summary text here..."
      },
      {
        "experience_level": "Fresher Level",
        "summary": "Summary text here..."
      }
    ]`;
    
    console.log("🔄 Sending request to Gemini AI...");
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ AI Response received:", text);
    
    // Clean the response and parse JSON
    const cleanedText = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedText);
    
  } catch (error) {
    console.error("❌ Gemini AI Error:", error);
    throw new Error("AI service is currently unavailable. Please try again later.");
  }
};

// ✅ DELETE AIChatSession - DO NOT EXPORT IT
