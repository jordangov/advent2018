
const input = Number(process.argv[2]) || 0;
const data = require('./day24-data')[input].split(/\n*(?:Infection|Immune System):\n/).slice(1);

let immuneId = 0;
let infectId = 0;
const infoRE = /^(\d+) units each with (\d+) hit points (\([a-z ;,]+\) )?with an attack that does (\d+) ([a-z]+) damage at initiative (\d+)$/;

const immune = [];
const infection = [];
data[0].split(/\n/).forEach((sentence) => {
  immune.push(getGroup(sentence));
  immune[immune.length-1].id = 'imm' + ++immuneId;
});
data[1].split(/\n/).forEach((sentence) => {
  infection.push(getGroup(sentence));
  infection[infection.length-1].id = 'inf' + ++infectId;
});

function getGroup(sentence) {
  const info = sentence.match(infoRE);
  
  const mods = { immune: [], weak: [] };
  if (info[3]) {
    info[3].substr(1, info[3].length-3).split('; ').map((mod) => {
      const info = mod.split(' to ');
      mods[info[0]] = info[1].split(', ');
    });
  }

  return {
    count: Number(info[1]),
    hp: Number(info[2]),
    dmgAmt: Number(info[4]),
    dmgType: info[5],
    init: Number(info[6]),
    power: power,
    mods
  };
}

function power() {
  return this.count * this.dmgAmt;
}

// console.log(immune[1], infection[1]);

// TARGET SELECTION
function targetingSort(a, b) {
  if (a.power() === b.power()) {
    return b.init - a.init;
  }
  return b.power() - a.power()
}

function targetingDecision(group, enemies, allies) {
  let holdDamage = 0;
  let holdEnemies = [];
  
  const targeted = allies.map((ally) => { return (ally.target) ? ally.target.id : null; });
  
  enemies.forEach((enemy) => {
    if (enemy.count < 1) { return; }  // ded
    if (targeted.indexOf(enemy.id) > -1) { return; }  // already targeted
    
    const dmg = getDamage(group, enemy);
    
    // console.log(`group ${group.id} would deal ${dmg} to enemy ${enemy.id}`);
    
    if (dmg > holdDamage) {
      holdDamage = dmg;
      holdEnemies = [enemy];
    } else if (dmg && dmg === holdDamage) {
      holdDamage = dmg;
      holdEnemies.push(enemy);
    }
  });
  
  // break ties
  holdEnemies.sort(targetingSort);
  return holdEnemies[0] || null;
}

function doTargeting() {
  immune.sort(targetingSort);
  console.log(`IMMUNE TARGETING`);
  immune.forEach((group) => {
    group.target = targetingDecision(group, infection, immune);
    console.log(`TARGET ACQUIRED: group ${group.id} is targeting enemy ${(group.target) ? group.target.id : 'nobody'}`);
  });
  console.log(`INFECTION TARGETING`);
  infection.sort(targetingSort);
  infection.forEach((group) => {
    group.target = targetingDecision(group, immune, infection);
    console.log(`TARGET ACQUIRED: group ${group.id} is targeting enemy ${(group.target) ? group.target.id : 'nobody'}`);
  });
}

function getDamage(attacker, defender) {
  let dmg = attacker.power();
  if (defender.mods.immune.indexOf(attacker.dmgType) > -1) {
    dmg = 0;
  }
  if (defender.mods.weak.indexOf(attacker.dmgType) > -1) {
    dmg *= 2;
  }
  return dmg;
}


function doAttack() {
  const groups = immune.concat(infection).sort((a, b) => { return b.init - a.init; });
  
  groups.forEach((group) => {
    if (group.count < 1) { return; }
    if (!group.target) { return; }
    const dmg = getDamage(group, group.target);
    const death = Math.floor(dmg / group.target.hp);
    console.log(`group ${group.id} killed ${death} units of enemy ${group.target.id}`);
    group.target.count -= death;
    group.target.count = Math.max(0, group.target.count);
    group.target = null;
  });
}


while(true) {
  immune.forEach((g) => { console.log(`immune group ${g.id} has ${g.count} units`); });
  infection.forEach((g) => { console.log(`infection group ${g.id} has ${g.count} units`); });
  
  doTargeting();
  doAttack();
  
  if (!immune.filter((group) => { return group.count; }).length) {
    const remain = infection.reduce((t, g) => { return g.count + t; }, 0);
    console.log(`Immune system lost! Infection has ${remain} units left`);
    break;
  }
  if (!infection.filter((group) => { return group.count; }).length) {
    const remain = immune.reduce((t, g) => { return g.count + t; }, 0);
    console.log(`Infection lost! Immune System has ${remain} units left`);
    break;
  }
}
