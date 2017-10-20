require('./config/config');

// the {} around mongoose etc are a way to not have to call the object that gets pulled from module.exports
// this is called destructuring
const {mongoose} = require( './db/mongoose' ),
      {User} = require( './models/user' ),
      {Todo} = require( './models/todo' ),
      todoRoute = require( './routes/todos' );

const express = require( 'express' ),
      app = express(),
      {ObjectID} = require( 'mongodb' ),
      _ = require( 'lodash' );
      bodyParser = require( 'body-parser' );

var port = process.env.PORT;

app.use(bodyParser.json());

todoRoute( app );

app.post('/users', ( req, res ) => {
    var userData = _.pick( req.body, ['email', 'password'] ),
        newUser = new User( userData );

    newUser.save()
        .then(() => {
            return newUser.generateAuthToken();
        })
        .then(( token ) => {
            res.header('x-auth', token).send(newUser);
        })
        .catch(( err ) => {
            res.status(400).send(`${ err }`);
        });
});

app.listen(port, () => {
    console.log(`Server started on port ${ port }`);
});

module.exports = {
    app
};