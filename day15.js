
const input = Number(process.argv[2]) || 0;
const data = require('./day15-data')[input];

let map;
let units = [];
function main() {
  
  // build map
  map = data.split(/\n/).map((row, i) => {
    return row.split('').map((spot, j) => {
      if (spot === 'G' || spot === 'E') {
        return new Unit(spot, j, i);
      }
      return spot;
    });
  });
  print(0);
  // console.log(units);
  
  let round = 0;
  while(true) {
    round++;
    units.sort(readingOrder);
    // console.log(`round ${round} order: ${units.map((u) => { return `${u.type}${u.id}`; }).join(' ')}`);
    
    for (let i=0; i<units.length; i++) {
    // units.forEach((unit) => {
      if (units[i].hp < 1) {
        // console.log(`${units[i].type}${units[i].id} is ded`);
        continue;
      }
      
      let target = units[i].identifyTarget();
      // console.log(`target for ${units[i].type}[${units[i].y}, ${units[i].x}]`, target);
      
      if (target === false) {
        battleEnd(round);
      }
      if (target === null) {
        // console.log(`${units[i].type}${units[i].id} found no targets`);
        continue;
      }
      
      if (!target.path.length) {
        // console.log(`${units[i].type}${units[i].id} attacking ${target.enemy.type}${target.enemy.id}`);
        target.enemy.hp -= units[i].str;
        if (target.enemy.hp < 1) {
          console.log(`${target.enemy.type}${target.enemy.id} just died`);
          target.enemy.die();
          i--;
        }
      } else {
        // console.log(`${units[i].type}${units[i].id} moving to ${target.path[0]}`);
        units[i].move(target);
        // move and attack
        target = units[i].identifyTarget();
        if (inRange(units[i], target.enemy)) {
          // console.log(`${units[i].type}${units[i].id} attacking ${target.enemy.type}${target.enemy.id}`);
          target.enemy.hp -= units[i].str;
          if (target.enemy.hp < 1) {
            console.log(`${target.enemy.type}${target.enemy.id} just died`);
            target.enemy.die();
            i--;
          }
        }
      }
    }
    
    // console.log(units);
    // print(round);
    // if (round > 1) { console.log('tick break'); break; }
  }
}

function readingOrder(a, b) {
  return (a.y !== b.y) ? (a.y - b.y) : (a.x - b.x);
}

function inRange(source, target) {
  if (((source.y-1) === target.y && source.x === target.x) ||  // north
      (source.y === target.y && (source.x+1) === target.x) ||  // east
      ((source.y+1) === target.y && source.x === target.x) ||  // south
      (source.y === target.y && (source.x-1) === target.x)) {  // west
    return true;
  }
  return false;
}

function print(round) {
  console.log('ROUND', round);
  map.forEach((row) => {
    console.log(row.map((spot) => { return (spot === '#' || spot === '.') ? spot : spot.type; }).join(''));
  });
  console.log(units.map((u) => { return u.type + u.id + '=' + u.hp }).join('; '));
}

function battleEnd(rounds) {
  print(rounds);
  const hpTotal = units.reduce((total, unit) => { return total + unit.hp }, 0);
  console.log(`Completed ${rounds-1} rounds with total HP ${hpTotal} => ${ hpTotal * (rounds-1) }`);
  process.exit();
}

let id = 0;
class Unit {
  constructor(type, x, y) {
    this.id = ++id;
    this.type = type;
    this.hp = 200;
    this.str = 3;
    this.x = x;
    this.y = y;
    units.push(this);
  }
  
  identifyTarget() {
    // Only enemies...
    let enemies = units.filter((unit) => { return unit.type !== this.type })
    if (!enemies.length) { return false; }
    
    // Are any in range?
    let close = enemies.filter((enemy) => { return inRange(this, enemy); });
    if (close.length) {
      // Find weakest...
      close.sort((a, b) => { return a.hp - b.hp; });
      // console.log(`in range of ${this.type}${this.id} (hp sorted):`, close);
      
      close = close.filter((enemy) => { return enemy.hp === close[0].hp; });
      // Return weakest in reading order
      // console.log(`${this.type}${this.id} attacking:`, close.sort(readingOrder)[0]);
      return { enemy: close.sort(readingOrder)[0], path: [] };
    }
    
    // Find closest accessible enemy
    let holdDistance = 999;
    let targets = [];
    enemies.forEach((enemy) => {
      // console.log(`checking path from ${this.type}[${this.y}, ${this.x}] to ${enemy.type}[${enemy.y}, ${enemy.x}]...`);
      const path = this.pathTo(enemy.x, enemy.y);
      // Is the enemy accessible at all?
      if (path === null) { return; }
      
      // console.log(`path from ${this.type}[${this.y}, ${this.x}] to ${enemy.type}[${enemy.y}, ${enemy.x}]\n`, path);
      
      if (path.length < holdDistance) {
        holdDistance = path.length;
        targets = [{enemy, path}];
      } else if (path.length === holdDistance) {
        targets.push({enemy, path});
      }
    });
    
    if (targets.length) {
      // Find closest ENEMY in reading order
      const enemy = targets.map((t) => { return t.enemy; }).sort(readingOrder)[0];
      const target = targets.filter((t) => { return t.enemy.id === enemy.id; })[0];
      
      // Now find closest target spot to land on, in reading order
      let paths = []; // N, E, S, W
      if (map[enemy.y-1][enemy.x] === '.') {
        paths[0] = this.pathTo(enemy.x, enemy.y-1);
        if (paths[0]) { paths[0].push([enemy.y-1, enemy.x]); }
      }
      if (map[enemy.y][enemy.x+1] === '.') {
        paths[1] = this.pathTo(enemy.x+1, enemy.y);
        if (paths[1]) { paths[1].push([enemy.y, enemy.x+1]); }
      }
      if (map[enemy.y+1][enemy.x] === '.') {
        paths[2] = this.pathTo(enemy.x, enemy.y+1);
        if (paths[2]) { paths[2].push([enemy.y+1, enemy.x]); }
      }
      if (map[enemy.y][enemy.x-1] === '.') {
        paths[3] = this.pathTo(enemy.x-1, enemy.y);
        if (paths[3]) { paths[3].push([enemy.y, enemy.x-1]); }
      }
      
      let holdDistance = 999;
      let holdPath = null;
      paths.forEach((path) => {
        if (path && path.length < holdDistance) {
          holdDistance = path.length;
          holdPath = path;
        }
      });
      
      return { enemy, path: holdPath };
    }
    
    return null;
  }
  
  pathTo(x, y) {
    const search = [{ x: this.x, y: this.y, path: [] }];
    const visited = [];
    
    while (search.length) {
      const next = search.shift();
      visited.push([next.y, next.x].join(','));
      
      // if (y === 19 && x === 8) {
      //   console.log(`checking ${next.y},${next.x}`);
      //   console.log(visited);
      //   console.log(search.map((s) => { return s.y + ',' + s.x }));
      //   for (let i=0; i<15000000; i++) { let o = new Object(); }
      // }
      
      // Did we find it?
      if (inRange(next, {x, y})) {
        // console.log(`found path to ${next.y},${next.x}`);
        return next.path;
      }
      
      function neverSeen(x, y) {
        return visited.indexOf([y, x].join(',')) < 0 && !search.filter((s) => { return s.x === x && s.y === y; })[0];
      }
      
      // Add new searchable locations...
      if (neverSeen(next.x, next.y-1) && map[next.y-1] && map[next.y-1][next.x] === '.') {  // north
        let path = next.path.slice();
        path.push([next.y-1, next.x]);
        // console.log(`adding ${next.y-1},${next.x}`);
        search.push({ x: next.x, y: next.y-1, path });
      }
      if (neverSeen(next.x+1, next.y) && map[next.y][next.x+1] === '.') {  // east
        let path = next.path.slice();
        path.push([next.y, next.x+1]);
        // console.log(`adding ${next.y},${next.x+1}`);
        search.push({ x: next.x+1, y: next.y, path });
      }
      if (neverSeen(next.x, next.y+1) && map[next.y+1] && map[next.y+1][next.x] === '.') {  // south
        let path = next.path.slice();
        path.push([next.y+1, next.x]);
        // console.log(`adding ${next.y+1},${next.x}`);
        search.push({ x: next.x, y: next.y+1, path });
      }
      if (neverSeen(next.x-1, next.y) && map[next.y][next.x-1] === '.') {  // west
        let path = next.path.slice();
        path.push([next.y, next.x-1])
        // console.log(`adding ${next.y},${next.x-1}`);
        search.push({ x: next.x-1, y: next.y, path });
      }
    }
    
    return null;
  }
  
  die() {
    // remove from units
    let index = null;
    units.forEach((unit, i) => { if (this.id === unit.id) { index = i; } });
    if (index !== null) {
      units.splice(index, 1);
    }
    map[this.y][this.x] = '.';
  }
  
  move(target) {
    // console.log(`moving ${this.type}${this.id} from [${this.y}, ${this.x}] to [${target.path[0][0]}, ${target.path[0][1]}]`);
    map[this.y][this.x] = '.';
    map[target.path[0][0]][target.path[0][1]] = this;
    this.x = target.path[0][1];
    this.y = target.path[0][0];
  }
  
}


main();
