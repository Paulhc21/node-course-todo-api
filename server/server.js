// the {} around mongoose etc are a way to not have to call the object that gets pulled from module.exports
// this is called destructuring
const {mongoose} = require( './db/mongoose' ),
      {User} = require( './models/user' ),
      {Todo} = require( './models/todo' );

const express = require( 'express' ),
      app = express(),
      bodyParser = require( 'body-parser' );

var port = process.env.PORT || 8080;

app.use(bodyParser.json());

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

app.listen(port, () => {
    console.log(`Server started on port ${ port }`);
});