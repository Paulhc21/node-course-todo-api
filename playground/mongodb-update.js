//const MongoClient = require( 'mongodb' ).MongoClient;
const { MongoClient, ObjectID } = require( 'mongodb' );

MongoClient.connect('mongodb://localhost:27017/TodoApp', ( err, db ) => {

    if ( err ) {
        return console.log('Unable to connect to mongoDB server');
    }

    console.log('Connected to the mongoDB server');

    // update one record found
    db.collection('Todos').findOneAndUpdate({ _id: new ObjectID('59d71a39b03962c2e2ff9542')}, { $set: { completed: true } }, { returnOriginal: false }).then(( result ) => {
        console.log(result);
    });

    // update multiple properties on one record found
    db.collection('Users').findOneAndUpdate({ _id: new ObjectID('59d70958bc78ee2468c1d5d8') }, { $set: { name: 'Emily Stapleton' }, $inc: { age: 1 } }, { returnOriginal: false }).then(( result ) => {
        console.log(result);
    });

    //db.close();

});
