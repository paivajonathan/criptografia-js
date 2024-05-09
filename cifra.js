const CODIGO_A = 97;
const CODIGO_Z = 122;
const alfabeto = 'abcdefghijklmnopqrstuvwxyz';

/**
 * 
 * @param {string} chave 
 * @param {string} texto 
 * @returns texto cifrado
 */
function cifrar(chave, texto) {
  let textoCifrado = '';

  for (let letra of texto) {
    let codigo = letra.charCodeAt(0) + alfabeto.indexOf(chave);
    codigo = codigo > CODIGO_Z ? (codigo % (CODIGO_Z + 1)) + CODIGO_A : codigo;
    
    let letraModificada = String.fromCharCode(codigo);
   
    textoCifrado += letraModificada;
  }

  return textoCifrado;
}

console.log(cifrar('z', 'xyz'));

function decifrar(chave, textoCifrado) {
  let textoDecifrado = '';

  for (let letra of textoCifrado) {
    let codigo = letra.charCodeAt(0) - alfabeto.indexOf(chave);
    codigo = codigo < CODIGO_A ? (CODIGO_Z + 1) - (CODIGO_A % codigo) : codigo;
   
    let letraModificada = String.fromCharCode(codigo);
   
    textoDecifrado += letraModificada;
  }

  return textoDecifrado;
}


console.log(decifrar('z', 'wxy'));