//const MongoClient = require( 'mongodb' ).MongoClient;
const { MongoClient, ObjectID } = require( 'mongodb' );

MongoClient.connect('mongodb://localhost:27017/TodoApp', ( err, db ) => {

    if ( err ) {
        return console.log('Unable to connect to mongoDB server');
    }

    console.log('Connected to the mongoDB server');

    db.collection('Todos').find({
        _id: new ObjectID('59d6f6d3d8de7715fc7beb6d')
    }).toArray().then(( docs ) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, ( err ) => {
        console.log('Unable to fetch the docs', err);
    });

    db.collection('Todos').find().count().then(( count ) => {
        console.log(`Todos count: ${ count }`);
    }, ( err ) => {
        console.log('Unable to fetch the docs', err);
    });

    db.collection('Users').find({ name: 'Paul Canty' }).toArray().then(( doc ) => {
        console.log('Pauls Doc');
        console.log(JSON.stringify(doc, undefined, 2));
    }, ( err ) => {
        console.log('Didnt work'. err);
    });

    //db.close();

});
