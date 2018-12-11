
const real = 1;
const serial = Number(require('./day11-data')[real]);

const grid = [];
for (let i=0; i<300; i++) {
  grid.push([]);
  for (let j=0; j<300; j++) {
    let power = ('' + (((((j+1) + 10) * (i+1)) + serial) * ((j+1) + 10)));
    if (power.length > 2) {
      power = Number(power.split('').reverse()[2]);
    } else {
      power = 0;
    }
    power -= 5;
    
    grid[i][j] = power;
  }
}

let holdMaxPower = 0;
let holdTopLeft = [];
for (let i=0; i<300; i++) {
  console.log('processing row (Y)', i+1);
  for (let j=0; j<300; j++) {
    for (let l=0; l<(300-(Math.max(i, j))); l++) {
      let power = 0;
      for (let m=0; m<l; m++) {
        for (let n=0; n<l; n++) {
          power += grid[i+m][j+n];
        }
      }
      if (power > holdMaxPower) {
        holdMaxPower = power;
        holdTopLeft = [j+1, i+1, l];
        console.log('new max:', holdTopLeft, holdMaxPower);
      }
    }
  }
}

// console.log('122,79: ', grid[78][121]);
// Serial 18 = 90,269,16
console.log('winner winner chicken dinner:', holdTopLeft, holdMaxPower);
