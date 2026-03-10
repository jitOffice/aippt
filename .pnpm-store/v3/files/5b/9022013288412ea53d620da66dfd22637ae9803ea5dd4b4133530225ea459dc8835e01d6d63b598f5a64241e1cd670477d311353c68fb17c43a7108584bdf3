import process from 'node:process';
import { y as prompts, C as CLI_TEMP_DIR, w as writeFileSafe, r as runCli, h as parseNr, v as limitText } from './shared/ni.BtcD8a97.mjs';
import { Fzf, byLengthAsc } from 'fzf';
import { g as getPackageJSON } from './shared/ni.C4mrCGPc.mjs';
import { existsSync, promises } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { globSync } from 'tinyglobby';
import 'readline';
import 'events';
import 'ansis';
import 'package-manager-detector';
import 'tinyexec';
import 'package-manager-detector/constants';
import 'os';
import 'tty';
import 'node:os';
import 'fs';
import 'fs/promises';
import 'path';
import 'package-manager-detector/commands';

const IGNORE_PATHS = [
  "**/node_modules/**",
  "**/dist/**",
  "**/public/**",
  "**/fixture/**",
  "**/fixtures/**"
];
function findPackages(ctx) {
  const { cwd = process.cwd() } = ctx ?? {};
  const packagePath = resolve(cwd, "package.json");
  if (!existsSync(packagePath))
    return [];
  const pkgs = globSync("**/package.json", {
    ignore: IGNORE_PATHS,
    cwd,
    onlyFiles: true,
    dot: false,
    expandDirectories: false
  });
  if (pkgs.length <= 1)
    return [packagePath];
  return pkgs;
}
async function promptSelectPackage(ctx, command) {
  const cwd = ctx?.cwd ?? process.cwd();
  const packagePaths = findPackages(ctx);
  if (packagePaths.length <= 1) {
    return ctx;
  }
  const blank = " ".repeat(process.stdout?.columns || 80);
  let choices = packagePaths.map((item) => {
    const filePath = resolve(cwd, item);
    const dir = dirname(filePath);
    const pkg = getPackageJSON({ ...ctx, cwd: dir, programmatic: true });
    return {
      title: pkg.name ?? item,
      value: dir,
      description: `${pkg.description ?? filePath}${blank}`,
      scripts: pkg.scripts
    };
  });
  if (command) {
    choices = choices.filter((c) => c.scripts?.[command]);
  }
  if (!choices.length) {
    return ctx;
  }
  if (choices.length === 1) {
    return { ...ctx, cwd: choices[0].value };
  }
  const fzf = new Fzf(choices, {
    selector: (item) => `${item.title} ${item.description}`,
    casing: "case-insensitive",
    tiebreakers: [byLengthAsc]
  });
  let res;
  try {
    const { pkg } = await prompts({
      name: "pkg",
      message: "select a package",
      type: "autocomplete",
      choices,
      async suggest(input, choices2) {
        if (!input)
          return choices2;
        const results = fzf.find(input);
        return results.map((r) => choices2.find((c) => c.value === r.item.value));
      }
    });
    if (!pkg)
      throw new Error("No package selected");
    res = pkg;
  } catch (error) {
    if (!ctx?.programmatic)
      process.exit(1);
    throw error;
  }
  return { ...ctx, cwd: res };
}

async function readWorkspaceScripts(ctx, args) {
  const index = args.findIndex((i) => i === "-p");
  let command = "";
  if (index !== -1) {
    command = args[index + 1];
  }
  const context = await promptSelectPackage(ctx, command);
  if (ctx && context?.cwd) {
    ctx.cwd = context.cwd;
  }
  const scripts = readPackageScripts(context);
  const cmdIndex = scripts.findIndex((i) => i.key === command);
  if (command && cmdIndex !== -1) {
    return [scripts[cmdIndex]];
  }
  return scripts;
}
function readPackageScripts(ctx) {
  const pkg = getPackageJSON(ctx);
  const rawScripts = pkg.scripts || {};
  const scriptsInfo = pkg["scripts-info"] || {};
  const scripts = Object.entries(rawScripts).filter((i) => !i[0].startsWith("?")).map(([key, cmd]) => ({
    key,
    cmd,
    description: scriptsInfo[key] || rawScripts[`?${key}`] || cmd
  }));
  if (scripts.length === 0 && !ctx?.programmatic) {
    console.warn("No scripts found in package.json");
  }
  return scripts;
}

const rawBashCompletionScript = `
###-begin-nr-completion-###

if type complete &>/dev/null; then
  _nr_completion() {
    local words
    local cur
    local cword
    _get_comp_words_by_ref -n =: cur words cword
    IFS=$'\\n'
    COMPREPLY=($(COMP_CWORD=$cword COMP_LINE=$cur nr --completion \${words[@]}))
  }
  complete -F _nr_completion nr
fi

###-end-nr-completion-###
`.trim();
const rawZshCompletionScript = `
#compdef nr

_nr_completion() {
  local -a completions
  completions=("\${(f)$(nr --completion $words[2,-1])}")
  
  compadd -a completions
}

_nr_completion
`.trim();
const rawFishCompletionScript = `
function _nr_completion
  set -l tokens (commandline -xpc)
  if test (count $tokens) -ge 1
    set tokens $tokens[2..-1]
  end
  nr --completion $tokens 2>/dev/null
end

complete -c nr -f -a '(_nr_completion)' -d 'package.json scripts'
`.trim();
function getCompletionSuggestions(args, ctx) {
  const raw = readPackageScripts(ctx);
  const fzf = new Fzf(raw, {
    selector: (item) => item.key,
    casing: "case-insensitive",
    tiebreakers: [byLengthAsc]
  });
  const results = fzf.find(args[1] || "");
  return results.map((r) => r.item.key);
}

let storage;
const storagePath = resolve(CLI_TEMP_DIR, "_storage.json");
async function load(fn) {
  if (!storage) {
    storage = existsSync(storagePath) ? JSON.parse(await promises.readFile(storagePath, "utf-8") || "{}") || {} : {};
  }
  return storage;
}
async function dump() {
  if (storage)
    await writeFileSafe(storagePath, JSON.stringify(storage));
}

runCli(async (agent, args, ctx) => {
  const storage = await load();
  const promptSelectScript = async (raw) => {
    const terminalColumns = process.stdout?.columns || 80;
    const last = storage.lastRunCommand;
    const choices = raw.reduce((acc, { key, description }) => {
      const item = {
        title: key,
        value: key,
        description: limitText(description, terminalColumns - 15)
      };
      if (last && key === last) {
        return [item, ...acc];
      }
      return [...acc, item];
    }, []);
    const fzf = new Fzf(raw, {
      selector: (item) => `${item.key} ${item.description}`,
      casing: "case-insensitive",
      tiebreakers: [byLengthAsc]
    });
    let isExited = false;
    try {
      const { fn } = await prompts({
        name: "fn",
        message: "script to run",
        type: "autocomplete",
        choices,
        async suggest(input, choices2) {
          if (!input)
            return choices2;
          const results = fzf.find(input);
          return results.map((r) => choices2.find((c) => c.value === r.item.key));
        },
        onState(state) {
          if (state.exited)
            isExited = true;
        }
      });
      if (!fn || isExited)
        process.exit(1);
      args.push(fn);
    } catch {
      process.exit(1);
    }
  };
  if (args[0] === "--completion") {
    const compLine = process.env.COMP_LINE;
    const rawCompCword = process.env.COMP_CWORD;
    if (compLine !== void 0 && rawCompCword !== void 0) {
      const compCword = Number.parseInt(rawCompCword, 10);
      const compWords = args.slice(1);
      if (compCword === 1) {
        const suggestions = getCompletionSuggestions(compWords, ctx);
        console.log(suggestions.join("\n"));
      }
    } else {
      const suggestions = getCompletionSuggestions(args, ctx);
      console.log(suggestions.join("\n"));
    }
    return;
  }
  if (args[0] === "-p") {
    const raw = await readWorkspaceScripts(ctx, args);
    if (raw.length > 1) {
      await promptSelectScript(raw);
    }
  }
  if (args[0] === "-") {
    if (!storage.lastRunCommand) {
      if (!ctx?.programmatic) {
        console.error("No last command found");
        process.exit(1);
      }
      throw new Error("No last command found");
    }
    args[0] = storage.lastRunCommand;
  }
  if (args.length === 0 && !ctx?.programmatic) {
    const raw = readPackageScripts(ctx);
    await promptSelectScript(raw);
  }
  if (storage.lastRunCommand !== args[0]) {
    storage.lastRunCommand = args[0];
    dump();
  }
  return parseNr(agent, args, ctx);
}, {
  onBeforeCommand: (args, ctx) => {
    if (args[0] === "--completion-zsh") {
      console.log(rawZshCompletionScript);
      return ctx.exit();
    }
    if (args[0] === "--completion-bash") {
      console.log(rawBashCompletionScript);
      return ctx.exit();
    }
    if (args[0] === "--completion-fish") {
      console.log(rawFishCompletionScript);
      return ctx.exit();
    }
  }
});
