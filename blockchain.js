const SHA256 = require('crypto-js/sha256'); //SHA256 module from crypto-js.
const EC = require('elliptic').ec; //Elliptic for generate key pair and sign the transaction.
const ec = new EC('secp256k1'); //Encryption algorithm that is famous in Bitcoin. 

//Transaction data
class Transaction{
    constructor(fromAddr, toAddr, amount){
        this.fromAddr = fromAddr;
        this.toAddr = toAddr;
        this.amount = amount;
    }

    //Hash calculation for the transaction details.
    calHash(){
        return SHA256(this.fromAddr + this.toAddr + this.amount).toString();
    }

    
    signTransaction(signingkey){
        if(signingkey.getPublic('hex') !== this.fromAddr){
            throw new Error('You cannot sign transactions for other wallets!!');
        }

        const hashTx = this.calHash(); //Hash of transaction
        const sig = signingkey.sign(hashTx, 'base64'); //Create a signature for transaction

        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromAddr === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddr, 'hex'); 
        return publicKey.verify(this.calHash(), this.signature);   

    }

}

//Block strucutre
class Block{
    constructor(timestamp, transactions, previousHash = ''){
        //this.index = index; *The index is deleted since the block is determined by their position in the area. 
        this.transactions = transactions;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        //this.merkleRoot = merkleRoot;
        this.hash = this.calHash();
        this.nonce = 0;
    }

    //calculating hash value of a block
    calHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    //Proof of work algorithm
    mining(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calHash();
        }

        console.log("The block is mined with a hash: " + this.hash);
    }

    //Check if the block include valid transaction
    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}

class Blockchain{
    //The chain
    constructor(){
        this.chain = [this.genesisBlock()];
        this.difficulty = 2; //Set how many 0 at the top of the hash, will use in add block function.
        this.pendingTransactions = [];
        this.miningReward = 100; //The address will received the reward when he/she was mined the next block
    }

    chainLength(){
        return this.chain.length - 1;
    }

    //The genesis block
    genesisBlock(){
        return new Block("18/11/2022", "Genesis Block", "0");
    }

    //The newest block
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    //Mine a pending transaction
    minePending(miningRewardAddr){
        const rewardTx = new Transaction(null, miningRewardAddr, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mining(this.difficulty);

        console.log('Block is mined successful!!');
        this.chain.push(block);

        this.pendingTransactions =[
            new Transaction(null, miningRewardAddr, this.miningReward)
        ];
    }

    //add a transaction
    addTransaction(transaction){
        if(!transaction.fromAddr || !transaction.toAddr){                       //Check if the from address and to address is filled
            throw new Error('Transaction must include the from and to address');
        }

        if(!transaction.isValid()){
            throw new Error('Forbiddened to add invalid transaction');
        }

        this.pendingTransactions.push(transaction);
    }

    //Getting the balance of an address
    getBalanceOfaddr(addr){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddr === addr){
                    balance -= trans.amount;
                }
    
                if(trans.toAddr === addr){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    //Check if the chain is valid
    isChainValid(){
        for(let i = 1 ; i < this.chain.length; i++){
   
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
        
    }

}

//Importing module to main.js file
module.exports.Blockchain = Blockchain; 
module.exports.Transaction = Transaction; 