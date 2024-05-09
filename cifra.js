/**
 * 
 * @param {string} chave 
 * @param {string} texto 
 * @returns texto cifrado
 */
function cifrar(chave, texto) {
  const CODIGO_A = 97;
  const CODIGO_Z = 122;
  const alfabeto = 'abcdefghijklmnopqrstuvwxyz';
  
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