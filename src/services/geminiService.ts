import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey && apiKey !== "undefined" ? new GoogleGenAI({ apiKey }) : null;

export async function generateQuestions(subject: string, topic: string, difficulty: number, count: number = 5, seed?: string, schoolYear?: string): Promise<Question[]> {
  if (!ai) {
    console.warn("Gemini API key is missing. AI generation will not work.");
    return [];
  }
  const difficultyLabel = ['', 'Fácil', 'Médio', 'Difícil'][difficulty];
  
  const prompt = `Gere ${count} perguntas de múltipla escolha para a matéria "${subject}" sobre o tema "${topic}". 
  O nível escolar do aluno é "${schoolYear || 'Ensino Fundamental/Médio'}".
  A dificuldade deve ser "${difficultyLabel}".
  ${seed ? `Use este identificador de semente para garantir variedade: ${seed}` : ''}
  As perguntas devem ser em Português do Brasil e adequadas pedagogicamente para o ano escolar mencionado.
  Para cada pergunta, forneça:
  1. O enunciado da pergunta (q).
  2. 4 opções de resposta (opts).
  3. O índice da resposta correta (0 a 3) (ans).
  4. Uma explicação passo a passo da resolução (array de strings) (explanation).
  5. Um erro comum que os alunos cometem nessa questão (mistake).`;

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
              q: { type: Type.STRING },
              opts: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              },
              ans: { type: Type.INTEGER },
              explanation: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              },
              mistake: { type: Type.STRING }
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
    return [];
  }
}

export async function generateDailyPack(subject: string, date: string, schoolYear?: string): Promise<Question[]> {
  // We generate in batches because 100 at once might hit token limits or timeout
  const batches = [1, 2, 3, 4]; // 4 batches of 25 = 100 questions
  const allQuestions: Question[] = [];

  for (const batch of batches) {
    const qs = await generateQuestions(subject, "Tópicos variados do currículo escolar", 2, 25, `${date}-batch-${batch}`, schoolYear);
    allQuestions.push(...qs);
  }

  return allQuestions;
}
