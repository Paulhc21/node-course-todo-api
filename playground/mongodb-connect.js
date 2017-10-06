//const MongoClient = require( 'mongodb' ).MongoClient;
const { MongoClient, ObjectID } = require( 'mongodb' );

MongoClient.connect('mongodb://localhost:27017/TodoApp', ( err, db ) => {

    if ( err ) {
        return console.log('Unable to connect to mongoDB server');
    }

    console.log('Connected to the mongoDB server');

    /*db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, ( err, result ) => {
        if ( err ) {
            return console.log('Unable to insert a todo', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });*/

    db.collection('Users').insertOne({
        name: 'Bill Stevenson',
        age: 38,
        location: '453 San Carlos Drive'
    }, ( err, result ) => {
        if ( err ) {
            return console.log('Unable to insert a todo', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.close();

});