import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "app.js");
const outputPath = path.join(root, "data", "seed_data.json");

const appSource = await fs.readFile(appPath, "utf8");
const stopAt = appSource.indexOf("const pageMeta = {");
if (stopAt === -1) {
  throw new Error("Could not find pageMeta boundary in app.js");
}

const seedSource = appSource.slice(0, stopAt);
const exportExpression = `
JSON.stringify({
  horizontalDefinitionRows,
  horizontalOccurrenceRows,
  verticalDefinitionRows,
  verticalOccurrenceRows,
  pathDefinitionRows,
  pathInstanceRows,
  llmApiDefinitionRows,
  aiAgentInstanceRows,
  dataSourceDefinitionRows,
  symbolDataMapRows
}, null, 2)
`;

const seedJson = vm.runInNewContext(`${seedSource}\n${exportExpression}`, {});
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${seedJson}\n`, "utf8");
console.log(outputPath);
