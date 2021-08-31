const crypto = require('crypto');

class Block {
    constructor(timestamp, data) {
        this.index = 0;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = " ";
        this.hash = this.computeHash();
        this.nonce = 0;
    }
  
    computeHash() {
        return crypto.createHash('sha256').update(
            this.index +
            this.precedingHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).digest('hex');
    }
  
    proofOfWork(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
        ) {
            this.nonce++;
            this.hash = this.computeHash();
        }
    }
  }

module.exports = Block;