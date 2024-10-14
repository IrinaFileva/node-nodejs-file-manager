import { homedir } from "os";
import { getUserName } from "./cli/args.js";
import { stdin, stdout } from 'process';
import { listenCommandLine } from "./cli/op.js";
import readline from "readline/promises";

const line = readline.createInterface({input: stdin, output: stdout});

const name = getUserName();
let workingDir = homedir();

line.write(`Welcome to the File Manager, ${name}!\n`);
line.write(`\nYou are currently in ${workingDir}\n`);
line.setPrompt('Please enter the command \n\n');


line.prompt();

listenCommandLine(line, name, workingDir);