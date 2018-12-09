
const data = require('./day3-data').split(/\n/);

// Example entry: #3 @ 655,494: 12x23

// prep data
const claims = data.map(function(claim) {
  const pieces = claim.match(/^#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)$/);
  if (!pieces) {
    console.log(`Uh oh, bad data: ${claim}`);
  }
  return {
    id: pieces[1],
    left: Number(pieces[2]),
    top: Number(pieces[3]),
    width: Number(pieces[4]),
    height: Number(pieces[5]),
    right: Number(pieces[2]) + Number(pieces[4]) - 1,
    bottom: Number(pieces[3]) + Number(pieces[5]) - 1
  };
});

const collisions = [];
let noCollisions = null;
claims.forEach(function(sourceClaim) {
  let hasCollision = false;
  claims.forEach(function(targetClaim) {
    const collision = (sourceClaim.left < targetClaim.left + targetClaim.width &&
       sourceClaim.left + sourceClaim.width > targetClaim.left &&
       sourceClaim.top < targetClaim.top + targetClaim.height &&
       sourceClaim.height + sourceClaim.top > targetClaim.top);
    
    if (!collision || sourceClaim.id === targetClaim.id) { return; }
    hasCollision = true;
    
    // if (collisions.length > 0) { return; }
    // console.log('collision between:', sourceClaim, targetClaim);
    
    // #1 @ 1,4: 5x3
    // #2 @ 3,2: 7x4
  
    // ...........
    // ...........
    // ...2222222.
    // ...2222222.
    // .11XXX2222.
    // .11XXX2222.
    // .11111.....
    // ...........
    // ...........
    
    const left = Math.max(sourceClaim.left, targetClaim.left);
    const top = Math.max(sourceClaim.top, targetClaim.top);
    // const right = left + (Math.max(sourceClaim.right, targetClaim.right) - Math.min(sourceClaim.right, targetClaim.right));
    // const bottom = top + (Math.max(sourceClaim.bottom, targetClaim.bottom) - Math.min(sourceClaim.bottom, targetClaim.bottom));
    const right = Math.min(sourceClaim.right, targetClaim.right);
    const bottom = Math.min(sourceClaim.bottom, targetClaim.bottom);
    
    for (let i=left; i<=right; i++) {
      for (let j=top; j<=bottom; j++) {
        if (collisions.indexOf(`${i}x${j}`) < 0) {
          collisions.push(`${i}x${j}`);
          // console.log(`${i}x${j}`);
        }
      }
    }
  });
  
  if (!hasCollision) {
    noCollisions = sourceClaim;
  }
});

console.log(`Found ${collisions.length} collisions`);
console.log('No collisions:', noCollisions);
