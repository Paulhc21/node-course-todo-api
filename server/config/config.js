var env = process.env.NODE_ENV || 'development';
console.log('env *******', env);

if ( env === 'development' ) {
    process.env.PORT = 8080;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp', { keepAlive: true, reconnectTries: Number.MAX_VALUE, useMongoClient: true };
} else if ( env === 'test' ) {
    process.env.PORT = 8080;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest', { keepAlive: true, reconnectTries: Number.MAX_VALUE, useMongoClient: true };
}