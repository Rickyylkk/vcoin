const EC = require('elliptic').ec; //Elliptic for generate key pair and sign the transaction.
const ec = new EC('secp256k1'); //Encryption algorithm that is famous in Bitcoin. 

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex'); //Get public key in hex 
const privateKey = key.getPrivate('hex'); //Get private key in hex 

console.log();
console.log('Private key:', privateKey);

console.log();
console.log('Public key:', publicKey);
