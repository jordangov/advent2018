
const real = 1;
const data = require('./day12-data')[real].split(/\n/);
const generations = 20;

function main() {
  
  const plants = data[0].split(/: /)[1].split('');
  const zeroPot = new Pot(0, plants[0]);
  let lastPot = zeroPot;
  plants.slice(1).forEach(function(plant) {
    lastPot.addRight(plant);
    lastPot = lastPot.right;
  });
  zeroPot.addLeft().addLeft().addLeft();


  const rules = data.slice(2)
    .map(function(rule) {
      const pieces = rule.split(/ => /);
      if (pieces[1] === '#') {
        return pieces[0];
      } else {
        return null;
      }
    })
    .filter((rule) => !!rule);

  
  // console.log(rules);
  // console.log(print(zeroPot));


  for(let i=0; i<generations; i++) {
    pot = zeroPot;
    
    while (true) {
      pot.grow(i, rules);
      if (pot.left) {
        pot = pot.left;
      } else {
        break;
      }
    }
    pot = zeroPot.right;
    
    while (true) {
      pot.grow(i, rules);
      if (pot.right) {
        pot = pot.right;
      } else {
        break;
      }
    }
    
    // console.log(print(zeroPot));
  }
  
  const total = score(zeroPot);
  
  // TEST DATA: 325
  console.log('pot total:', total);
}


class Pot {
  constructor(number, plant, left, right) {
    this.number = number;
    this.generations = [plant || '.'];
    this.left = left || null;
    this.right = right || null;
  }
  
  currentState() {
    return this.generations[this.generations.length - 1];
  }
  
  addLeft(plant, gens) {
    if (!this.left) {
      this.left = new Pot(this.number-1, plant, null, this);
      if (gens) {
        this.left.generations = new Array(gens);
        this.left.generations.fill('.');
        this.left.generations[this.left.generations.length-1] = (plant || '.')
      }
    }
    return this.left;
  }
  addRight(plant, gens) {
    if (!this.right) {
      this.right = new Pot(this.number+1, (plant || '.'), this, null);
      if (gens) {
        this.right.generations = new Array(gens);
        this.right.generations.fill('.');
        this.right.generations[this.right.generations.length-1] = (plant || '.')
      }
    }
    return this.right;
  }
  
  grow(gen, rules) {
    if (this.currentState() === '#' || (this.right && this.right.currentState() === '#')) {
      this.addLeft('.', this.generations.length).addLeft('.', this.generations.length);
    }
    if (this.currentState() === '#' || (this.left && this.left.currentState() === '#')) {
      this.addRight('.', this.generations.length).addRight('.', this.generations.length);
    }
    
    const pattern = [
      (this.left && this.left.left && this.left.left.generations[gen]) || '.',
      (this.left && this.left.generations[gen]) || '.',
      this.generations[gen],
      (this.right && this.right.generations[gen]) || '.',
      (this.right && this.right.right && this.right.right.generations[gen]) || '.',
    ].join('');
    
    this.generations.push('.');
    for(let i=0; i<rules.length; i++) {
      if (pattern === rules[i]) {
        this.generations[this.generations.length-1] = '#';
      }
    }
  }
}


function score(zeroPot) {
  const garden = [];
  let pot = zeroPot;
  
  while (true) {
    if (pot.currentState() === '#') {
      garden.push(pot.number);
    }
    if (pot.left) {
      pot = pot.left;
    } else {
      break;
    }
  }
  pot = zeroPot.right;
  
  while (true) {
    if (pot.currentState() === '#') {
      garden.push(pot.number);
    }
    if (pot.right) {
      pot = pot.right;
    } else {
      break;
    }
  }
  
  return garden.reduce(function(total, pot) {
    return total + pot;
  }, 0);
}


function print(zeroPot) {
  const garden = [];
  let pot = zeroPot;
  let maxNeg = 0;
  while (true) {
    // garden.push((pot.number === 0) ? 0 : pot.currentState());
    garden.push(pot.currentState());
    if (pot.left) {
      pot = pot.left;
    } else {
      maxNeg = pot.number;
      break;
    }
  }
  pot = zeroPot.right;
  garden.reverse();
  
  while (true) {
    garden.push(pot.currentState());
    if (pot.right) {
      pot = pot.right;
    } else {
      break;
    }
  }
  
  const pad = (new Array(8 - Math.abs(maxNeg) - (''+(zeroPot.generations.length-1)).length)).fill(' ').join('');
  return (zeroPot.generations.length-1) + pad + garden.join('');
}

main();
