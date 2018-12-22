
const input = Number(process.argv[2]) || 0;
const data = require('./day19-data')[input].split(/\n/);

function main() {

  let boundTo = 0;
  const instructions = [];
  data.forEach((instruct, i) => {
    if (i === 0) {
      boundTo = Number(instruct.split(/ /)[1]);
    } else {
      instruction = instruct.split(/ /).map((n, i) => { return (i>0) ? Number(n) : n; });
      instructions.push(instruction);
    }
  });

  // register[boundedReg] set to value of ip
  // execute instruction at index of value of ip
  // ip set to value of register[boundedReg]
  // ip +1

  /*
  ip=4 [0,1631253,10551287,1,4,1631253] eqrr 1 2 1 [0,0,10551287,1,4,1631253]
  ip=5 [0,0,10551287,1,5,1631253] addr 1 4 4 [0,0,10551287,1,5,1631253]
  ip=6 [0,0,10551287,1,6,1631253] addi 4 1 4 [0,0,10551287,1,7,1631253]
  ip=8 [0,0,10551287,1,8,1631253] addi 5 1 5 [0,0,10551287,1,8,1631254]
  ip=9 [0,0,10551287,1,9,1631254] gtrr 5 2 1 [0,0,10551287,1,9,1631254]
  ip=10 [0,0,10551287,1,10,1631254] addr 4 1 4 [0,0,10551287,1,10,1631254]
  ip=11 [0,0,10551287,1,11,1631254] seti 2 9 4 [0,0,10551287,1,2,1631254]
  ip=3 [0,0,10551287,1,3,1631254] mulr 3 5 1 [0,1631254,10551287,1,3,1631254]
  ip=4 [0,1631254,10551287,1,4,1631254] eqrr 1 2 1 [0,0,10551287,1,4,1631254]
   */

  let ip = 0;
  let register = [1,0,0,0,0,0];
  while(true) {
    register[boundTo] = ip;
    
    let tick = `ip=${ip} [${register}] ${instructions[ip].join(' ')}`;
    register = opcodes[instructions[ip][0]](register, ...instructions[ip].slice(1));
    tick += ` [${register}]`;
    
    ip = register[boundTo];
    ip++;
    
    console.log(tick);
    
    if (ip > (instructions.length - 1)) {
      break;
    }
  }
  console.log(`Program Ended with register[0] === ${register[0]}`);
}

const opcodes = {
  /*
  addr (add register) stores into register C the result of adding register A and register B.
  addi (add immediate) stores into register C the result of adding register A and value B.
   */
  addr:(register, a, b, c) => {
    register[c] = register[a] + register[b];
    return register;
  },
  addi:(register, a, b, c) => {
    register[c] = register[a] + b;
    return register;
  },
  
  /*
  mulr (multiply register) stores into register C the result of multiplying register A and register B.
  muli (multiply immediate) stores into register C the result of multiplying register A and value B.
   */
  mulr:(register, a, b, c) => {
    register[c] = register[a] * register[b];
    return register;
  },
  muli:(register, a, b, c) => {
    register[c] = register[a] * b;
    return register;
  },
  
  /*
  banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
  bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
   */
  banr:(register, a, b, c) => {
    register[c] = register[a] & register[b];
    return register;
  },
  bani:(register, a, b, c) => {
    register[c] = register[a] & b;
    return register;
  },
  
  /*
  borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
  bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
   */
  borr:(register, a, b, c) => {
    register[c] = register[a] | register[b];
    return register;
  },
  bori:(register, a, b, c) => {
    register[c] = register[a] | b;
    return register;
  },
  
  /*
  setr (set register) copies the contents of register A into register C. (Input B is ignored.)
  seti (set immediate) stores value A into register C. (Input B is ignored.)
   */
  setr:(register, a, b, c) => {
    register[c] = register[a];
    return register;
  },
  seti:(register, a, b, c) => {
    register[c] = a;
    return register;
  },
  
  /*
  gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
  gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
  gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
   */
  gtir:(register, a, b, c) => {
    register[c] = (a > register[b]) ? 1 : 0;
    return register;
  },
  gtri:(register, a, b, c) => {
    register[c] = (register[a] > b) ? 1 : 0;
    return register;
  },
  gtrr:(register, a, b, c) => {
    register[c] = (register[a] > register[b]) ? 1 : 0;
    return register;
  },
  
  /*
  eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
  eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
  eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
   */
  eqir:(register, a, b, c) => {
    register[c] = (a === register[b]) ? 1 : 0;
    return register;
  },
  eqri:(register, a, b, c) => {
    register[c] = (register[a] === b) ? 1 : 0;
    return register;
  },
  eqrr:(register, a, b, c) => {
    register[c] = (register[a] === register[b]) ? 1 : 0;
    return register;
  }
};

main();
