
const data = require('./day7-data');

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const delay = 60;

const steps = {};
((delay === 0) ? data[0] : data[1]).split(/\n/).forEach(function(entry) {
  const pieces = entry.match(/^Step ([A-Z]) must be finished before step ([A-Z]) can begin\.$/);
  if (!pieces) {
    return console.log('BAD DATA', entry);
  }
  steps[pieces[1]] = steps[pieces[1]] || { id: pieces[1], deps: [] };
  steps[pieces[2]] = steps[pieces[2]] || { id: pieces[2], deps: [] };
  steps[pieces[2]].deps.push(pieces[1]);
});

// console.log(steps['A']);

const completed = [];
let workers;
if (delay === 0) {
  workers = [{ step: null, time: 0 }, { step: null, time: 0 }];
} else {
  workers = [{ step: null, time: 0 }, { step: null, time: 0 }, { step: null, time: 0 }, { step: null, time: 0 }, { step: null, time: 0 }];
}
let time = 0;

while (true) {
  let avail = findAvailableSteps().sort();
  const startAvail = (avail.length) ? avail.join('') : '.';
  // console.log('available', avail);
  
  workers.forEach(function(worker, i) {
    if (worker.time) {
      worker.time--;
      if (worker.time === 0) {
        const step = worker.step;
        completed.push(worker.step);
        worker.step = null;
        const avail = findAvailableSteps().sort();
        console.log(`worker ${i} completed ${step}, now avail: ${(avail.length) ? avail.join('') : 'none'}`);
      }
    }
  });
  
  avail = findAvailableSteps().sort();
  workers.forEach(function(worker, i) {
    if (worker.time === 0) {
      if (avail.length) {
        // console.log(`adding step ${avail[0]} to worker ${i}`);
        worker.step = avail[0];
        worker.time = delay + letters.indexOf(worker.step) + 1;
        avail = avail.slice(1);
        delete steps[worker.step];
        // console.log('steps left:', Object.keys(steps));
        // console.log('now available:', avail);
      }
    }
  });
  
  
  if (!Object.keys(steps).length) {
    let allDone = true;
    workers.forEach(function(worker) {
      if (worker.time) {
        allDone = false;
      }
    });
    if (allDone) { break; }
  }
  
  // if (time > 25) { break; }
  
  avail = findAvailableSteps().sort();
  if (workers.length === 2) {
    console.log(`T${(time < 10) ? '00'+time : ((time < 100) ? '0'+time : time)}:  ${(workers[0].step) ? workers[0].step : '.'}  ${(workers[1].step) ? workers[1].step : '.'}  |  ${startAvail} -> ${(avail.length) ? avail.join('') : '.'}`);
  } else {
    console.log(`T${(time < 10) ? '00'+time : ((time < 100) ? '0'+time : time)}:  ${(workers[0].step) ? workers[0].step : '.'}  ${(workers[1].step) ? workers[1].step : '.'}  ${(workers[2].step) ? workers[2].step : '.'}  ${(workers[3].step) ? workers[3].step : '.'}  ${(workers[4].step) ? workers[4].step : '.'}  |  ${startAvail} -> ${(avail.length) ? avail.join('') : '.'}`);
  }
  
  time++;
}

console.log(`TIME: ${time}s`, completed.join(''));


function findAvailableSteps() {
  const avail = [];
  Object.keys(steps).forEach(function(step) {
    // console.log('looking at', steps[step]);
    
    if (completed.indexOf(step) > -1) {
      return;
    }
    
    let isWorking = false;
    workers.forEach(function(worker) {
      if (worker.step === step) {
        isWorking = true;
      }
    });
    if (isWorking) {
      return;
    }
    
    let depsComplete = true;
    steps[step].deps.forEach(function(dep) {
      if (completed.indexOf(dep) < 0) {
        depsComplete = false;
      }
    });
    if (depsComplete) {
      avail.push(step);
    }
  });
  return avail;
}
