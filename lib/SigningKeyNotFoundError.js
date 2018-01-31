'use strict';

class SigningKeyNotFoundError extends Error {
    constructor(message, extra) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'SigningKeyNotFoundError';
        this.message = message;
        if (extra) {
            this.extra = extra;
        }
    }
}

module.exports = SigningKeyNotFoundError;
