import { GoogleGenAI, Type } from "@google/genai";
import { AlgorithmType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAlgorithmComplexityAnalysis = async (
  algorithm: AlgorithmType
): Promise<string> => {
  try {
    const prompt = `
      You are a computer science professor. 
      Explain the Time and Space complexity of ${algorithm}.
      Break it down into:
      1. Best Case Time Complexity (and why)
      2. Average Case Time Complexity (and why)
      3. Worst Case Time Complexity (and when it happens)
      4. Space Complexity (and why)
      
      Keep it concise but insightful. Use markdown for formatting. 
      Add a fun fact or a "gotcha" about this algorithm at the end.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // No thinking needed for basic facts
      }
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return "Failed to fetch AI analysis. Please check your API key.";
  }
};
