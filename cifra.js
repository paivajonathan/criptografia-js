const [CODIGO_A_MIN, CODIGO_Z_MIN] = [97, 122]; 
const [CODIGO_A_MAI, CODIGO_Z_MAI] = [65, 90];

const ALFABETO_MIN = 'abcdefghijklmnopqrstuvwxyz';
const ALFABETO_MAI = ALFABETO_MIN.toUpperCase();

/**
 * @param {string} chave 
 * @param {string} texto 
 * @returns texto cifrado
 */
function cifrar(chave, texto) {
  let textoCifrado = '';
  let codigoA = 0;
  let codigoZ = 0;

  for (let letra of texto) {
    if (!ALFABETO_MIN.includes(letra.toLowerCase())) {
      textoCifrado += letra;
      continue;
    }

    if (ALFABETO_MIN.includes(letra))
      [codigoA, codigoZ] = [CODIGO_A_MIN, CODIGO_Z_MIN];

    if (ALFABETO_MAI.includes(letra))
      [codigoA, codigoZ] = [CODIGO_A_MAI, CODIGO_Z_MAI];

    const codigoDeslocado = letra.charCodeAt(0) + ALFABETO_MIN.indexOf(chave.toLowerCase());
    
    const codigo = codigoDeslocado > codigoZ ? (codigoDeslocado % (codigoZ + 1)) + codigoA : codigoDeslocado;
    
    const letraModificada = String.fromCharCode(codigo);

    textoCifrado += letraModificada;
  }

  return textoCifrado;
}

console.log(cifrar('c', 'Batatinha quando Nasce EspAlha a RAma pelo Chão'));

/**
 * @param {string} chave 
 * @param {string} textoCifrado 
 * @returns texto decifrado
 */
function decifrar(chave, textoCifrado) {
  let textoDecifrado = '';
  let codigoA = 0;
  let codigoZ = 0;

  for (let letra of textoCifrado) {
    if (!ALFABETO_MIN.includes(letra.toLowerCase())) {
      textoDecifrado += letra;
      continue;
    }

    if (ALFABETO_MIN.includes(letra))
      [codigoA, codigoZ] = [CODIGO_A_MIN, CODIGO_Z_MIN];

    if (ALFABETO_MAI.includes(letra))
      [codigoA, codigoZ] = [CODIGO_A_MAI, CODIGO_Z_MAI];

    const codigoDeslocado = letra.charCodeAt(0) - ALFABETO_MIN.indexOf(chave.toLowerCase());
    
    const codigo = codigoDeslocado < codigoA ? (codigoZ + 1) - (codigoA % codigoDeslocado) : codigoDeslocado;

    const letraModificada = String.fromCharCode(codigo);

    textoDecifrado += letraModificada;
  }

  return textoDecifrado;
}

console.log(decifrar('c', 'Dcvcvkpjc swcpfq Pcueg GurCnjc c TCoc rgnq Ejãq'));
