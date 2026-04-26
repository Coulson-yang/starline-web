import { readFile } from "node:fs/promises";
import path from "node:path";
import { institutionSchema, type InstitutionData } from "./institution-schema";

export async function getInstitutionData(): Promise<InstitutionData> {
  const filePath = path.join(process.cwd(), "public", "institution_data.json");
  const raw = await readFile(filePath, "utf-8");
  return institutionSchema.parse(JSON.parse(raw));
}
