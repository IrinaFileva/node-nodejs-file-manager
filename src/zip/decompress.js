import { pipeline } from 'stream/promises';
import { join, isAbsolute, sep } from 'path';
import { createBrotliDecompress } from 'zlib';
import { access, constants, stat, rm } from 'fs/promises';
import { createReadStream, createWriteStream} from 'fs';

export const decompressFile = async (workingDir, line) => {
  const args = line.split(' ').filter((item) => item !== '').slice(1);

  if (!args || args.length < 2) throw new Error('Invalid input');

  const pathBrotliFile = isAbsolute(args[0]) ? args[0] : join(workingDir, args[0]);
  const fileName = pathBrotliFile.split(sep).slice(-1)[0].replace('.br', '');
  const pathNewFile = isAbsolute(args[1]) ? args[1] : join(workingDir, args[1]);

  let decompressPathFile;

  try {
    await access(pathBrotliFile, constants.F_OK).catch(() => { throw new Error('Operation failed') });

    const file = await stat(pathBrotliFile);

    if (!file.isFile()) throw new Error('Operation failed');

    if (pathNewFile.split(`${sep}`).reverse()[0].includes('.')) {
      decompressPathFile = pathNewFile;
    } else {
      decompressPathFile = join(pathNewFile, fileName);
    }

    try {
      await access(decompressPathFile);
      throw new Error('Operation failed\nFile already exists in this folder');
    } catch (err) {
      if (err.code === 'ENOENT') {

        const startFile = createReadStream(pathBrotliFile);
        const endFile = createWriteStream(decompressPathFile);
        const brotli = createBrotliDecompress();

        await pipeline(startFile, brotli, endFile);
        await rm(pathBrotliFile);

        console.log('File decompressed');
      } else {
        console.error(err.message);
      }
    }
  } catch(err) {
    console.error(err.message);
  }
};
