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

function encrypt(text, publicKey) {
  if (!text) {
    console.log("Text must not be empty!");
    return;
  }

  const encryptedBlocks = [];

  for (const char of text) {
    const charCode = char.charCodeAt(0);
    const block = char === " " ? charCode + 67 : charCode - 55;
    
    const encryptedBlock = (block ** 3) % publicKey;
    
    encryptedBlocks.push(encryptedBlock);
  }

  const encryptedText = encryptedBlocks.join(" ");

  return encryptedText;
}

function getInverse(number, mod) {
  for (let i = 1; i < mod; i++) {
    if ((number * i) % mod === 1)
      return i;
  }
  return -1;
}

function powermod(base, exp, p) {
  let result = 1n;
  
  while (exp !== 0n) {
    if (exp % 2n === 1n)
      result = result * base % p;
    
    base = base * base % p;
    exp >>= 1n;
  }
  
  return result;
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
  const chars = [];

  for (const encryptedBlock of encryptedBlocks) {
    const block = parseInt(BigInt(encryptedBlock) ** BigInt(privateKey) % BigInt(publicKey));

    const charCode = block === 99 ? block - 67 : block + 55;
    const char = String.fromCharCode(charCode);
    
    chars.push(char);
  }

  const text = chars.join("");
  console.log(text);
  
  return text;
}

export { generatePrimePairBetween, encrypt, decrypt };