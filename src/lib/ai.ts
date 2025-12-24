import { GoogleGenerativeAI } from "@google/generative-ai";

export async function moderateContent(text: string): Promise<{ flagged: boolean; categories: string[] }> {
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        Analyze the following text for harmful content. 
        Return a JSON object with the following structure:
        {
          "flagged": boolean,
          "categories": string[]
        }
        Categories can include: "hate", "harassment", "self-harm", "violence", "sexual".
        If the text contains self-harm content, ensure "self-harm" is in the categories.
        
        Text: "${text}"
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const textResponse = response.text();
      
      const json = JSON.parse(textResponse);
      return {
        flagged: json.flagged,
        categories: json.categories || []
      };
    } catch (e) {
      console.error("Gemini Moderation Error", e);
    }
  }

  // Fallback mock
  const lower = text.toLowerCase();
  const flagged = lower.includes('suicide') || lower.includes('kill myself') || lower.includes('die');
  return {
    flagged,
    categories: flagged ? ['self-harm'] : []
  };
}

export async function generateAIResponse(userContent: string): Promise<string> {
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `You are a supportive, empathetic user on an anonymous mental health support forum called safe house. The user might be expressing distress. Provide a short, comforting message.
      
      User message: "${userContent}"`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      console.error("Gemini Chat Error", e);
    }
  }

  return "I hear how much pain you're in right now. Please know that you are not alone, and there are people who want to support you. If you're in immediate danger, please reach out to a crisis helpline.";
}
