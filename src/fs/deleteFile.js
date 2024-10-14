import { rm } from 'fs/promises';
import { join, isAbsolute } from 'path';
import { access, constants, stat } from 'fs/promises';

export const deleteFile = async (workingDir, line) => {

  const fileName = line.split(' ').filter((item) => item !== '')[1];

  if (!fileName || fileName.length < 1) throw new Error('Invalid input');

  const pathFile = isAbsolute(fileName) ? fileName : join(workingDir, fileName);

  try {
    await access(pathFile, constants.F_OK).catch(() => { throw new Error('Operation failed') });
    const file = await stat(pathFile);
    if (!file.isFile()) throw new Error('Operation failed');

    await rm (pathFile);
    console.log('File deleted');

  } catch(err) {
    console.error(err.message);
  }
};
