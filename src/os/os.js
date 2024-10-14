import { EOL, cpus, homedir, userInfo, arch} from 'os';

export const infoOS = (line) => {
  const arg = line.split('--').slice(1);

  if (!arg || arg.length < 1) throw new Error('Invalid input');

  try {
    switch(arg[0]) {
      case 'EOL':
        console.log(`Default end of line: ${JSON.stringify(EOL)}`);
        break;
      case 'cpus':
        console.log(`Total number of CRUPs on this machine: ${cpus().length}`);
        console.table(
          cpus().map((cp) => ({
            'model': cp.model,
            'rate': (cp.speed / 1000).toFixed(2) + ' GHz'
          }))
        );
        break;
      case 'homedir':
        console.log(`Home directory: ${homedir()}`);
        break;
      case 'username':
        console.log(`Current system user name: ${userInfo().username} `);
        break;
      case 'architecture':
        console.log(`CPU architecture: ${arch()}`);
        break;
      default:
        throw new Error('Invalid input');
    }
  } catch(err) {
    console.error(err.message);
  }
};
