// Copie le moteur de lecture de texte (tesseract.js) dans public/ocr pour le servir depuis le site :
// aucune dépendance à un CDN tiers à l'exécution. Lancé après `npm install` et avant `next build`.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nm = (...p) => join(root, "node_modules", ...p);
const out = join(root, "public", "ocr");

const files = [
  [nm("tesseract.js", "dist", "worker.min.js"), "worker.min.js"],
  [nm("tesseract.js-core", "tesseract-core-lstm.wasm.js"), "core/tesseract-core-lstm.wasm.js"],
  [nm("tesseract.js-core", "tesseract-core-simd-lstm.wasm.js"), "core/tesseract-core-simd-lstm.wasm.js"],
  [nm("tesseract.js-core", "tesseract-core-relaxedsimd-lstm.wasm.js"), "core/tesseract-core-relaxedsimd-lstm.wasm.js"],
  [nm("@tesseract.js-data", "eng", "4.0.0_best_int", "eng.traineddata.gz"), "lang/eng.traineddata.gz"],
];

let missing = 0;
for (const [from, to] of files) {
  if (!existsSync(from)) {
    console.warn(`[ocr] fichier introuvable : ${from}`);
    missing++;
    continue;
  }
  const dest = join(out, to);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(from, dest);
}
console.log(missing ? `[ocr] ${missing} fichier(s) manquant(s) : l'import par capture ne fonctionnera pas.` : "[ocr] moteur copié dans public/ocr");
