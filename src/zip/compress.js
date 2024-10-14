import { createReadStream, createWriteStream} from 'fs';
import { pipeline } from 'stream/promises';
import { join, sep, isAbsolute } from 'path';
import { access, constants, stat, rm } from 'fs/promises';
import { createBrotliCompress } from 'zlib';

export const compressFile = async(workingDir, line) => {

  const args = line.split(' ').filter((item) => item !== '').slice(1);

  if (!args || args.length < 2) {
    throw new Error('Invalid input');
  }

  const pathFile = isAbsolute(args[0]) ? args[0] : join(workingDir, args[0]);
  const fileName = pathFile.split(sep).slice(-1);
  const pathBrotliFile = isAbsolute(args[1]) ? args[1] : join(workingDir, args[1]);

  let pathArchiveFile;

  try {
    await access(pathFile, constants.F_OK).catch(() => { throw new Error('Operation failed') });

    const file = await stat(pathFile);

    if (!file.isFile()) throw new Error('Operation failed');
    if (pathBrotliFile.includes('.br')) {
      pathArchiveFile = pathBrotliFile;
    } else {
      pathArchiveFile = join(pathBrotliFile, `${fileName}.br`)
    }

    try {
      await access(pathArchiveFile);
      throw new Error('Operation failed\nFile already exists in this folder');
     } catch (err) {
      if (err.code === 'ENOENT') {
        const startFile = createReadStream(pathFile);
        const endFile = createWriteStream(pathArchiveFile);
        const brotli = createBrotliCompress();
        await pipeline(startFile, brotli, endFile);
        await rm(pathFile);
        console.log('File compressed');
      } else {
        console.error(err.message);
      }
    }
  } catch(err) {
    console.log(err.message)
  }
}