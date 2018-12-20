
const input = Number(process.argv[2]) || 0;
const data = require('./day18-data')[input].split(/\n/);
const minutes = 10;

let forest = data.map((row) => { return row.split(''); });

print();

for (let min=0; min<minutes; min++) {
  const newForest = [];
  for (let i=0; i<forest.length; i++) {
    newForest.push([]);
    for (let j=0; j<forest.length; j++) {
      if (forest[i][j] === '.') {
        newForest[i][j] = checkClearing(i, j);
      } else if (forest[i][j] === '|') {
        newForest[i][j] = checkTrees(i, j);
      } else if (forest[i][j] === '#') {
        newForest[i][j] = checkLumberyard(i, j);
      }
    }
  }
  forest = newForest;
  print();
}

// Scoring
let yardCount = 0;
let treeCount = 0;
for (let i=0; i<forest.length; i++) {
  for (let j=0; j<forest.length; j++) {
    if (forest[i][j] === '|') {
      treeCount++;
    } else if (forest[i][j] === '#') {
      yardCount++;
    }
  }
}
console.log(`After ${minutes} minutes: ${treeCount} woods and ${yardCount} lumberyards for a score of ${treeCount * yardCount}`);


function checkClearing(row, col) {
  let treeCount = 0;
  for (let i=row-1; i<row+2; i++) {
    for (let j=col-1; j<col+2; j++) {
      if (i === row && j === col) { continue; }
      if (forest[i] && forest[i][j] === '|') {
        treeCount++;
      }
    }
  }
  return (treeCount > 2) ? '|' : '.';
}

function checkTrees(row, col) {
  let yardCount = 0;
  for (let i=row-1; i<row+2; i++) {
    for (let j=col-1; j<col+2; j++) {
      if (i === row && j === col) { continue; }
      if (forest[i] && forest[i][j] === '#') {
        yardCount++;
      }
    }
  }
  return (yardCount > 2) ? '#' : '|';
}

function checkLumberyard(row, col) {
  // # => # if adjacent to 1+ # AND 1+ |
  // # => . if not ^
  let treeCount = 0;
  let yardCount = 0;
  for (let i=row-1; i<row+2; i++) {
    for (let j=col-1; j<col+2; j++) {
      if (i === row && j === col) { continue; }
      if (forest[i] && forest[i][j] === '|') {
        treeCount++;
      } else if (forest[i] && forest[i][j] === '#') {
        yardCount++;
      }
    }
  }
  return (treeCount > 0 && yardCount > 0) ? '#' : '.';
}


function print() {
  console.log('<><><><><><><><><><><><><>');
  forest.forEach((row) => {
    console.log(row.join(''));
  });
}
