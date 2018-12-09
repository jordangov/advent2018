
const data = require('./day4-data').split(/\n/);

// Example:
// [1518-04-10 00:04] Guard #2467 begins shift
// [1518-04-10 00:25] falls asleep
// [1518-04-10 00:54] wakes up

const logTypes = ['Start', 'Sleep', 'Wake']
let holdGuard = null;
let holdSleepStart = null;
const guards = {};
const guardTotals = [];
const minutesAsleep = [];

const logs = data
  .map(function(log) {
    const data = log.match(/^\[([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2})\] (Guard #([0-9]+) begins shift|falls asleep|wakes up)$/);
    if (!data) {
      console.log('Found bad log:', log);
      return null;
    }
    
    let type = null;
    if (/^Guard/.test(data[2])) {
      type = 0;
    } else if (/^falls/.test(data[2])) {
      type = 1;
    } else if (/^wakes/.test(data[2])) {
      type = 2;
    }
    
    let date = new Date((new Date(data[1])).getTime() - (1000 * 60 * 60 * 4));
    
    return {
      originalDate: data[1],
      date,
      guard: data[3] || null,
      type
    };
  })
  .sort(function(a, b) {
    return a.date.getTime() - b.date.getTime();
  })
  .forEach(function(log) {
    if (log.guard) {
      holdGuard = log.guard;
    } else {
      log.guard = holdGuard;
    }
    
    guards[log.guard] = guards[log.guard] || { id: log.guard, naps: [], totalSleep: 0, minutesAsleep: [] };
    
    if (log.type === 1) {
      holdSleepStart = log.date;
    } else if (log.type === 2) {
      const sleepTime = (log.date.getTime() - holdSleepStart.getTime()) / 1000 / 60;
      guards[log.guard].naps.push({
        startMinute: holdSleepStart.getMinutes(),
        endMinute: log.date.getMinutes(),
        length: sleepTime
      });
      guards[log.guard].totalSleep += sleepTime;
    }
    
  });

Object.keys(guards).forEach(function(id) {
  guardTotals.push({ id, totalSleep: guards[id].totalSleep });
});

guardTotals.sort(function(a, b) {
  return b.totalSleep - a.totalSleep;
});

let holdMaxNaps = 0;
let holdMaxNapsGuard = null;
Object.keys(guards).forEach(function(id) {
  
  guards[id].naps.forEach(function(nap) {
    for (let i=nap.startMinute; i<nap.endMinute; i++) {
      // console.log('incrementing minute', i);
      if (!guards[id].minutesAsleep[i]) {
        guards[id].minutesAsleep[i] = 0;
      }
      
      guards[id].minutesAsleep[i]++;
    }
  });

  let maxMinuteNaps = 0;
  let maxMinute = null;
  guards[id].minutesAsleep.forEach(function(totalNaps, i) {
    if (totalNaps > maxMinuteNaps) {
      maxMinuteNaps = totalNaps;
      maxMinute = i;
    }
  });
  
  guards[id].maxMinuteNaps = maxMinuteNaps;
  guards[id].maxMinute = maxMinute;
  if (maxMinuteNaps > holdMaxNaps) {
    holdMaxNaps = maxMinuteNaps
    holdMaxNapsGuard = guards[id];
  }
});

console.log(holdMaxNapsGuard.id, holdMaxNapsGuard.maxMinuteNaps, holdMaxNapsGuard.maxMinute);
console.log('Checksum:', Number(holdMaxNapsGuard.id) * holdMaxNapsGuard.maxMinute);

// console.log('Guard', guardTotals[0].id, 'slept', maxSleep, 'at minute', maxMinute);
// console.log('Checksum:', Number(guardTotals[0].id) * maxMinute);
