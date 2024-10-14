import { join, sep } from 'path';

export const up = ( workingDir ) => {

  const dir = workingDir.split(sep);

  if(dir.length < 1) {
    return dir[0];
  } else {
    return join(...dir, '..');
  }
};
