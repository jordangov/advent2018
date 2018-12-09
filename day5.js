
let data = require('./day5-data');

console.log('LENGTH', data.length);

findBadUnit(data);

function findBadUnit(polymer) {
  let units = [/[aA]/g, /[bB]/g, /[cC]/g, /[dD]/g, /[eE]/g, /[fF]/g, /[gG]/g, /[hH]/g, /[iI]/g, /[jJ]/g, /[kK]/g, /[lL]/g, /[mM]/g, /[nN]/g, /[oO]/g, /[pP]/g, /[qQ]/g, /[rR]/g, /[sS]/g, /[tT]/g, /[uU]/g, /[vV]/g, /[wW]/g, /[xX]/g, /[yY]/g, /[zZ]/g];
  let holdLength = 999999999;
  for (let i=0; i<units.length; ++i) {
    console.log('removing', units[i]);
    const reacted = reactPolymer(polymer.replace(units[i], ''));
    if (reacted.length < holdLength) {
      holdLength = reacted.length;
    }
  }
  console.log('Shortest polymer:', holdLength);
}

function reactPolymer(polymer) {
  let reactionsExist = true;
  let inProcess;
  while (reactionsExist) {
    inProcess = eliminateReactions(polymer);
    if (inProcess === polymer) {
      reactionsExist = false;
    }
    polymer = inProcess;
  }
  
  return inProcess;
}

function eliminateReactions(polymer) {
  polymer = polymer.split('');
  polymer.forEach(function(unit, i) {
    if (/^[a-z]$/.test(unit) && polymer[i+1] && polymer[i+1] === unit.toUpperCase()) {
      polymer[i] = polymer[i+1] = '!';
    } else if (/^[A-Z]$/.test(unit) && polymer[i+1] && polymer[i+1] === unit.toLowerCase()) {
      polymer[i] = polymer[i+1] = '!';
    }
  });
  return polymer.join('').replace(/\!/g, '');
}
