
const input = Number(process.argv[2]) || 0;
const data = require('./day17-data')[input].split(/\n/);


const map = [];
let maxX = 500;
let minX = 99999;
let maxY = 0;
let minY = 99999;
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
  maxY = Math.max(maxY, y[0], ((y[1]) ? y[1]:0));
  minY = Math.min(minY, y[0], ((y[1]) ? y[1]:99999));

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

// Water flows...
const verticals = [];
goVertical(0, 500);

// Tally all water
let waterSpots = 0;
for (let y=minY; y<maxY+1; y++) {
  for (let x=minX; x<maxX+1; x++) {
    if (map[y][x] === '~') {
      waterSpots++;
    }
  }
}

console.log('<><><><><><><><><><>');
print();
console.log(`Found ${waterSpots} water spots`);
console.log(`X range: ${minX}->${maxX}; Y range: ${minY}->${maxY}`);

function goVertical(flowY, flowX) {
  if (verticals.indexOf([flowY, flowX].join(',')) > -1) {
    return;
  }
  verticals.push([flowY, flowX].join(','));
  
  // console.log('going vertical from', flowY, flowX);
  for (let y=flowY; y<maxY+1; y++) {
    if (map[y][flowX] === '#') {
      // console.log('found vein', y, flowX);
      goHorizontal(y-1, flowX);
      break;
    } else {
      map[y][flowX] = '~';
    }
  }
}

function goHorizontal(flowY, flowX) {
  // console.log('going horizontal from', flowY, flowX);
  let leftX = null;
  let rightX = null;
  
  // find left side
  for (let x=flowX-1; x>minX-2; x--) {
    if (map[flowY][x] === '#') {
      leftX = x;
      break;
    } else if (map[flowY+1][x] !== '#' && map[flowY+1][x] !== '~') {
      if (verticals.indexOf([flowY, x+1].join(',')) < 0) {
        for (let wx=x; wx<flowX; wx++) {
          map[flowY][wx] = '~';
        }
        goVertical(flowY, x);
      }
      break;
    }
  }
  
  // find right side
  for (let x=flowX+1; x<maxX+2; x++) {
    if (map[flowY][x] === '#') {
      rightX = x;
      break;  
    } else if (map[flowY+1][x] !== '#' && map[flowY+1][x] !== '~') {
      if (verticals.indexOf([flowY, x-1].join(',')) < 0) {
        for (let wx=x; wx>flowX; wx--) {
          map[flowY][wx] = '~';
        }
        goVertical(flowY, x);
      }
      break;
    }
  }
  
  if (leftX) {
    for (let x=flowX; x>leftX; x--) {
      map[flowY][x] = '~';
    }
  }
  if (rightX) {
    for (let x=flowX; x<rightX; x++) {
      map[flowY][x] = '~';
    }
  }
  
  // In a bucket...
  if (leftX && rightX) {
    goHorizontal(flowY-1, flowX);
  }
}


function print() {
  map.forEach((row) => {
    let printRow = '';
    for (let i=minX-1; i<(maxX+2); i++) {
      printRow += (row[i]) ? row[i] : '.';
    }
    console.log(printRow);
  });
}
