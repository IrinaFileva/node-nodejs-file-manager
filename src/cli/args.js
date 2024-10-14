import { argv } from 'node:process';

export const getUserName = () => {

  let userName = argv.filter((arg) => arg.startsWith('--'))[0].replace('--username=', '');

  if (userName === '' || !userName) {
    userName = 'anonymous user';
  }

  return userName;
};
