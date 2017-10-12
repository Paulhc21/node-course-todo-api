const {ObjectID} = require( 'mongodb' );

const {mongoose} = require( './../server/db/mongoose' ),
      {Todo} = require( './../server/models/todo' );

var id = '59def3b40078c0a831d5519311';

if ( !ObjectID.isValid(id) ) {
    console.log('ID not valid');
}

Todo.find({
    _id: id
}).then(( todos ) => {
    console.log('todos', todos);
});

Todo.findOne({
    _id: id
}).then(( todo ) => {
    console.log('todos', todo);
});

Todo.findById(id).then(( todo ) => {
    if (!todo) {
        return console.log('ID not found in the database');
    }
    console.log('todos by id', todo);
}).catch(( err ) => console.log(err));