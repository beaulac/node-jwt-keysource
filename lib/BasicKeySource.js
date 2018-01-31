'use strict';

class BasicKeySource {
    constructor(kid, key) {
        if (Object.prototype.toString.call(kid) === '[object Object]') {
            this.keys = kid;
        } else {
            this.keys = { [kid]: key };
        }
    }

    getVerificationKeys() {
        return this.keys;
    }
}

module.exports.BasicKeySource = BasicKeySource;
