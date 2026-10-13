import fs from "fs";
import path from "path";
async function load() {
  try {
    const companiesJsonPath = path.resolve("src/data/companies.json");
    if (fs.existsSync(companiesJsonPath)) {
      const companiesData = JSON.parse(fs.readFileSync(companiesJsonPath, "utf-8"));
      return {
        companies: companiesData
      };
    }
  } catch (error) {
    console.error("Erro ao ler companies.json no servidor:", error);
  }
  return {
    companies: []
  };
}
export {
  load
};
