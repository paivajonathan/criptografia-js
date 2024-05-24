import { generatePrimePairBetween, encrypt, decrypt } from "../utils/rsa";

export default function useEncryption() {
  const generateKeys = () => {
    const { prime1, prime2 } = generatePrimePairBetween(100, 1000);
    const publicKey = prime1 * prime2;
    const privateKey = { prime1, prime2 };

    return { publicKey, privateKey };
  };

  const encryptMessage = (message, publicKey) => {
    return encrypt(message, publicKey);
  };

  const decryptMessage = (encryptedMessage, privateKey) => {
    return decrypt(encryptedMessage, privateKey.prime1, privateKey.prime2);
  };

  return { generateKeys, encryptMessage, decryptMessage };
}
