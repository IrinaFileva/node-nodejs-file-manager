import { stdout } from 'process';
import { join, sep } from 'path';
import { createReadStream } from 'fs';
import { access, stat, constants } from 'fs/promises';

export const readFile = async (workingDir, line) => {

  const fileName = line.split(' ')[1].replace(`${sep}`, '');

  if (!fileName || fileName.length < 1) {
    throw new Error('Invalid input');
  }

  const pathFile = join(workingDir, fileName);

  await access(pathFile, constants.F_OK).catch(() => { throw new Error('Operation failed') });
  const file = await stat(pathFile);

  if (!file.isFile()) {
    throw new Error('Operation failed');
  }

  const readText = createReadStream(pathFile);
  readText.on('data',(details) => stdout.write(details + "\n"));

};
