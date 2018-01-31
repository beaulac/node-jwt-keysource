# jwt-keysource
[![npm](https://img.shields.io/npm/v/jwt-keysource.svg)]()

(Work In Progress)
 
A library to provide keys for JWT verification.

`npm install --save jwt-keysource` 

### Example
```javascript
var signingKeyUrls = [
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
    'https://www.googleapis.com/oauth2/v1/certs'
];

/*
* For inclusion in middleware:
*
* Is a function taking arguments (req, header, payload, cb)
*/
var signingKeyProvider = require('jwt-keysource').buildKeyProvider(signingKeyUrls);


/*
 * Raw key source:
 * Exposes 'getVerificationKeys()' which returns a promise of keys JSON. 
 */
var UriKeySource = require('jwt-keysource').UriKeySource;
var myKeySource = new UriKeySource(/* URI to JSON of keys mapped by key ID*/)
```

### Showing Trace Logs
To show trace logs you can set the following environment variable:

```bash
DEBUG=jwt-keysource
```

### License
ISC

### Acknowledgements
* Inspired by auth0's [jwks-rsa](https://github.com/auth0/node-jwks-rsa) library