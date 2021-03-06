#!/usr/bin/env node

import {fileURLToPath} from 'url';
import path from 'path';
import fs from 'fs';
import {copyFile, mkdir, readdir, readFile, writeFile} from 'fs/promises';
import yargs from 'yargs';
import enquirer from 'enquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {{ _: Array.<string> }}
 */
const argv = yargs(process.argv.slice(2)).argv;

const filesToRename = {
  '_gitignore': '.gitignore'
}

async function copyFilesRecursively(srcDir, destDir) {
  const directoryEntries = await readdir(srcDir, {withFileTypes: true});
  for (const entry of directoryEntries) {
    if (entry.name === 'package.json') {
      continue;
    }

    const isDirectory = entry.isDirectory();

    if (isDirectory) {
      const sourceDirectoryToCopy = path.join(srcDir, entry.name);
      const destinationDirectoryCopyTo = path.join(destDir, entry.name);
      await mkdir(destinationDirectoryCopyTo);
      await copyFilesRecursively(sourceDirectoryToCopy, destinationDirectoryCopyTo);
    } else {
      const destFileName = filesToRename[entry.name] ? filesToRename[entry.name] : entry.name;
      const destPath = path.join(destDir, destFileName);
      await copyFile(path.join(srcDir, entry.name), destPath, fs.constants.COPYFILE_EXCL)
    }
  }
}

async function main() {
  const cwd = process.cwd();

  let projectName = argv._[0];
  if (!projectName) {
    const {name} = await enquirer.prompt({
      type: 'input',
      name: 'name',
      message: "Enter project name:",
      initial: "vite-ts-project"
    });

    projectName = name;
  }

  const targetDirectory = path.join(cwd, projectName);
  console.info(`\nProject will be created in ${targetDirectory}`);
  // TODO: Add check for directory existence and ask if can be removed
  await mkdir(targetDirectory);

  // TODO: Add template selector
  const templateDir = path.join(__dirname, 'template-ts');
  await copyFilesRecursively(templateDir, targetDirectory);

  const packageName = path.basename(targetDirectory);
  const templatePackageJsonPath = path.join(templateDir, 'package.json');
  const templatePackageJsonContents = await readFile(templatePackageJsonPath);
  const packageJson = JSON.parse(templatePackageJsonContents.toString());
  packageJson.name = packageName;
  const targetPackageJsonPath = path.join(targetDirectory, 'package.json');
  await writeFile(targetPackageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`\nDone. To start working with the project run:\n`)

  if (targetDirectory !== cwd) {
    console.log(`  cd ${path.relative(cwd, targetDirectory)}`)
  }
  console.log("  npm install");
  console.log("  npm run dev");
}

try {
  await main();
} catch (e) {
  console.error(e);
}
