/**
 *
 * @param {number} number
 * @returns result
 */
function isPrimal(number) {
  if (number <= 1) return false;

  for (let i = 2; i < Math.sqrt(number); i++)
    if (number % i === 0) return false;

  return true;
}

/**
 *
 * @param {number} min
 * @param {number} max
 * @returns random number
 */
function getRandomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 *
 * @param {number} maxValue
 */
function sieve(maxValue) {
  /**
   * @type {boolean[]}
   */
  const values = new Array(maxValue + 1).fill(true);

  /**
   * @type {number[]}
   */
  const primes = [];

  for (let i = 0; i < 2; i++)
    values[i] = false;

  for (let i = 2; i < values.length; i++) {
    if (!i) continue;
    for (let j = i + i; j < values.length; j += i)
      values[j] = false;
  }

  for (const position in values)
    values[position] && primes.push(+position);

  return primes;
}

/**
 * @returns array of primal numbers
 */
function generatePrimalPair() {
  let prime1 = 0, prime2 = 0;

  const primes = sieve(100);

  while ((prime1 === prime2) || (prime1 % 6 !== 5) || (prime2 % 6 !== 5)) {
    prime1 = primes[Math.floor(Math.random() * primes.length)];
    prime2 = primes[Math.floor(Math.random() * primes.length)];
  }

  return [prime1, prime2];
}

/**
 *
 * @param {string} text
 * @returns object containing the encrypted text, and private keys
 */
function encrypt(text) {
  if (!text) {
    console.log("Text must not be empty!");
    return;
  }

  const [privateKey1, privateKey2] = generatePrimalPair();
  const publicKey = privateKey1 * privateKey2;

  const encryptedBlocks = [];

  for (const char of text) {
    const charCode = char.charCodeAt(0);
    const block = char === " " ? charCode + 67 : charCode - 55;
    const encryptedBlock = Math.pow(block, 3) % publicKey;
    encryptedBlocks.push(encryptedBlock);
  }

  const encryptedText = encryptedBlocks.join(" ");

  return {
    encryptedText,
    privateKey1,
    privateKey2,
  };
}

/**
 *
 * @param {number} number
 * @param {number} mod
 * @returns modular inverse of the number
 */
function getInverse(number, mod) {
  for (let i = 1; i < mod; i++) {
    if ((number * i) % mod === 1) return i;
  }
  return -1;
}

/**
 *
 * @param {string} encryptedText
 * @param {number} privateKey1
 * @param {number} privateKey2
 * @returns text
 */
function decrypt(encryptedText, privateKey1, privateKey2) {
  if (!encryptedText) {
    console.log("Encrypted text must not be empty!");
    return;
  }

  if (isNaN(privateKey1) || isNaN(privateKey2)) {
    console.log("Private keys must be numbers!");
    return;
  }

  if (!isPrimal(privateKey1) || !isPrimal(privateKey2)) {
    console.log("Private keys must both be primal numbers!");
    return;
  }
  
  const publicKey = privateKey1 * privateKey2;
  const totientFunction = (privateKey1 - 1) * (privateKey2 - 1);
  const decryptingKey = getInverse(3, totientFunction);
  
  if (decryptingKey === -1) {
    console.log("The keys are not valid!");
    return;
  }
  
  const encryptedBlocks = encryptedText.split(" ").map(Number);
  const chars = [];
  
  for (const encryptedBlock of encryptedBlocks) {
    const block = parseInt(BigInt(BigInt(encryptedBlock) ** BigInt(decryptingKey)) % BigInt(publicKey));
    const charCode = block === 99 ? block - 67 : block + 55;
    const char = String.fromCharCode(charCode);
    chars.push(char);
  }

  const text = chars.join("");
  return text;
}

const { encryptedText, privateKey1, privateKey2 } = encrypt("A baTata esPalhA a RAma pelo CHao");
console.log(decrypt(encryptedText, privateKey1, privateKey2));