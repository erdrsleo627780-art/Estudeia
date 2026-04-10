import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuestions(subject: string, topic: string, difficulty: number, count: number = 5): Promise<Question[]> {
  const difficultyLabel = ['', 'Fácil', 'Médio', 'Difícil'][difficulty];
  
  const prompt = `Gere ${count} perguntas de múltipla escolha para a matéria "${subject}" sobre o tema "${topic}". 
  A dificuldade deve ser "${difficultyLabel}".
  As perguntas devem ser em Português do Brasil.
  Para cada pergunta, forneça:
  1. O enunciado da pergunta.
  2. 4 opções de resposta.
  3. O índice da resposta correta (0 a 3).
  4. Uma explicação passo a passo da resolução (array de strings).
  5. Um erro comum que os alunos cometem nessa questão.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              q: { type: Type.STRING, description: "O enunciado da pergunta" },
              opts: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "4 opções de resposta"
              },
              ans: { type: Type.INTEGER, description: "O índice da resposta correta (0-3)" },
              explanation: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Explicação passo a passo"
              },
              mistake: { type: Type.STRING, description: "Erro comum" }
            },
            required: ["q", "opts", "ans", "explanation", "mistake"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Resposta vazia do Gemini");
    
    return JSON.parse(text) as Question[];
  } catch (error) {
    console.error("Erro ao gerar perguntas:", error);
    // Fallback to empty array or a default question if needed
    return [];
  }
}
