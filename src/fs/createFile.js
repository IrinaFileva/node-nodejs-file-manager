import { join, sep } from 'path';
import { createWriteStream } from 'fs';
import { access, constants } from 'fs/promises';

export const createFile = async( workingDir, line ) => {

  const fileName = line.split(' ')[1].replace(`${sep}`, '');

  if (!fileName || fileName.length < 1) {
    throw new Error('Invalid input');
  }

  const pathFile = join(workingDir, fileName);

  try {
    await access(pathFile, constants.F_OK);
    throw new Error('Operation failed');
  } catch (err) {
    if (err.code === 'ENOENT') {
      createWriteStream(pathFile);
      console.log('File added');
    } else {
      console.error(err.message);
    }
  }
};
