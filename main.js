const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec; //Elliptic for generate key pair and sign the transaction.
const ec = new EC('secp256k1'); //Encryption algorithm that is famous in Bitcoin.

const myKey = ec.keyFromPrivate('6b366f98c290c8fe8348a66febbd62a2a50a89b721057a60c5377b76db77df03');
const myWalletAddr = myKey.getPublic('hex');

let vCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddr, 'public key goes here', 10);
tx1.signTransaction(myKey);
vCoin.addTransaction(tx1);


console.log('\n starting the miner...');
vCoin.minePending(myWalletAddr);

console.log('\nBalance of Ricky is', vCoin.getBalanceOfaddr(myWalletAddr));

console.log('Is chain valid? ', vCoin.isChainValid());

