function sieve(maxValue) {
  const values = new Array(maxValue + 1).fill(true);

  const primes = [];

  for (let i = 0; i < 2; i++)
    values[i] = false;

  for (let i = 2; i < values.length; i++) {
    if (!i) continue;
    
    for (let j = i + i; j < values.length; j += i)
      values[j] = false;
  }

  for (const position in values) {
    if (values[position])
      primes.push(parseInt(position));
  }

  return primes;
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePrimePairBetween(minValue, maxValue) {
  let prime1 = 0, prime2 = 0;

  const primes = sieve(maxValue).filter((n) => n >= minValue);

  while (prime1 === prime2 || prime1 % 6 !== 5 || prime2 % 6 !== 5) {
    prime1 = getRandomElement(primes);
    prime2 = getRandomElement(primes);
  }

  return { prime1, prime2 };
}

function powermod(base, exp, p) {
  base = BigInt(base);
  exp = BigInt(exp);
  p = BigInt(p);
  
  let result = 1n;
  
  while (exp !== 0n) {
    if (exp % 2n === 1n)
      result = result * base % p;
    
    base = base * base % p;
    exp >>= 1n;
  }
  
  return parseInt(result);
}

function encrypt(text, publicKey) {
  if (!text) {
    console.log("Text must not be empty!");
    return;
  }

  let preEncryptedText = "";

  for (const char of text) {
    const code = char.charCodeAt(0) + 100;
    preEncryptedText += code;
  }

  let blocks = [];
  
  while (preEncryptedText !== "") {
    const textLength = preEncryptedText.length;
    const maxBlock = textLength >= 3 ? 3 : textLength;
    const sliceEnd = Math.floor(Math.random() * maxBlock) + 1;
    
    let displacement = 0;
    
    if (preEncryptedText[sliceEnd] === "0") {
      displacement++;
      
      if (preEncryptedText[sliceEnd + 1] === "0")
        displacement++;
    }

    let slice = preEncryptedText.slice(0, sliceEnd + displacement);
    preEncryptedText = preEncryptedText.slice(sliceEnd + displacement, textLength);
    
    blocks.push(slice);
  }
  
  const encryptedBlocks = [];

  for (const block of blocks) {
    const encryptedBlock = powermod(block, 3, publicKey);
    encryptedBlocks.push(encryptedBlock);
  }

  return encryptedBlocks.join(" ");
}

function getInverse(number, mod) {
  for (let i = 1; i < mod; i++) {
    if ((number * i) % mod === 1)
      return i;
  }
  return -1;
}

function isPrime(number) {
  if (number <= 1)
    return false;

  for (let i = 2; i < Math.sqrt(number); i++) {
    if (number % i === 0)
      return false;
  }

  return true;
}

function decrypt(encryptedText, prime1, prime2) {
  if (!encryptedText) {
    console.log("Encrypted text must not be empty!");
    return;
  }

  if (isNaN(prime1) || isNaN(prime2)) {
    console.log("Both values must be numbers!");
    return;
  }

  if (!isPrime(prime1) || !isPrime(prime2)) {
    console.log("Both numbers must be prime!");
    return;
  }

  const publicKey = prime1 * prime2;
  const totientFunction = (prime1 - 1) * (prime2 - 1);
  const privateKey = getInverse(3, totientFunction);

  if (privateKey === -1) {
    console.log("The primes are not valid!");
    return;
  }

  const encryptedBlocks = encryptedText.split(" ").map(Number);
  let preEncryptedText = ""; 

  for (const encryptedBlock of encryptedBlocks) {
    const block = powermod(encryptedBlock, privateKey, publicKey);
    preEncryptedText += block;
  }

  let text = "";
  
  while (preEncryptedText !== "") {
    const code = parseInt(preEncryptedText.slice(0, 3));
    text += String.fromCharCode(code - 100);
    preEncryptedText = preEncryptedText.slice(3, preEncryptedText.length);
  }
  
  return text;
}

export { generatePrimePairBetween, encrypt, decrypt };
