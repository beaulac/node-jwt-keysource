'use strict';
const { UriKeySource } = require('./UriKeySource');
const SigningKeyNotFoundError = require('./SigningKeyNotFoundError');
const _debug = require('debug')('jwt-keysource');


function _missingKey(kid, keys) {
    _debug(`Invalid key id: '${kid}'. Available keys: ${Object.keys(keys).join(', ')}.`);
    return Promise.reject(new SigningKeyNotFoundError(`Unable to find a key matching '${kid}'`));
}


class MultiKeySource {

    constructor(keySources = []) {
        this.keySources = keySources;
    }

    addURI(uri) {
        this.keySources.push(new UriKeySource(uri));
        return this;
    }

    /**
     * @return {Promise<{}[]>}
     */
    getVerificationKeys() {
        return Promise.all(this.keySources.map(ks => ks.getVerificationKeys()))
                      .then(keys => keys.reduce((acc, keyset) => ({ ...acc, ...keyset })));
    }

    /**
     * @return {Promise<string>}
     */
    getKeyById(kid) {
        return this.getVerificationKeys()
                   .then(
                       keys => keys[kid] || _missingKey(kid, keys)
                   );
    }

}

module.exports.MultiKeySource = MultiKeySource;
