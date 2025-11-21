import { GoogleGenAI } from "@google/genai";
import { Condition } from "../types";

// Initialize the client
// NOTE: In a real app, handle missing API keys gracefully.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateDescription = async (
  title: string,
  category: string,
  condition: string,
  details: string
): Promise<string> => {
  if (!apiKey) return "Erro: Chave de API não configurada. (Mock: Descrição gerada automaticamente)";

  try {
    const prompt = `
      Atue como um especialista em vendas de instrumentos musicais no MusicPlace (marketplace brasileiro).
      Escreva uma descrição vendedora, detalhada e honesta para o seguinte produto:
      
      Título: ${title}
      Categoria: ${category}
      Condição: ${condition}
      Detalhes adicionais do vendedor: ${details}
      
      Use formatação Markdown simples. Destaque pontos positivos. Escreva em Português do Brasil.
      Seja persuasivo mas profissional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a descrição.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com a IA. Tente novamente mais tarde.";
  }
};

export const estimatePrice = async (
  title: string,
  condition: Condition
): Promise<string> => {
  if (!apiKey) return "R$ 0,00 - R$ 0,00 (Sem API Key)";

  try {
    const prompt = `
      Baseado no mercado de instrumentos musicais usados no Brasil (Mercado Livre, OLX, lojas especializadas),
      estime uma faixa de preço justa (em Reais R$) para vender rápido e vender bem o seguinte item:
      
      Item: ${title}
      Condição: ${condition}
      
      Responda APENAS com a faixa de preço. Exemplo: "R$ 1.500 - R$ 1.800".
      Não adicione texto extra.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Preço indisponível";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Estimativa indisponível";
  }
};

export const suggestCategory = async (title: string): Promise<string> => {
  if (!apiKey) return "Categoria Sugerida";
  
  try {
     const prompt = `
      Analise o título do produto e sugira a melhor categoria principal para ele dentro de um marketplace de música.
      Título: ${title}
      Responda apenas com o nome da categoria.
     `;
     
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (e) {
    return "";
  }
}
