import fs from "fs";
import path from "path";
import { marked } from "marked";
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
        const parseMarkdown = async (field) => {
          if (field && typeof field === "object") {
            const parsed = {};
            for (const lang of Object.keys(field)) {
              parsed[lang] = await marked(field[lang]);
            }
            return parsed;
          } else if (typeof field === "string") {
            return await marked(field);
          }
          return field;
        };
        const processedProject = {
          ...project,
          details: await parseMarkdown(project.details),
          architecture: await parseMarkdown(project.architecture)
        };
        return {
          project: processedProject
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
