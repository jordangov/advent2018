
const data = require('./day2-data').split(/\n/);

let doubles = 0;
let triples = 0;
let matched = null;
data.forEach(function(id) {
  const sets = {};
  let hasDouble = false;
  let hasTriple = false;
  id.split('').forEach(function(letter) {
    sets[letter] = (sets[letter])?sets[letter]+letter:letter;
  });
  Object.keys(sets).forEach(function(letter) {
    if (sets[letter].length === 2) { hasDouble = true; }
    if (sets[letter].length === 3) { hasTriple = true }
  });
  
  if (hasDouble) { doubles++; }
  if (hasTriple) { triples++; }
  
  data.forEach(function(otherId) {
    let oneMiss = false;
    let match = true;
    const otherLetters = otherId.split('');
    id.split('').forEach(function(letter, i) {
      if (letter !== otherLetters[i]) {
        if (oneMiss) { match = false; }
        oneMiss = true;
      }
    });
    
    if (match && otherId !== id) {
      matched = [otherId, id];
      console.log('found match', matched);
    }
  });
});

console.log(`Doubles: ${doubles}; Triples: ${triples}; Checksum: ${doubles * triples}`);

// zihwtxagwifpbsnwleydukjmqv
// zihwtxagsifpbsnwleydukjmqv
// zihwtxagifpbsnwleydukjmqv
