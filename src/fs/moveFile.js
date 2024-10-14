import { pipeline } from 'stream/promises';
import { join, isAbsolute, sep } from 'path';
import { access, constants, stat, rm } from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';

export const moveFile = async (workingDir, line) => {

  const args = line.split(' ').filter((item) => item !== '').slice(1);

  if (!args || args.length < 2) {
    throw new Error('Invalid input');
  }

  const pathFile = isAbsolute(args[0]) ? args[0] : join(workingDir, args[0]);
  const pathDir = isAbsolute(args[1]) ? args[1] : join(workingDir, args[1]);
  const fileName = pathFile.split(sep).slice(-1).join('');
  const pathNewFile = join(pathDir, fileName);

  try {
    await access(pathDir, constants.F_OK).catch(() => { throw new Error('Operation failed') });
    await access(pathFile, constants.F_OK).catch(() => { throw new Error('Operation failed') });
    const file = await stat(pathFile);
    const dir = await stat(pathDir);

    if (!file.isFile()) throw new Error('Operation failed');
    if (!dir.isDirectory()) throw new Error('Operation failed');

    try {
      await access(pathNewFile, constants.F_OK);
      throw new Error('Operation failed\nThe file already exists in this directory');
    } catch(err) {
      if (err.code === 'ENOENT') {
        const oldFile = createReadStream(pathFile);
        const copyFile = createWriteStream(pathNewFile);

        await pipeline(oldFile, copyFile);

        await rm(pathFile);

        console.log('File moved');
      } else {
        console.error(err.message);
      }
    }
  } catch(err) {
    console.error(err.message);
  }
};