#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const [command, value] = process.argv.slice(2)
const tagMode = command === "--check-tag"
const [moduleId, version] = tagMode ? (value ?? "").split("@") : [command, value]
if (!/^places\.[a-z][a-z0-9-]*$/.test(moduleId ?? "") || !/^\d+\.\d+\.\d+$/.test(version ?? "")) {
  throw new Error("Usage: pnpm release:prepare places.menus 0.1.1 (or --check-tag places.menus@0.1.1)")
}
const directory = resolve(root, "plugins", moduleId)
const paths = ["package.json", "placard.module.json"].map((file) => resolve(directory, file))
const [pkg, manifest] = paths.map((path) => JSON.parse(readFileSync(path, "utf8")))
if (manifest.id !== moduleId) throw new Error("Module directory and manifest ID differ")
if (tagMode) {
  if (pkg.version !== version || manifest.version !== version) throw new Error("Tag, package and manifest versions must match")
  console.log(`module=${moduleId}\nversion=${version}\ndirectory=plugins/${moduleId}`)
} else {
  for (const [index, data] of [pkg, manifest].entries()) {
    data.version = version
    writeFileSync(paths[index], `${JSON.stringify(data, null, 2)}\n`)
  }
  console.log(`Prepared ${moduleId}@${version}. Commit the version changes, then push that tag to release this module.`)
}
