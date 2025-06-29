import { GoogleGenerativeAI } from "@google/generative-ai";

export class ServiceNavigatorService {
    private gemini: GoogleGenerativeAI;

    constructor(geminiApiKey: string) {
        this.gemini = new GoogleGenerativeAI(geminiApiKey);
    }

    async helpWithService(question: string): Promise<string> {
        const model = this.gemini.getGenerativeModel({
            model: 'gemini-2.0-flash'
        });
        console.log('Using Gemini model:', model.model);
        const prompt = `
        I am giving you some text in Dzongkha. Please:
        1. Convert it to English
        2. How to get this service done in Bhutan
        3. Provide a step-by-step guide in English. If any documents are required, mention them.
        4. Convert it to Dzongkha
        5. Provide the final answer in Dzongkha
        6. just give me your answer in Dzongkha, no need to explain anything
        7. Keep the answer concise and to the point in 40-50 words.
        8. in Answer there should be just Dzongkha text, no English text
        Text: """${question}"""
        `;

        try{
            const result = await model.generateContent(prompt);
            console.log('Classification result:', result);
            
            const responseText = await result.response.text();
            console.log('Response text:', responseText);

            return responseText;
        } catch (error) {
            console.error('Error during service navigation:', error);
            throw error;
        }
    }
}