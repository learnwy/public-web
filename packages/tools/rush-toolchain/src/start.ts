#!/usr/bin/env node

import colors from 'colors';
import child_process from 'child_process';

console.log('Invoking my-toolchain...');

child_process.execSync('tsc', { stdio: 'inherit' });



console.log(colors);
console.log(colors.green);
console.log(colors.green('Success!'));