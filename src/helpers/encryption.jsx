import CryptoJS from 'crypto-js';

const secretKey = import.meta.env.VITE_SECRET_KEY;

if (!secretKey) {
  console.error('Secret key is undefined');
}

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};