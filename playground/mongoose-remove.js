const {ObjectID} = require( 'mongodb' );

const {mongoose} = require( './../server/db/mongoose' ),
      {Todo} = require( './../server/models/todo' );

/*Todo.remove({})
    .then(( res ) => {
        console.log(res);
    });*/

//Todo.findByIdAndRemove() other way to remove

Todo.findByIdAndRemove('59e04bd28593588839bf252c')
    .then(( todo ) => {
        console.log(todo);
    });

Todo.find({})
    .then(( todos ) => {
        console.log(todos);
    });
