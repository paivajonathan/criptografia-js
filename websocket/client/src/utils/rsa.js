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

export { generatePrimePairBetween };