
const data = require('./day6-data').split(/\n/);

const points = data.map(function(point) {
  return point.split(/, /).map((coor) => Number(coor));
});

const equidistantIndex = 999;
let holdMaxLeft = 0;
let holdMaxTop = 0;
points.forEach(function(point) {
  holdMaxLeft = (point[0] > holdMaxLeft) ? point[0] : holdMaxLeft;
  holdMaxTop = (point[1] > holdMaxTop) ? point[1] : holdMaxTop;
});
holdMaxTop += 2;
holdMaxLeft += 2;

console.log('grid:', holdMaxLeft, holdMaxTop);

const map = [];
const totals = [];
for (let i=0; i<holdMaxTop; ++i) {
  map[i] = [];
  totals[i] = [];
  for (let j=0; j<holdMaxLeft; ++j) {
    
    // Map out closest point...
    let holdLeastDist = 9999;
    let holdPointIndex = null;
    points.forEach(function(point, index) {
      const distance = Math.abs(point[0]-j) + Math.abs(point[1]-i);
      if (distance < holdLeastDist) {
        holdLeastDist = distance;
        holdPointIndex = index;
      } else if (distance === holdLeastDist) {
        holdPointIndex = equidistantIndex;
      }
    });
    map[i][j] = holdPointIndex;
    
    // Determine total distances
    totals[i][j] = points.reduce(function(total, point) {
      return total += Math.abs(point[0]-j) + Math.abs(point[1]-i);
    }, 0);
  }
}

let areas = [];
for (let i=0; i<holdMaxTop; ++i) {
  for (let j=0; j<holdMaxLeft; ++j) {
    if (!areas[map[i][j]]) { areas[map[i][j]] = 0; }
    
    if (i===0 || j===0 || i===(holdMaxTop-1) || j===(holdMaxLeft-1)) {
      areas[map[i][j]] = 'infinite';
    } else if (areas[map[i][j]] !== 'infinite' && map[i][j] !== equidistantIndex) {
      areas[map[i][j]]++;
    }
  }
}

// console.log(map);
// console.log(areas);
console.log('max area', holdMaxTop * holdMaxLeft);

let holdLargest = 0;
let holdLargestIndex = null;
areas.forEach(function(area, i) {
  if (area !== 'infinite' && area > holdLargest) {
    holdLargest = area;
    holdLargestIndex = i;
  }
});

console.log('largest area', holdLargest, 'around pointIndex', holdLargestIndex);

// console.log(totals);

let safeArea = 0;
for (let i=0; i<holdMaxTop; ++i) {
  for (let j=0; j<holdMaxLeft; ++j) {
    if (totals[i][j] < 10000) {
      safeArea++;
    }
  }
}

console.log('Safe Area:', safeArea);
