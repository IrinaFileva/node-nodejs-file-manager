import { readdir } from 'fs/promises';

export const ls = async (workingDir) => {
  const files = [];
  const dirs = [];

  const data = await readdir(workingDir, { withFileTypes: true });

  data.forEach((item) => {
    if (item.isFile()) {
      files.push({ Name: item.name, Type: 'file'});
    } else {
      dirs.push({ Name: item.name, Type: 'directory'});
    }
  });

  const sortDirs = dirs.sort((a,b) => a.Name < b.Name);
  const sortFiles = files.sort((a,b) => a.Name < b.Name);

  const allData = sortDirs.concat(sortFiles);

  console.table(allData);
};
