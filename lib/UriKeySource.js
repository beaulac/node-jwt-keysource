'use strict';
const request = require('request');
const _debug = require('debug')('jwt-keysource');

class UriKeySource {

    constructor(certsEndpoint) {
        this.certsEndpoint = certsEndpoint;
        this.verificationKeys = undefined;
        this.keyExpiryTimestamp = -1;
    }

    getVerificationKeys() {
        if (this.keyExpiryTimestamp > Date.now()) {
            return Promise.resolve(this.verificationKeys);
        }
        return this._refreshKeys();
    }

    _refreshKeys() {
        _debug(`Refreshing keys from ${this.certsEndpoint}`);
        return new Promise((resolve, reject) => request.get(
            this.certsEndpoint,
            (err, response, body) => {
                if (err) {
                    return reject(err);
                }

                try {
                    this.verificationKeys = JSON.parse(body);
                } catch (err) {
                    return reject(Error(`Could not parse keys from ${this.certsEndpoint}`));
                }

                if (this.verificationKeys && Object.keys(this.verificationKeys).length) {
                    this._setKeysExpiryFromHeaders(response.headers);
                    return resolve(this.verificationKeys);
                } else {
                    return reject(Error('Invalid keys response'));
                }
            }
        ));
    }

    _setKeysExpiryFromHeaders(headers) {
        const [, secToExpiry] = /max-age=([^,]+)/.exec(headers['cache-control']) || [];

        this.keyExpiryTimestamp = Number.isSafeInteger(secToExpiry)
            ? Date.now() + (secToExpiry * 1000)
            : Date.parse(headers['expires']);

        _debug(`Next key refresh for ${this.certsEndpoint}: ${this.keyExpiryTimestamp}`);
    }
}

module.exports.UriKeySource = UriKeySource;
