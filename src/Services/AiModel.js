import { GEMENI_API_KEY } from "../config/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = GEMENI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ USE THE CORRECT MODEL THAT ACTUALLY EXISTS
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // This is the correct model name
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

// ✅ SIMPLE FUNCTION THAT WORKS
export const generateAISummary = async (resumeData) => {
  try {
    const { position, skills, experience } = resumeData;
    
    const prompt = `Generate a professional resume summary for a ${position} with these skills: ${skills}. Experience: ${experience}. Return only the summary text without any explanations.`;
    
    console.log("Sending prompt to Gemini AI...");
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    
    console.log("AI Summary generated successfully");
    return summary;
    
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("AI service is currently unavailable. Please try again later.");
  }
};

// ✅ REMOVE AIChatSession - use the function above instead
