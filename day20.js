
const input = Number(process.argv[2]) || 0;
const data = require('./day20-data')[input];

let pieces = data.substr(1, data.length-2);

const rooms = { '0,0': 0 };
let location = [0,0];
let distance = 0;
const branchLocations = [];

while (pieces.length) {
  const next = pieces.match(/^([NESW]+)((?:\(|$).*)/);
  
  if (next) {
    pieces = next[2];
    followPath(next[1]);
  } else {
    
    if (pieces[0] === '(') {
      branchLocations.push([location.slice(), distance]);
      followBranch();
      
    } else if (pieces[0] === '|') {
      // console.log('branch detected, reseting location/distance to', branchLocations[branchLocations.length-1][0], branchLocations[branchLocations.length-1][1]);
      location = branchLocations[branchLocations.length-1][0];
      distance = branchLocations[branchLocations.length-1][1];
      
      if (pieces[1] === ')') {  // no actual branch
        // console.log('popping off branch', branchLocations.pop(), branchLocations);
        branchLocations.pop()
        pieces = pieces.substr(2);
        // console.log('no next branch, new pieces:', pieces);
      } else {
        followBranch();
      }
      
    } else if (pieces[0] === ')') {
      // console.log('popping off branch', branchLocations.pop(), branchLocations);
      branchLocations.pop()
      pieces = pieces.substr(1);
      
    } else {
      followBranch();
    }
  }
}

// console.log(rooms);
let holdMaxDoors = 0;
Object.keys(rooms).forEach((room) => {
  if (rooms[room] > holdMaxDoors) {
    holdMaxDoors = rooms[room];
  }
});
console.log(`Furthest room is ${holdMaxDoors} away.`);


function followBranch() {
  const next = pieces.match(/^(?:\(|\|)?([NESW]+)(.+)/);
  pieces = next[2];
  followPath(next[1]);
}

function followPath(path) {
  // console.log(`following path from ${location}`, path);
  path.split('').forEach((step) => {
    if (step === 'N') { location[1]--; }
    if (step === 'E') { location[0]++; }
    if (step === 'S') { location[1]++; }
    if (step === 'W') { location[0]--; }
    
    distance++;
    
    if (!rooms[location.join(',')]) {
      rooms[location.join(',')] = distance;
    }
  });
  // console.log(`ended at ${location} with distance ${distance}`);
}
