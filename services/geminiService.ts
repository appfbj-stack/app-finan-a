import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const SYSTEM_INSTRUCTION = `
Você é um consultor financeiro pessoal especialista e amigável chamado "FinChat".
Seu objetivo é analisar os dados de transações financeiras do usuário e fornecer insights curtos, práticos e motivadores.
O usuário é brasileiro, então fale em Português do Brasil.
A moeda é o Real (R$).
Sempre use formatação Markdown para deixar o texto legível.
Seja direto. Evite jargões complexos.
Foque em:
1. Resumo rápido do saldo.
2. Onde o usuário está gastando mais.
3. Uma dica prática para economizar baseada nos dados.
`;

export const getFinancialInsights = async (transactions: Transaction[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Erro: Chave de API não configurada. Por favor, verifique a configuração.";
  }

  // Optimize token usage by summarizing data before sending
  const simplifiedData = transactions.map(t => ({
    d: t.date.split('T')[0], // Date only
    v: t.amount,
    c: t.category,
    t: t.type
  })).slice(-50); // Analyze last 50 transactions to save context

  const prompt = `Analise minhas últimas transações financeiras e me dê um resumo com dicas: \n\n${JSON.stringify(simplifiedData)}`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "Não foi possível gerar uma análise no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, ocorreu um erro ao conectar com o assistente inteligente.";
  }
};