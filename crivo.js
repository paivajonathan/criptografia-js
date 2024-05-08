/**
 *
 * @param {number} valorMaximo
 */
function crivo(valorMaximo) {
  /**
   * @type {boolean[]}
   */
  const valores = new Array(valorMaximo + 1).fill(true);

  /**
   * @type {number[]}
   */
  const primos = [];

  for (let i = 0; i < 2; i++)
    valores[i] = false;

  for (let i = 2; i < valores.length; i++) {
    if (!i) continue;
    for (let j = i + i; j < valores.length; j += i)
      valores[j] = false;
  }

  for (const posicao in valores)
    valores[posicao] && primos.push(+posicao);

  return primos;
}

console.log(crivo(15));
