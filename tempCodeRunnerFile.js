);


console.log('\n starting the miner...');
vCoin.minePending(myWalletAddr);

console.log('\nBalance of Ricky is', vCoin.getBalanceOfaddr(myWalletAddr));

console.log('Is chain valid? ', vCoin.isChainValid());
