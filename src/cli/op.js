import { stdout } from 'process';
import { up } from '../nwd/up.js';
import { cd } from '../nwd/cd.js';
import { ls } from '../nwd/ls.js';
import { readFile } from '../fs/readFile.js';
import { createFile } from '../fs/createFile.js';
import { renameFile } from '../fs/renameFile.js';
import { copyFile } from '../fs/copyFile.js';
import { moveFile } from '../fs/moveFile.js';
import { deleteFile } from '../fs/deleteFile.js';
import { infoOS } from '../os/os.js';
import { calcHash } from '../hash/hash.js';
import { compressFile } from '../zip/compress.js';
import { decompressFile } from '../zip/decompress.js';

export const listenCommandLine = (line, name, workingDir ) => {
  line.on('line', async (comLine) => {

    const command = comLine.split(' ').filter((item) => item !== '')[0];

    try {
      switch(command) {
        case '.exit':
          line.close();
          break;
        case 'up':
          workingDir = up(workingDir);
          break;
        case 'cd':
          workingDir = await cd(workingDir, comLine);
          break;
        case 'ls':
          await ls(workingDir);
          break;
        case 'cat':
          await readFile(workingDir, comLine);
          break;
        case 'add':
          await createFile(workingDir, comLine);
          break;
        case 'rn':
          await renameFile(workingDir, comLine);
          break;
        case 'cp':
          await copyFile(workingDir, comLine);
          break;
        case 'mv':
          await moveFile(workingDir, comLine);
          break;
        case 'rm':
          await deleteFile(workingDir, comLine);
          break;
        case 'os':
          infoOS(comLine);
          break;
        case 'hash':
          await calcHash(workingDir, comLine);
          break;
        case 'compress':
          await compressFile(workingDir, comLine);
          break;
        case 'decompress':
          await decompressFile(workingDir, comLine);
          break;
        default:
          throw new Error('Invalid input');
      }
    } catch(err) {
      console.error(err.message);
    }

    stdout.write(`\nYou are currently in ${workingDir}\n`)
    line.prompt();
  });

  line.on('close', () => {
    stdout.write(`Thank you for using File Manager, ${name}, goodbye!\n`);
    process.exit(0);
  })
}