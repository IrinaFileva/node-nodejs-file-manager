import { join } from 'path';
import { pipeline } from 'stream/promises';
import { access, constants, stat } from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';

export const copyFile = async (workingDir, line) => {

  const args = line.split(' ').slice(1);

  if (!args || args.length < 2) {
    throw new Error('Invalid input');
  }

  const pathFile = join(workingDir, args[0]);
  const pathDir = join(workingDir, args[1]);
  const pathNewFile = join(pathDir, args[0]);

  try {
    await access(pathDir, constants.F_OK).catch(() => { throw new Error('Operation failed') });
    await access(pathFile, constants.F_OK).catch(() => { throw new Error('Operation failed') });

    const file = await stat(pathFile);
    const dir = await stat(pathDir);

    if (!file.isFile()) throw new Error('Operation failed');
    if (!dir.isDirectory()) throw new Error('Operation failed');

    const oldFile = createReadStream(pathFile);
    const copyFile = createWriteStream(pathNewFile);

    await pipeline(oldFile, copyFile);

    console.log('File copied');

  } catch(err) {
    console.error(err.message);
  }
};
