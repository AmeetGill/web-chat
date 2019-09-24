self.window = self; // eslint-disable-line no-restricted-globals

self.importScripts( // eslint-disable-line no-restricted-globals
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"
);

self.addEventListener("message", e => { // eslint-disable-line no-restricted-globals
  const [messageType, messageId, text, key] = e.data;
  let result;
  switch (messageType) {
    case "encrypt":
      result = encrypt(text, key);
      break;
    case "decrypt":
      result = decrypt(text, key);
      break;
  }

  postMessage([messageId, result]);

  function encrypt(content, key) {
    return CryptoJS.AES.encrypt(content, key); // eslint-disable-line no-restricted-globals
  }

  function decrypt(content, key) {
    return CryptoJS.AES.decrypt(content, key); // eslint-disable-line no-restricted-globals
  }
});
