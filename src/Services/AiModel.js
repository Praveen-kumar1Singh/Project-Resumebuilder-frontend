import { GEMENI_API_KEY } from "../config/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = GEMENI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ CORRECT MODEL THAT WORKS
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 1024,
  }
});

// ✅ SIMPLE FUNCTION THAT WORKS
export const generateAISummary = async (resumeData) => {
  try {
    const { position, skills, experience } = resumeData;
    
    const prompt = `Create 3 professional resume summaries for a ${position} with skills in ${skills}. Create one for Senior level, one for Mid-level, and one for Fresher level. Each summary should be 3-4 lines. Return as JSON array with objects containing "experience_level" and "summary" fields.`;
    
    console.log("Sending to Gemini AI:", prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("AI Response:", text);
    return text;
    
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("AI service is currently unavailable. Please try again later.");
  }
};

// ✅ REMOVE AIChatSession export - we don't need it anymore
