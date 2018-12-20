
const input = Number(process.argv[2]) || 0;
const data = require('./day18-data')[input].split(/\n/);
const minutes = 1000;
let forest = [];

class Acre {
  constructor(i, j, state) {
    this.i = i;
    this.j = j;
    this.state = state;
    this.previous = state;
    this.before = [];
    this.after = [];
  }
  
  fill() {
    for (let j=this.j-1; j<this.j+2; j++) {
      if (forest[this.i-1] && forest[this.i-1][j]) {
        this.before.push(forest[this.i-1][j]);
      }
      if (forest[this.i+1] && forest[this.i+1][j]) {
        this.after.push(forest[this.i+1][j]);
      }
    }
    if (forest[this.i] && forest[this.i][this.j-1]) {
      this.before.push(forest[this.i][this.j-1]);
    }
    if (forest[this.i] && forest[this.i][this.j+1]) {
      this.after.push(forest[this.i][this.j+1]);
    }
  }
  
  next() {
    this.previous = this.state;
    if (this.state === '.') {
      this.state = this.checkClearing();
    } else if (this.state === '|') {
      this.state = this.checkWoods();
    } else if (this.state === '#') {
      this.state = this.checkYard();
    }
  }
  
  checkClearing() {
    let count = 0;
    for (let i=0; i<this.before.length; i++) {
      if (this.before[i].previous === '|') {
        count++;
      }
    }
    for (let i=0; i<this.after.length; i++) {
      if (this.after[i].state === '|') {
        count++;
      }
    }
    return (count > 2) ? '|' : '.';
  }
  
  checkWoods() {
    let count = 0;
    for (let i=0; i<this.before.length; i++) {
      if (this.before[i].previous === '#') {
        count++;
      }
    }
    for (let i=0; i<this.after.length; i++) {
      if (this.after[i].state === '#') {
        count++;
      }
    }
    return (count > 2) ? '#' : '|';
  }
  
  checkYard() {
    let treeCount = 0;
    let yardCount = 0;
    for (let i=0; i<this.before.length; i++) {
      if (this.before[i].previous === '|') {
        treeCount++;
      } else if (this.before[i].previous === '#') {
        yardCount++;
      }
    }
    for (let i=0; i<this.after.length; i++) {
      if (this.after[i].state === '|') {
        treeCount++;
      } else if (this.after[i].state === '#') {
        yardCount++;
      }
    }
    return (treeCount > 0 && yardCount > 0) ? '#' : '.';
  }
  
}


for (let i=0; i<data.length; i++) {
  forest.push([]);
  data[i].split('').forEach((acre, j) => {
    forest[i][j] = new Acre(i, j, acre);
  });
}
for (let i=0; i<forest.length; i++) {
  for (let j=0; j<forest[i].length; j++) {
    forest[i][j].fill();
  }
}

// print();

const scores = [];
for (let min=0; min<minutes; min++) {
  for (let i=0; i<forest.length; i++) {
    for (let j=0; j<forest.length; j++) {
      forest[i][j].next();
    }
  }
  
  const s = score();
  if (scores.indexOf(s) > -1) {
    console.log(`SCORE: ${s}... saw this score ${scores.length - scores.lastIndexOf(s)} minutes ago at index ${scores.lastIndexOf(s)}`);
  }
  scores.push(s);
  
  // print();
  if (!(min % 100000)) {
    console.log(`minute ${min}`);
  }
}

function score() {
  let yardCount = 0;
  let treeCount = 0;
  for (let i=0; i<forest.length; i++) {
    for (let j=0; j<forest.length; j++) {
      if (forest[i][j].state === '|') {
        treeCount++;
      } else if (forest[i][j].state === '#') {
        yardCount++;
      }
    }
  }
  return treeCount * yardCount;
}

// console.log(`After ${minutes} minutes: ${treeCount} woods and ${yardCount} lumberyards for a score of ${treeCount * yardCount}`);


function print() {
  console.log('<><><><><><><><><><><><><>');
  forest.forEach((row) => {
    console.log(row.map((a) => a.state).join(''));
  });
}
