require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_KEY = process.env.GEMINI_KEY;

async function streamContent() {
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

        const prompt = "create a simple todo app";

        const generationConfig = {
            temperature: 0.8,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1024,
            stopSequences: ["END"],
        };

        const result = await model.generateContentStream({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
        });

        for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
                process.stdout.write(text); 
            }
        }
        console.log("\nStream finished.");

    } catch (error) {
        console.error("Error streaming content:", error);
    }
}

streamContent();
