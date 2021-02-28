#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const { prompt } = require('enquirer');

const cwd = process.cwd();

const renameFiles = {
  _gitignore: '.gitignore'
}

async function init() {
  let targetDir = argv._[0];

  if (!targetDir) {
    const { projectName } = await prompt({
      type: 'input',
      name: 'projectName',
      message: 'Enter project name:',
      initial: 'vite-ts-project'
    });
    targetDir = projectName
  }

  const root = path.join(cwd, targetDir);
  console.info(`\nProject will be created in ${root}`);

  // TODO: check if target directory is empty

  const templateDir = path.join(__dirname, 'template');
  console.info(`Template: ${templateDir}`);
  console.info(`${path.basename(root)}`)
}

init().catch(error => {
  console.error(error);
})
