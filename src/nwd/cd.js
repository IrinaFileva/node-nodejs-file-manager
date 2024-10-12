import { access, stat, constants } from 'fs/promises';
import { join, sep, isAbsolute, resolve } from 'path';

export const cd = async ( workingDir, line ) => {
  const dir = line.split(' ')[1];

  if (!dir || dir.length < 1) {
    throw new Error('Invalid input');
  }

  let newPath;

  if (isAbsolute(dir)) {
    newPath = resolve(workingDir, dir);
  } else {
    newPath = join(workingDir, `${sep}${dir}`);
  }

  await access(newPath, constants.F_OK).catch(() => { throw new Error('Operation failed') });
  const directory = await stat(newPath);

  if (!directory.isDirectory()) {
    throw new Error('Operation failed');
  }

  return newPath;
};
