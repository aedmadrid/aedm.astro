#!/usr/bin/env node
// Optimiza las imágenes del repo: genera una versión .webp junto a cada
// original y, opcionalmente, recomprime el original como fallback.
//
// Uso:  npm run optimize:images [-- --dry-run] [-- --keep-original]
//   --dry-run        solo lista lo que haría
//   --keep-original  no recompone los originales (solo genera .webp)
//
// El código usa <picture> (webp primero, original de fallback), así que los
// originales se mantienen para navegadores antiguos.

import { readdir, stat, writeFile, unlink, open } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const DIRS = ["public", "src/images", "src/assets"];
const EXTS = new Set([".png", ".jpg", ".jpeg"]);

const MIN_BYTES = 100 * 1024;
const MAX_DIM = 2000;
const WEBP_QUALITY = 75;
const JPEG_QUALITY = 84;

const flags = new Set(process.argv.slice(2));
const DRY = flags.has("--dry-run");
const KEEP_ORIGINAL = flags.has("--keep-original");

const rel = (p) => path.relative(ROOT, p);
const fmt = (bytes) =>
    bytes >= 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
        : `${Math.round(bytes / 1024)} KB`;

async function* walk(dir) {
    if (!existsSync(dir)) return;
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(full);
        else if (EXTS.has(path.extname(entry.name).toLowerCase())) yield full;
    }
}

function basePipeline(file) {
    return sharp(file, { failOn: "none" })
        .rotate()
        .resize({
            width: MAX_DIM,
            height: MAX_DIM,
            fit: "inside",
            withoutEnlargement: true,
        });
}

// sharp no conserva la animación de los APNG: los detectamos por el chunk
// acTL y los dejamos intactos.
async function isApng(file) {
    const handle = await open(file, "r");
    try {
        const buffer = Buffer.alloc(1024 * 1024);
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
        return buffer.subarray(0, bytesRead).includes(Buffer.from("acTL"));
    } finally {
        await handle.close();
    }
}

const rows = [];
const skippedApng = [];

for (const dir of DIRS) {
    for await (const file of walk(path.join(ROOT, dir))) {
        const originalBytes = (await stat(file)).size;
        if (originalBytes < MIN_BYTES) continue;

        const ext = path.extname(file).toLowerCase();
        const webpPath = file.replace(/\.(png|jpe?g)$/i, ".webp");

        if (ext === ".png" && (await isApng(file))) {
            if (!DRY && existsSync(webpPath)) await unlink(webpPath);
            skippedApng.push(rel(file));
            continue;
        }

        if (DRY) {
            rows.push({ file: rel(file), original: originalBytes });
            continue;
        }

        const pipeline = basePipeline(file);

        const webpBuffer = await pipeline
            .clone()
            .webp({ quality: WEBP_QUALITY, effort: 6 })
            .toBuffer();

        let webpBytes = null;
        if (webpBuffer.length < originalBytes) {
            await writeFile(webpPath, webpBuffer);
            webpBytes = webpBuffer.length;
        } else if (existsSync(webpPath)) {
            await unlink(webpPath);
        }

        let fallbackBytes = originalBytes;
        if (!KEEP_ORIGINAL) {
            const isPng = ext === ".png";
            const fallbackBuffer = await pipeline
                .clone()
                [isPng ? "png" : "jpeg"](
                    isPng
                        ? { compressionLevel: 9, effort: 10 }
                        : { quality: JPEG_QUALITY, mozjpeg: true },
                )
                .toBuffer();
            // Solo sustituye el original si la mejora es notable; así, al
            // re-ejecutar el script no se recomprime una y otra vez (lo que
            // degradaría los JPEG generación tras generación).
            if (fallbackBuffer.length < originalBytes * 0.95) {
                await writeFile(file, fallbackBuffer);
                fallbackBytes = fallbackBuffer.length;
            }
        }

        rows.push({
            file: rel(file),
            original: originalBytes,
            webp: webpBytes,
            fallback: fallbackBytes,
        });
    }
}

if (!rows.length) {
    console.log("No hay imágenes que superen el umbral.");
    if (skippedApng.length) {
        console.log("APNG intactos (no se convierten):");
        for (const f of skippedApng) console.log(`  ${f}`);
    }
    process.exit(0);
}

const width = Math.max(...rows.map((r) => r.file.length));
for (const r of rows) {
    if (DRY) {
        console.log(`  ${r.file.padEnd(width)}  ${fmt(r.original)}`);
    } else if (r.webp == null) {
        console.log(
            `  ${r.file.padEnd(width)}  ${fmt(r.original).padStart(9)} -> sin webp (no mejora); original ${fmt(r.fallback)}`,
        );
    } else {
        const saved = ((1 - r.webp / r.original) * 100).toFixed(0);
        console.log(
            `  ${r.file.padEnd(width)}  ${fmt(r.original).padStart(9)} -> webp ${fmt(r.webp).padStart(9)} (-${saved}%)`,
        );
    }
}

if (!DRY) {
    const totalOriginal = rows.reduce((s, r) => s + r.original, 0);
    const totalWebp = rows.reduce((s, r) => s + (r.webp ?? 0), 0);
    const totalFallback = rows.reduce((s, r) => s + (r.fallback ?? r.original), 0);
    console.log(
        `\nTotal originales: ${fmt(totalOriginal)} | webp: ${fmt(totalWebp)} | fallback (original): ${fmt(totalFallback)}`,
    );
}

if (skippedApng.length) {
    console.log("\nAPNG intactos (sharp no conserva la animación):");
    for (const f of skippedApng) console.log(`  ${f}`);
}
