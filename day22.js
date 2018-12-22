
const input = Number(process.argv[2]) || 0;
const data = require('./day22-data')[input].split(/\n/);

const depth = Number(data[0].split(/: /)[1]);
const target = data[1].split(/: /)[1].split(/,/).map((c) => Number(c));

console.log(`Depth: ${depth}; target: ${target}`);

const cave = [];

/*
The region at 0,0 (the mouth of the cave) has a geologic index of 0.
The region at the coordinates of the target has a geologic index of 0.
If the region's Y coordinate is 0, the geologic index is its X coordinate times 16807.
If the region's X coordinate is 0, the geologic index is its Y coordinate times 48271.
Otherwise, the region's geologic index is the result of multiplying the erosion levels of the regions at X-1,Y and X,Y-1.

A region's erosion level is its geologic index plus the cave system's depth, all modulo 20183. Then:

If the erosion level modulo 3 is 0, the region's type is rocky.
If the erosion level modulo 3 is 1, the region's type is wet.
If the erosion level modulo 3 is 2, the region's type is narrow.
 */

for (let i=0; i<target[1]*1.05; i++) {
  cave.push([]);
  for (let j=0; j<target[0]*2; j++) {
    const region = { geoIndex: 0, erosionLevel: 0 };
    
    if (i === 0) { region.geoIndex = j * 16807; }
    if (j === 0) { region.geoIndex = i * 48271; }
    if (i > 0 && j > 0) { region.geoIndex = cave[i][j-1].erosionLevel * cave[i-1][j].erosionLevel; }
    if (i === target[1] && j === target[0]) { region.geoIndex = 0; }
    
    region.erosionLevel = (region.geoIndex + depth) % 20183;
    
    // console.log(`Region for ${j},${i}: g:${region.geoIndex}, e:${region.erosionLevel} (${region.erosionLevel % 3})`);
    cave[i].push(region);
  }
}

let risk = 0;
for (let i=0; i<cave.length; i++) {
  let caveRow = '';
  for (let j=0; j<cave[0].length; j++) {
    if (cave[i][j].erosionLevel % 3 === 1) {
      if (i < target[1]+1 && j < target[0]+1) { risk += 1; }
      caveRow += '=';
    } else if (cave[i][j].erosionLevel % 3 === 2) {
      if (i < target[1]+1 && j < target[0]+1) { risk += 2; }
      caveRow += '|';
    } else {
      caveRow += '.';
    }
  }
  console.log(caveRow);
}

console.log(`Total risk for this cave: ${risk}`);
