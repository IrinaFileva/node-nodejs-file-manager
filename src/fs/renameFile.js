import { join } from 'path';
import { access, constants, rename } from 'fs/promises';

export const renameFile = async (workingDir, line) => {

  const args = line.split(' ').slice(1);

  if (!args || args.length < 2) {
    throw new Error('Invalid input');
  }

  const oldName = join(workingDir, args[0]);
  const newName = join(workingDir, args[1]);

  try {
    await access(oldName, constants.F_OK).catch(() => { throw new Error('Operation failed') });
    await access(newName, constants.F_OK).then(() => { throw new Error('Operation failed') })
      .catch(async() => {
        await rename(oldName, newName);
        console.log('File renamed');
      });
  } catch(err) {
    console.error(err.message);
  }
};
