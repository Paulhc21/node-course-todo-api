const {SHA256} = require( 'crypto-js' );
const jwt = require( 'jsonwebtoken' );

// example using standards created by jsonwebtoken

var data = {
    id: 10
}

var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);

// example to show how hashing and salts work for user password
// in the app there will be a library that does this work for us
var message = 'I am user number 7';
var hash = SHA256(message).toString();

console.log(`Message: ${ message }`);
console.log(`Hash: ${ hash }`);

var data = {
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if ( resultHash === token.hash ) {
    console.log('data was not changed');
} else {
    console.log('data was changed do not trust');
}
