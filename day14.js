
const input = 0;
const recipeCount = Number(require('./day14-data')[input]);

const recipes = [ 3, 7 ];
const elves = [ 0, 1 ];

print();

while (true) {
  const total = elves.reduce((total, e) => {
    return total + recipes[e];
  }, 0);
  
  ('' + total).split('').forEach((d) => { recipes.push(Number(d)); });
  if (recipes.length > (recipeCount + 10)) {
    break;
  }
  
  for (let i=0; i<elves.length; i++) {
    elves[i] = elves[i] + recipes[elves[i]] + 1;
    while (elves[i] >= recipes.length) {
      elves[i] = elves[i] - recipes.length;
    }
    // console.log(`moving elf ${i} to ${elves[i]}`);
  }
  
  // print();
}

console.log(`ten after ${recipeCount}:`, recipes.join('').substr(recipeCount, 10));


function print() {
  let line = '';
  recipes.forEach((r, i) => {
    let score = ` ${r} `;
    if (elves[0] === i) { score = `(${r})`; }
    if (elves[1] === i) { score = `[${r}]`; }
    line += score;
  });
  console.log(line);
}
