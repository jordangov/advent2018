
const input = Number(process.argv[2]) || 0;
const data = require('./day16-data')[input].split(/\n\n\n/);

// const register = [3, 2, 1, 1];

function main() {
  const ops = data[0].split(/\n\n/).map((op) => {
    const pieces = op.split(/\n/);
    return  {
      before: eval(pieces[0].split(/: +/)[1]),
      op: pieces[1].split(' ').map((n) => { return Number(n); }),
      after: eval(pieces[2].split(/: +/)[1]),
      matches: 0
    }
  });
  
  // console.log(ops);
  
  const threeOrMore = [];
  ops.forEach((opset) => {
    Object.keys(opcodes).forEach((code) => {
      const result = opcodes[code](opset.before, ...opset.op.slice(1));
      // console.log(code, result);
      if (result.join(' ') === opset.after.join(' ')) {
        opset.matches++;
        if (opset.matches === 3) {
          threeOrMore.push(opset);
        }
      }
    });
    // console.log(opset);
  });
  
  console.log('Ops with 3 or more matches:', threeOrMore.length);
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
