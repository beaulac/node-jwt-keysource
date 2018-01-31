'use strict';
const { MultiKeySource } = require('./MultiKeySource');
const SigningKeyNotFoundError = require('./SigningKeyNotFoundError');


const defaultErrorHandler = (err, cb) => cb(err, null);


function buildKeyProvider(options) {
    if (Array.isArray(options) && options.every(x => typeof x === 'string')) {
        options = { uris: options };
    }

    if (!options || !options.uris) {
        throw new Error('Invalid URI options');
    }

    const keySource = new MultiKeySource();
    options.uris.forEach(uri => keySource.addURI(uri));

    const onError = options.handleError || defaultErrorHandler;

    return function keyProvider(req, header, payload, cb) {
        if (!header || header.alg !== 'RS256') {
            return cb(null, null);
        }

        const keyID = header.kid;
        if (!keyID) {
            return cb(new SigningKeyNotFoundError('Missing key ID in header'));
        }

        keySource.getKeyById(header.kid)
                 .then(key => cb(null, key))
                 .catch(err => onError(err, cb));
    };
}

module.exports.buildKeyProvider = buildKeyProvider;
