// the {} around mongoose etc are a way to not have to call the object that gets pulled from module.exports
// this is called destructuring
const {mongoose} = require( './db/mongoose' ),
      {User} = require( './models/user' ),
      {Todo} = require( './models/todo' );

const express = require( 'express' ),
      app = express(),
      {ObjectID} = require( 'mongodb' ),
      bodyParser = require( 'body-parser' );

var port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.get('/todos', ( req, res ) => {
    Todo.find({})
        .then(( todos ) => {
            res.send({ todos });
        }, ( err ) => {
            res.status(400).send(`${ err.message } ${ err.errors.text.message }`);
        });
});

app.post('/todos', ( req, res ) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save()
        .then(( doc ) => {
            res.send(doc);
        }, ( err ) => {
            res.status(400).send(`${ err.message } ${ err.errors.text.message }`);
        });
});

app.get('/todos/:id', ( req, res ) => {
    var id = req.params.id;
    
    if ( !ObjectID.isValid(id) ) {
        return res.status(404).send();
    }

    Todo.findById(id)
        .then(( todo ) => {
            if ( !todo ) {
                return res.status(404).send();
            }

            res.send({todo});
        })
        .catch(( err ) => {
            res.status(400).send();
        });
});

app.listen(port, () => {
    console.log(`Server started on port ${ port }`);
});

module.exports = {
    app
};