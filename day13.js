
const real = 1;
const data = require('./day13-data')[real].split(/\n/);

// Build carts and tracks
let cartId = 0;
const carts = [];
const tracks = [];
for (let i=0; i<data.length; i++) {
  tracks.push([]);
  for (let j=0; j<data[i].length; j++) {
    let type = data[i][j];
    if (/(v|\^)/.test(type)) {
      carts.push({ id: ++cartId, x:j, y:i, dir: type, nextTurn: 'L' });
      type = '|';
    } else if (/(<|>)/.test(type)) {
      carts.push({ id: ++cartId, x:j, y:i, dir: type, nextTurn: 'L' });
      type = '-';
    }
    tracks[i].push(type);
  }
}

// console.log(print());

// iterate over carts for movement, detect collisions
let collision = null;
let ticks = 0;
while(!collision) {
  ticks++
  carts.sort(function(a, b) {
    if (a.y !== b.y) {
      return a.y - b.y;
    } else {
      return a.x - b.x;
    }
  });
  // console.log('order', carts);
  
  // movement
  for (let i=0; i<carts.length; i++) {
    if (carts[i].dir === '>') {
      carts[i].x++;
    } else if (carts[i].dir === 'v') {
      carts[i].y++;
    } else if (carts[i].dir === '<') {
      carts[i].x--;
    } else {
      carts[i].y--;
    }
    
    // curving & turning
    if (/[\{\}\[\]]/.test(tracks[carts[i].y][carts[i].x])) {
      curve(carts[i], tracks[carts[i].y][carts[i].x]);
    } else if (tracks[carts[i].y][carts[i].x] === '+') {
      turn(carts[i]);
    }
    
    // collision detection
    for (let j=0; j<carts.length; j++) {
      if (carts[j].id !== carts[i].id &&
          carts[j].x  === carts[i].x &&
          carts[j].y  === carts[i].y) {
        collision = { x: carts[i].x, y: carts[i].y };
        break;
      }
    }
    if (collision) {
      break;
    }
  }
  
  // console.log(print());
  if (ticks > 1500) {
    break;
  }
}

// 7,3
console.log('first collision is at:', collision);


function curve(cart, track) {
  if (track === '}') {
    cart.dir = (cart.dir === '>') ? 'v' : '<';
  } else if (track === ']') {
    cart.dir = (cart.dir === '>') ? '^' : '<';
  } else if (track === '[') {
    cart.dir = (cart.dir === '<') ? '^' : '>';
  } else if (track === '{') {
    cart.dir = (cart.dir === '<') ? 'v' : '>';
  }
}

function turn(cart) {
  // L, S, R, L, S, R, ...
  if (cart.dir === '>') {
    if (cart.nextTurn === 'L') {
      cart.dir = '^';
    } else if (cart.nextTurn === 'S') {
      cart.dir = '>';
    } else {
      cart.dir = 'v';
    }
  } else if (cart.dir === 'v') {
    if (cart.nextTurn === 'L') {
      cart.dir = '>';
    } else if (cart.nextTurn === 'S') {
      cart.dir = 'v';
    } else {
      cart.dir = '<';
    }
  } else if (cart.dir === '<') {
    if (cart.nextTurn === 'L') {
      cart.dir = 'v';
    } else if (cart.nextTurn === 'S') {
      cart.dir = '<';
    } else {
      cart.dir = '^';
    }
  } else {
    if (cart.nextTurn === 'L') {
      cart.dir = '<';
    } else if (cart.nextTurn === 'S') {
      cart.dir = '^';
    } else {
      cart.dir = '>';
    }
  }
  
  if (cart.nextTurn === 'L') {
    cart.nextTurn = 'S';
  } else if (cart.nextTurn === 'S') {
    cart.nextTurn = 'R';
  } else {
    cart.nextTurn = 'L';
  }
}

function print() {
  const status = tracks.map(function(row) {
    return row.join('');
  });
  carts.forEach(function(cart) {
    let row = status[cart.y].split('');
    row[cart.x] = cart.dir;
    status[cart.y] = row.join('');
  });
  return status.join('\n');
}
