import fs from "fs";
import path from "path";
async function load() {
  try {
    const jsonPath = path.resolve("src/data/vagas-ia.json");
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      return {
        vagas: data.vagas || [],
        gerado: data.gerado || "",
        total: data.total_analisadas || 0
      };
    }
  } catch (error) {
    console.error("Erro ao ler vagas-ia.json no servidor:", error);
  }
  return { vagas: [], gerado: "", total: 0 };
}
export {
  load
};
