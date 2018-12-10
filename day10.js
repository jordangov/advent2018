
const real = 1;
const data = require('./day10-data')[real].split(/\n/);

let maxNegX = 0;
let maxNegY = 0;
const points = data.map(function(point) {
  const parts = point.match(/^position=<((?:-| )?[0-9]+), ((?:-| )?[0-9]+)> velocity=<((?:-| )?[0-9]+), ((?:-| )?[0-9]+)>/);
  if (!parts) {
    console.log('bad regex:', point);
  }
  
  let x = Number(parts[1]);
  let y = Number(parts[2]);
  if (x < maxNegX) { maxNegX = x; }
  if (y < maxNegY) { maxNegY = y; }
  
  return {
    location: [x, y],
    velocity: [Number(parts[3]), Number(parts[4])]
  };
});

maxNegX = Math.round(Math.abs(maxNegX) + (Math.abs(maxNegX) * 0.2));
maxNegY = Math.round(Math.abs(maxNegY) + (Math.abs(maxNegY) * 0.2));
points.forEach(function(point) {
  point.location[0] += maxNegX;
  point.location[1] += maxNegY;
});

const map = [];
points.forEach(function(point) {
  if (!map[point.location[1]]) { map[point.location[1]] = []; }
  map[point.location[1]][point.location[0]] = point;
});

let minArea = 99999;
let holdInfo = null;
let holdMap = null;
let time = 0;
while(true) {
  points.forEach(function(point) {
    if (map[point.location[1]][point.location[0]] === point) {
      map[point.location[1]][point.location[0]] = null;
    }
    point.location[0] += point.velocity[0];
    point.location[1] += point.velocity[1];
    
    if (!map[point.location[1]]) { map[point.location[1]] = []; }
    map[point.location[1]][point.location[0]] = point;
  });
  const info = findBoundingBox();
  // console.log(info);
  if (info.area < minArea) {
    minArea = info.area;
    holdInfo = info;
    holdMap = getPrintout([holdInfo.left, holdInfo.right, holdInfo.top, holdInfo.bottom]);
  }
  if (holdInfo && info.area > minArea) {
    break;
  }
  time++;
}
console.log('FINAL:', holdInfo);
console.log('TIME:', time);
console.log(holdMap);


function findBoundingBox() {
  const info = {
    left: 99999, right: 0, top: 99999, bottom: 0
  };
  points.forEach(function(point) {
    if (point.location[0] < info.left) { info.left = point.location[0]; }
    if (point.location[0] > info.right) { info.right = point.location[0]; }
    if (point.location[1] < info.top) { info.top = point.location[1]; }
    if (point.location[1] > info.bottom) { info.bottom = point.location[1]; }
  });
  info.area = (info.right - info.left) * (info.bottom - info.top);
  return info;
}


function getPrintout(box) {
  let print = '';
  for(let i=box[2]-1; i<box[3]+1; i++) {
    let row = '';
    for(let j=box[0]-1; j<box[1]+1; j++) {
      row += (map[i] && map[i][j]) ? '#' : '.';
    }
    print += row + '\n';
  }
  print += (new Array(box[3]-box[2])).fill('>').join('');
  return print;
}
