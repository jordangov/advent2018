
const input = Number(process.argv[2]) || 0;
const data = require('./day17-data')[input].split(/\n/);


const map = [];
let maxX = 500;
let minX = 99999;
map[0] = new Array(maxX + 1);
map[0][500] = '+';

// Creating the subterranean map
data.forEach((vein) => {
  const pieces = vein.split(/, /);
  pieces[0] = pieces[0].split(/=/);
  pieces[1] = pieces[1].split(/=/);
  
  let y = ((pieces[0][0] === 'y') ? pieces[0] : pieces[1])[1];
  let x = ((pieces[0][0] === 'x') ? pieces[0] : pieces[1])[1];
  y = y.split(/\.\./).map((n) => { return Number(n); });
  x = x.split(/\.\./).map((n) => { return Number(n); });
  // console.log('x', x);
  // console.log('y', y);
  
  maxX = Math.max(maxX, x[0], ((x[1]) ? x[1]:0));
  minX = Math.min(minX, x[0], ((x[1]) ? x[1]:99999));

  for (let i=1; i<((y[1]) ? y[1] : y[0])+1; i++) {
    if (!map[i]) { map[i] = new Array(maxX + 1); }
  }
  if (y.length > 1) {
    for (let i=y[0]; i<(y[1]+1); i++) {
      map[i][x[0]] = '#';
    }
  } else {
    for (let i=x[0]; i<(x[1]+1); i++) {
      map[y[0]][i] = '#';
    }
  }
});

print();




function print() {
  map.forEach((row) => {
    let printRow = '';
    for (let i=minX-1; i<(maxX+2); i++) {
      printRow += (row[i]) ? row[i] : '.';
    }
    console.log(printRow);
  });
}
