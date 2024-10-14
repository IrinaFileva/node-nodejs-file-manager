import { stdout } from 'process';
import { createReadStream } from 'fs';
import { isAbsolute, resolve } from 'path';
import { access, stat, constants } from 'fs/promises';

export const readFile = async (workingDir, line) => {

  const fileName = line.split(' ').filter((item) => item !== '')[1];

  if (!fileName || fileName.length < 1) {
    throw new Error('Invalid input');
  }

  const pathFile = isAbsolute(fileName)? fileName : resolve(workingDir, fileName);

  await access(pathFile, constants.F_OK).catch(() => { throw new Error('Operation failed') });
  const file = await stat(pathFile);

  if (!file.isFile()) {
    throw new Error('Operation failed');
  }

  const readText = createReadStream(pathFile);
  readText.on('data',(details) => stdout.write(details + "\n"));

};
