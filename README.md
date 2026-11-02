# Placard plugins

Independent Placard modules in one repository. Each module has its own manifest,
version, build artifacts and GitHub Releases. No npm publishing is needed.

| Module | Package | Install in Placard |
| --- | --- | --- |
| [Menus](plugins/places.menus) | `@placard-official/places.menus` | `https://github.com/JobiJoba/plugins#places.menus` |
| [Pick](plugins/places.pick) | `@placard-official/places.pick` | `https://github.com/JobiJoba/plugins#places.pick` |

## Install

In **Settings → Module marketplace → Install from GitHub**, paste the module's
install URL above. The host must support the `#module.id` selector for repositories
with multiple modules. Each module receives only its own stable releases and updates.
Older Placard hosts can upload the `.placard-module` or `.zip` from the appropriate
[release](https://github.com/JobiJoba/plugins/releases) instead. A bare repository URL
selects the repository's latest release; use the full module URL to choose explicitly.

The existing module IDs (`places.pick` and `places.menus`) stay the same, preserving
module settings and data when an existing installation is replaced.

## Develop

Requires Node 24+ and pnpm 12.4.1.

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm build

# Work on just one module
pnpm --filter @placard-official/places.menus build
pnpm --filter @placard-official/places.pick typecheck
```

Artifacts live in `plugins/<moduleId>/dist/`. All packages share the root workspace
lockfile. The modules build independently of the Placard core repository. Menus' optional
browser tests use a sibling `Placard` checkout (or `PLACARD_CORE_DIR`).

## Release one module

```sh
pnpm release:prepare places.menus 0.1.1
git add plugins/places.menus/package.json plugins/places.menus/placard.module.json
git commit -m "Release places.menus 0.1.1"
git push origin main
git tag places.menus@0.1.1
git push origin places.menus@0.1.1
```

The release workflow checks the tag against that module's package and manifest versions,
typechecks, tests and builds only that module, and publishes its two installable assets.
Pick releases use the same commands with `places.pick` and its own version. Releasing one
module does not require bumping or releasing any other module.

To add a module, create `plugins/<moduleId>` with a package, `placard.module.json`, and
`typecheck` / `build` scripts. Its build should emit `<moduleId>-<version>.placard-module`
and `.zip` under its `dist/` directory. Add it to the table above.

Pick's Git history was retained from its original repository; source files now live under
`plugins/places.pick`. Menus includes its item-image upload support. The old Pick repository
remains available for users on its original install URL.
