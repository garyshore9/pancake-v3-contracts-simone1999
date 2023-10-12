import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import chalk from 'chalk';
import dotenv from 'dotenv';
import findConfig from 'find-config';

dotenv.config({ path: findConfig('.env') });

let network = process.env.NETWORK;

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    // Split the command string into the command and its arguments
    const [cmd, ...args] = command.split(' ');

    // Spawn a process
    const executedCommand = spawn(cmd, args, { stdio: 'inherit' }); // 'inherit' option makes the child process use the parent's stdio

    executedCommand.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

(async function main() {
  try {
    await executeCommand(`yarn.cmd workspace @pancakeswap/v3-core run hardhat run scripts/deploy.ts --network ${network}`);
    await executeCommand(`yarn.cmd workspace @pancakeswap/v3-periphery run hardhat run scripts/deploy2.ts --network ${network}`);
    await executeCommand(`yarn.cmd workspace @pancakeswap/smart-router run hardhat run scripts/deploy2.ts --network ${network}`);
    await executeCommand(`yarn.cmd workspace @pancakeswap/masterchef-v3 run hardhat run scripts/deploy2.ts --network ${network}`);
    await executeCommand(`yarn.cmd workspace @pancakeswap/v3-lm-pool run hardhat run scripts/deploy2.ts --network ${network}`);

    console.log(chalk.blue('Done!'));

    const m = await fs.readFile(`./projects/masterchef-v3/deployments/${network}.json`, 'utf8');
    const r = await fs.readFile(`./projects/router/deployments/${network}.json`, 'utf8');
    const c = await fs.readFile(`./projects/v3-core/deployments/${network}.json`, 'utf8');
    const p = await fs.readFile(`./projects/v3-periphery/deployments/${network}.json`, 'utf8');
    const l = await fs.readFile(`./projects/v3-lm-pool/deployments/${network}.json`, 'utf8');

    const addresses = {
      ...JSON.parse(m),
      ...JSON.parse(r),
      ...JSON.parse(c),
      ...JSON.parse(p),
      ...JSON.parse(l),
    };

    console.log(chalk.blue('Writing to file...'));
    console.log(chalk.yellow(JSON.stringify(addresses, null, 2)));

    await fs.writeFile(`./deployments/${network}.json`, JSON.stringify(addresses, null, 2), 'utf8');
  } catch (error) {
    console.error('Error during script execution ', error.stack);
  }
})();
