
const input = Number(process.argv[2]) || 0;
const data = require('./day25-data')[input].split(/\n/);

const stars = data.map((p, i) => {
  return {
    id: i+1,
    coords: p.split(/,/).map((n) => { return Number(n); }),
    neighbors: []
  }
});

stars.forEach((s, i) => {
  
  for (let j=i+1; j<stars.length; j++) {
    const distance = Math.abs(stars[j].coords[0]-s.coords[0]) + Math.abs(stars[j].coords[1]-s.coords[1]) + Math.abs(stars[j].coords[2]-s.coords[2]) + Math.abs(stars[j].coords[3]-s.coords[3]);
    if (distance < 4) {
      s.neighbors.push(stars[j]);
      stars[j].neighbors.push(s);
    }
  }
  
});

// stars.forEach((s) => {
//   console.log(`star ${s.id} at ${s.coords} with neighbors: ${s.neighbors.map((n) => { return ` ${n.id}:[${n.coords.join(',')}] `; })}`);
// });


let constellations = [];

stars.forEach((s) => {
  let match = false;
  for (let ic=0; ic<constellations.length; ic++) {
    if (constellations[ic].indexOf(s) > -1) {
      // console.log(`${s.coords} is already in constellation starting at ${constellations[ic][0].id}:${constellations[ic][0].coords}`);
      match = true;
      break;
    }
  }

  if (!match) {
    // console.log(`NEW constellation starting at ${s.id}:${s.coords}`);
    const c = [];
    addStar(s, c);
    constellations.push(c);
  }
});

function addStar(s, c) {
  s.neighbors.forEach((n) => {
    if (c.indexOf(n) < 0) {
      c.push(n);
      addStar(n, c);
    }
  });
}

// console.log(constellations.map((c) => { return c.map((s) => { return `${s.id}:${s.coords}`; }); }));

console.log(`There are ${constellations.length} constellations in the sky.`);
