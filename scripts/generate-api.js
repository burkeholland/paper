#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const htmlPath = path.join(rootDir, "index.html");
const outputPath = path.join(rootDir, "api.json");

const html = fs.readFileSync(htmlPath, "utf8");

// Extract and eval the wallpapers array from index.html
const wallpapersMatch = html.match(/const wallpapers = \[([\s\S]*?)\n\s*\];/);
if (!wallpapersMatch) {
  console.error("Could not find wallpapers array in index.html");
  process.exit(1);
}
const wallpapers = eval("[" + wallpapersMatch[1] + "]");

// Extract and eval the themes array from index.html
const themesMatch = html.match(/const themes = \[([\s\S]*?)\n\s*\];/);
if (!themesMatch) {
  console.error("Could not find themes array in index.html");
  process.exit(1);
}
const themes = eval("[" + themesMatch[1] + "]");

const baseUrl = "https://burkeholland.github.io/paper";

const api = {
  name: "paper",
  description: "4k wallpapers in a flat design. Free downloads.",
  baseUrl,
  wallpapersPath: "/wallpapers/",
  thumbsPath: "/thumbs/",
  themes,
  wallpapers: wallpapers.map((w) => ({
    ...w,
    wallpaperUrl: `${baseUrl}/wallpapers/${w.file}`,
    thumbUrl: `${baseUrl}/thumbs/${w.file}`,
  })),
  total: wallpapers.length,
};

fs.writeFileSync(outputPath, JSON.stringify(api, null, 2) + "\n");
console.log(`Generated api.json — ${wallpapers.length} wallpapers, ${themes.length} themes`);
