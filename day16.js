
const input = Number(process.argv[2]) || 0;
const data = require('./day16-data')[input].split(/\n\n\n/);

// const register = [3, 2, 1, 1];

function main() {
  const samples = data[0].split(/\n\n/).map((op) => {
    const pieces = op.split(/\n/);
    return  {
      before: eval(pieces[0].split(/: +/)[1]),
      op: pieces[1].split(' ').map((n) => { return Number(n); }),
      after: eval(pieces[2].split(/: +/)[1]),
      matches: []
    }
  });
  
  // console.log(ops);
  
  samples.forEach((opset) => {
    Object.keys(opcodes).forEach((code) => {
      const result = opcodes[code](opset.before, ...opset.op.slice(1));
      // console.log(code, result);
      if (result.join(' ') === opset.after.join(' ')) {
        opset.matches.push(code);
      }
    });
    // console.log(opset);
  });
  
  let codes = [];
  samples
    .filter((opset) => { return opset.matches.length === 1; })
    .forEach((opset) => {
      codes[opset.op[0]] = opset.matches[0];
    });
  samples
    .filter((opset) => { return opset.matches.length === 2 && opset.matches.indexOf('bori') > -1; })
    .forEach((opset) => {
      // console.log(opset.op[0], opset.matches);
      let index = 0;
      if (opset.matches[0] === 'bori') { index = 1; }
      codes[opset.op[0]] = opset.matches[index];
    });
  samples
    .filter((opset) => { return opset.matches.length === 2 && (opset.matches.indexOf('bori') > -1 || opset.matches.indexOf('muli') > -1); })
    .forEach((opset) => {
      let index = 0;
      if (opset.matches[0] === 'bori') { index = 1; }
      codes[opset.op[0]] = opset.matches[index];
    });
  console.log(codes);
  
  codes = [];
  while (true) {
    samples.forEach((opset) => {
      let matchCount = 0;
      let noMatch = null;
      opset.matches.forEach((match) => {
        if (codes.indexOf(match) > -1) {
          matchCount++;
        } else {
          noMatch = match;
        }
      });
      if (matchCount === opset.matches.length - 1) {
        // console.log(opset.op[0], opset.matches);
        codes[opset.op[0]] = noMatch;
      }
    });
  
    const count = codes.join(' ').split(/ +/).filter((c) => c.length).length;
    if (count > 15) {
      break;
    }
  }
  console.log(codes);
  
  
  // RUN THE TEST PROGRAM
  
  const ops = data[1].split(/\n/)
    .map((op) => {
      return op.split(' ').map((n) => { return Number(n); });
    }).slice(1);
  
  let register = [0,0,0,0];
  ops.forEach((op) => {
    // console.log('running', op, codes[op[0]]);
    register = opcodes[codes[op[0]]](register, ...op.slice(1));
  });
  
  console.log('final register:', register);
}

const opcodes = {
  /*
  addr (add register) stores into register C the result of adding register A and register B.
  addi (add immediate) stores into register C the result of adding register A and value B.
   */
  addr:(register, a, b, c) => {
    register = register.slice();
    register[c] = register[a] + register[b];
    return register;
  },
  addi:(register, a, b, c) => {
    register = register.slice();
    register[c] = register[a] + b;
    return register;
  },
  
  /*
  mulr (multiply register) stores into register C the result of multiplying register A and register B.
  muli (multiply immediate) stores into register C the result of multiplying register A and value B.
   */
  mulr:(register, a, b, c) => {
    register = register.slice();
    register[c] = register[a] * register[b];
    return register;
  },
  muli:(register, a, b, c) => {
    register = register.slice();
    register[c] = register[a] * b;
    return register;
  },
  
  /*
  banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
  bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
   */
  banr:(register, a, b, c) => {
    register = register.slice();
    register[c] = register[a] & register[b];
    return register;
  },
  bani:(register, a, b, c) => {
    register = register.slice();
    register[c] = register[a] & b;
    return register;
  },
  
  /*
  borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
  bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
   */
  borr:(register, a, b, c) => {
    register = register.slice();
    register[c] = register[a] | register[b];
    return register;
  },
  bori:(register, a, b, c) => {
    register = register.slice();
    register[c] = register[a] | b;
    return register;
  },
  
  /*
  setr (set register) copies the contents of register A into register C. (Input B is ignored.)
  seti (set immediate) stores value A into register C. (Input B is ignored.)
   */
  setr:(register, a, b, c) => {
    register = register.slice();
    register[c] = register[a];
    return register;
  },
  seti:(register, a, b, c) => {
    register = register.slice();
    register[c] = a;
    return register;
  },
  
  /*
  gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
  gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
  gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
   */
  gtir:(register, a, b, c) => {
    register = register.slice();
    register[c] = (a > register[b]) ? 1 : 0;
    return register;
  },
  gtri:(register, a, b, c) => {
    register = register.slice();
    register[c] = (register[a] > b) ? 1 : 0;
    return register;
  },
  gtrr:(register, a, b, c) => {
    register = register.slice();
    register[c] = (register[a] > register[b]) ? 1 : 0;
    return register;
  },
  
  /*
  eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
  eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
  eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
   */
  eqir:(register, a, b, c) => {
    register = register.slice();
    register[c] = (a === register[b]) ? 1 : 0;
    return register;
  },
  eqri:(register, a, b, c) => {
    register = register.slice();
    register[c] = (register[a] === b) ? 1 : 0;
    return register;
  },
  eqrr:(register, a, b, c) => {
    register = register.slice();
    register[c] = (register[a] === register[b]) ? 1 : 0;
    return register;
  }
};

main();
