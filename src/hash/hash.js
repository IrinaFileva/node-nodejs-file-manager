import { join, sep } from 'path';
import { access, stat, constants } from 'fs/promises';
import { createReadStream } from 'fs';

const { createHash } = await import('crypto');

export const calcHash = async(workingDir, line) => {

  const fileName = line.split(' ')[1].replace(`${sep}`, '');

  if (!fileName || fileName.length < 1) throw new Error('Invalid input');

  const pathFile = join(workingDir, fileName);

  await access(pathFile, constants.F_OK).catch(() => { throw new Error('Operation failed') });
  const file = await stat(pathFile);

  if (!file.isFile()) throw new Error('Operation failed');

  try{
    const hash = createHash('sha256');
    const input = createReadStream(pathFile);
    const data = input.pipe(hash).setEncoding('hex');
    data.on('data', (details) => console.log(`File hash: ${details}`));

  } catch(err) {
    console.error(err.message);
  }
};
