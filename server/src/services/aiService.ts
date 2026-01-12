import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock_key', // Ensure this is set in .env
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const generateMedicalSummary = async (text: string, recordType: string): Promise<string> => {
    if (!process.env.OPENAI_API_KEY) return "AI Summary unavailable (No API Key)";

    const prompt = `You are a medical AI assistant. Summarize the following ${recordType} in a concise, professional manner. Extract key information:
  - Patient symptoms/complaints
  - Diagnosis
  - Prescribed medications and dosages
  - Follow-up instructions
  - Important findings
  
  Medical Document Text:
  ${text}
  
  Provide a plain text summary.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
        });

        return response.choices[0].message.content || "Could not generate summary.";
    } catch (error) {
        console.error("AI Service Error:", error);
        return "Error generating summary.";
    }
};

export const extractMedicalEntities = async (text: string): Promise<any> => {
    if (!process.env.OPENAI_API_KEY) return {};

    const prompt = `Extract the following medical entities from the text:
  - diagnosis (string or null)
  - medications (list of objects with name, dosage, frequency)
  - labValues (list of objects)
  
  Return ONLY valid JSON.
  
  Text: ${text}`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0,
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : {};
    } catch (error) {
        console.error("AI Entity Extraction Error:", error);
        return {};
    }
};

export const handleAIChat = async (
    message: string, 
    systemPrompt: string, 
    history: ChatMessage[]
): Promise<string> => {
     if (!process.env.OPENAI_API_KEY) return "I am currently offline (Mode: Mock). Please configure LLM provider.";

     // Limit history context window (e.g., last 10 messages)
     const recentHistory = history.slice(-10);
     
     const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...recentHistory,
        { role: 'user', content: message }
     ];

     try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages as any,
            temperature: 0.7,
        });

        return response.choices[0].message.content || "I didn't understand that.";
     } catch (error) {
         console.error("AI Chat Error:", error);
         return "Sorry, I encountered an error processing your request.";
     }
};
