
const data = require('./day1-data').split(/\n/).map(function(amount) { return Number(amount) || 0; });

const allFreq = [];
let i = 1;
let duplicate = null;
const finalFreq = data.reduce(tallyFreq);

console.log('Final frequency from 1 run:', finalFreq);

if (!duplicate) {
  findDupe(finalFreq)
}

function tallyFreq(total, amount) {
  const newFreq = total + amount;
  if (allFreq.indexOf(newFreq) > -1) {
    duplicate = newFreq;
    console.log('Duplicate found:', duplicate);
  }
  allFreq.push(newFreq);
  return newFreq;
}

function findDupe(frequency) {
  i++
  console.log('Run #', i);
  const finalFreq = data.reduce(tallyFreq, frequency);
  if (!duplicate) {
    findDupe(finalFreq);
  }
}
