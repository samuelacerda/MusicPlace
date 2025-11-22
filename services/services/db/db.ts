// services/db/db.ts

const D1_URL = import.meta.env.VITE_D1_URL; 
const D1_TOKEN = import.meta.env.VITE_D1_TOKEN;

if (!D1_URL || !D1_TOKEN) {
  console.error("❌ ERRO: Variáveis VITE_D1_URL ou VITE_D1_TOKEN não foram configuradas.");
}

export async function queryDB(sql: string, params: any[] = []) {
  try {
    const response = await fetch(D1_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${D1_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sql,
        params
      })
    });

    const result = await response.json();

    if (result.error) {
      console.error("❌ D1 SQL ERROR:", result.error);
      throw new Error(result.error);
    }

    return result;
  } catch (e) {
    console.error("❌ Erro na conexão com o D1:", e);
    throw e;
  }
}

