
const real = 1;
let data = require('./day8-data')[real];

let node = 0;

/*
3 3 0 2 6 7 1 1 0 1 10 2 2 1 1 2 0 1 9 3 3 0 1 5 2 1 1 3
A-------------------------------------------------------
    B------ C----------- E------------------------
                D-----       F------------ H----
                                 G----
 
 3 3 0 2 6 7 1 1 0 1 10 2 2 1 1 2 0 1 9 3 3 0 1 5 7 1 1 3
 3 3 B13 1 1 D10 2 2 1 1 2 G9 3 3 H5 2 1 1 3
 3 3 B13 C12V0 2 1 1 2 G9 3 3 H5 2 1 1 3
 3 3 B13 C12V0 2 1 F15V0 H5 2 1 1 3
 3 3 B13 C12V0 E27V5 1 1 3
 A76V31
 
 1+1+3 + 6+7 + 2 + 10 + 2 + 3+3 + 9 + 5 = 52
 
*/

let license = data;
let tree = {};

while (true) {
  // console.log(license);
  const leafData = license.match(/ 0 ([0-9]+) ((?:[0-9]+ ){1,20})/);
  if (!leafData) { break; }
  
  const metadata = leafData[2].split(' ').slice(0,Number(leafData[1]));
  const total = metadata.reduce((t, md)=> t + Number(md), 0);
  const leaf = ` 0 ${leafData[1]} ${metadata.join(' ')}`;
  // console.log('leaf!', leaf);
  const label = nextLabel();
  tree[label] = { label, parent: null, total, value: total, children: [] };
  license = `${license.slice(0, license.indexOf(leaf))} ${label}-${total} ${license.slice(license.indexOf(leaf) + leaf.length + 1)}`;
}

let nodeIndex = 0;
while (true) {
  let pieces = license.split(/ /);

  let allKids = true;
  let kids = [];
  for (let i=0; i<pieces[nodeIndex]; ++i) {
    kids.push(pieces[(nodeIndex+2)+i]);
    if (!/^N[0-9]+\-[0-9]+$/.test(pieces[(nodeIndex+2)+i])) {
      nodeIndex = (nodeIndex+2)+i;
      allKids = false;
      break;
    }
  }
  if (allKids) {
    const label = nextLabel();
    let kidTotal = 0;
    kids = kids.map(function(kid) {
      const data = kid.split(/-/);
      tree[data[0]].parent = label;
      kidTotal += tree[data[0]].total;
      return tree[data[0]];
    });

    let total = 0;
    let value = 0;
    for (let i=0; i<Number(pieces[nodeIndex+1]); ++i) {
      const metadataValue = Number(pieces[nodeIndex+2+kids.length + i]);
      total += metadataValue;
      value += (kids[metadataValue - 1]) ? kids[metadataValue - 1].value : 0;
    }
    

    tree[label] = { label, parent: null, total: (total + kidTotal), value, children: kids };

    license = `${pieces.slice(0, nodeIndex).join(' ')} ${label}-${(total + kidTotal)} ${pieces.slice(nodeIndex + 2 + kids.length + Number(pieces[nodeIndex+1])).join(' ')}`;

    // console.log(license);
    nodeIndex = 0;

    if (/^ N[0-9]+-[0-9]+ $/.test(license)) {
      break;
    }
  }
}

console.log('Total:', license.split(/-/)[1]);
// console.log('Tree:', tree);
console.log('Nodes:', Object.keys(tree).length);
console.log('Root value:', tree[Object.keys(tree)[Object.keys(tree).length - 1]].value);


function nextLabel() {
  node++;
  // console.log('new node', node);
  return 'N' + node;
}
