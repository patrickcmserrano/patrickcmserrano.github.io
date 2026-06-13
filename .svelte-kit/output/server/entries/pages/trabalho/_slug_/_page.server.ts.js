import fs from "fs";
import path from "path";
async function entries() {
  try {
    const projectsJsonPath = path.resolve("src/data/projects.json");
    if (fs.existsSync(projectsJsonPath)) {
      const projectsData = JSON.parse(fs.readFileSync(projectsJsonPath, "utf-8"));
      return projectsData.map((project) => ({ slug: project.id }));
    }
  } catch (error) {
    console.error("Erro ao gerar entries para projetos:", error);
  }
  return [];
}
async function load({ params }) {
  const { slug } = params;
  try {
    const projectsJsonPath = path.resolve("src/data/projects.json");
    if (fs.existsSync(projectsJsonPath)) {
      const projectsData = JSON.parse(fs.readFileSync(projectsJsonPath, "utf-8"));
      const project = projectsData.find((p) => p.id === slug);
      if (project) {
        return {
          project
        };
      }
    }
  } catch (error) {
    console.error(`Erro ao carregar projeto ${slug}:`, error);
  }
  throw new Error(`Project not found: ${slug}`);
}
export {
  entries,
  load
};
