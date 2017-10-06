//const MongoClient = require( 'mongodb' ).MongoClient;
const { MongoClient, ObjectID } = require( 'mongodb' );

MongoClient.connect('mongodb://localhost:27017/TodoApp', ( err, db ) => {

    if ( err ) {
        return console.log('Unable to connect to mongoDB server');
    }

    console.log('Connected to the mongoDB server');

    // delete multiple records
    /*db.collection('Todos').deleteMany({ text: 'eat a fun lunch' }).then(( result ) => {
        console.log(result);
    });*/

    // delete one record
    /*db.collection('Todos').deleteOne({ text: 'eat a fun lunch' }).then(( result ) => {
        console.log(result);
    });*/

    // find a record then delete it which returns the deleted record
    db.collection('Todos').findOneAndDelete({ completed: false }).then(( doc ) => {
        console.log(doc);
    });
    //db.close();

});
