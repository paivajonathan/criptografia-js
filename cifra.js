const CODIGO_A = 97;
const CODIGO_Z = 122;
const alfabeto = 'abcdefghijklmnopqrstuvwxyz';

/**
 * @param {string} chave 
 * @param {string} texto 
 * @returns texto cifrado
 */
function cifrar(chave, texto) {
  if (texto.match(new RegExp('[^a-zA-Z ]'))) {
    console.log('Cheque seu texto!');
    return '';
  }

  let textoCifrado = '';

  for (let letra of texto) {
    if (!letra.trim()) {
      textoCifrado += letra;
      continue;
    }

    let codigo = letra.charCodeAt(0) + alfabeto.indexOf(chave);
    codigo = codigo > CODIGO_Z ? (codigo % (CODIGO_Z + 1)) + CODIGO_A : codigo;
    
    const letraModificada = String.fromCharCode(codigo);

    textoCifrado += letraModificada;
  }

  return textoCifrado;
}

console.log(cifrar('z', 'te2112#@!#@amo'));

/**
 * @param {string} chave 
 * @param {string} textoCifrado 
 * @returns texto decifrado
 */
function decifrar(chave, textoCifrado) {
  let textoDecifrado = '';

  for (let letra of textoCifrado) {
    if (!letra.trim()) {
      textoDecifrado += letra;
      continue;
    }

    let codigo = letra.charCodeAt(0) - alfabeto.indexOf(chave);
    codigo = codigo < CODIGO_A ? (CODIGO_Z + 1) - (CODIGO_A % codigo) : codigo;
   
    const letraModificada = String.fromCharCode(codigo);
   
    textoDecifrado += letraModificada;
  }

  return textoDecifrado;
}

console.log(decifrar('z', 'sd zln'));
