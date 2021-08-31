const Block = require('./block');

class Blockchain {
    constructor() {
        this.blockchain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block((new Date()).toLocaleString(), "Initial Block in the Record Chain");
    }

    getLastestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    static instanceFrom(blockchain) {
        const _blockchain = new Blockchain();
        _blockchain.blockchain = blockchain;
        return _blockchain;
    }

    addBlock(block) {
        let latestBlockIndex = this.blockchain.length - 1;
        let newBlockIndex = latestBlockIndex + 1;
        block.index = newBlockIndex;
        block.precedingHash = this.getLastestBlock().hash;
        block.proofOfWork(this.difficulty);
        this.blockchain.push(block);
    }

    validateBlockchain() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i - 1];

            if (currentBlock.hash !== currentBlock.computeHash()) {
                return false;
            }

            if (currentBlock.precedingHash !== precedingBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports = Blockchain;