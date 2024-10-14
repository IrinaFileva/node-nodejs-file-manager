import { stdout } from 'process';
import { join, isAbsolute } from 'path';
import { access, stat, constants } from 'fs/promises';
import { createReadStream } from 'fs';

const { createHash } = await import('crypto');

export const calcHash = async(workingDir, line) => {

  const fileName = line.split(' ').filter((item) => item !== '')[1];

  if (!fileName || fileName.length < 1) throw new Error('Invalid input');

  const pathFile = isAbsolute(fileName)? fileName : join(workingDir, fileName);

  await access(pathFile, constants.F_OK).catch(() => { throw new Error('Operation failed') });
  const file = await stat(pathFile);

  if (!file.isFile()) throw new Error('Operation failed');

  try{
    const hash = createHash('sha256');
    const input = createReadStream(pathFile);
    const data = input.pipe(hash).setEncoding('hex');
    data.on('data', (details) => stdout.write(`File hash: ${details}\n`));

  } catch(err) {
    console.error(err.message);
  }
};
