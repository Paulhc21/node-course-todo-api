const {Todo} = require( '.././models/todo' ),
      userAuth = require( '.././middleware/userAuthenticate' ),
      {ObjectID} = require( 'mongodb' ),
      _ = require( 'lodash' );

module.exports = ( app ) => {
    
app.get('/todos', userAuth.authenticate, ( req, res ) => {
    Todo.find({
        _creator: req.user._id
        })
        .then(( todos ) => {
            res.send({ todos });
        }, ( err ) => {
            res.status(400).send(`${ err.message } ${ err.errors.text.message }`);
        });
});

app.post('/todos', userAuth.authenticate, ( req, res ) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save()
        .then(( doc ) => {
            res.send(doc);
        }, ( err ) => {
            res.status(400).send(`${ err.message } ${ err.errors.text.message }`);
        });
});

app.get('/todos/:id', userAuth.authenticate, ( req, res ) => {
    var id = req.params.id;
    
    if ( !ObjectID.isValid(id) ) {
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
        })
        .then(( todo ) => {
            if ( !todo ) {
                return res.status(404).send();
            }

            res.status(200).send({todo});
        })
        .catch(( err ) => {
            res.status(400).send();
        });
});

app.patch('/todos/:id', userAuth.authenticate, ( req, res ) => {
    var id = req.params.id,
        body = _.pick(req.body, ['text', 'completed']);

    if ( !ObjectID.isValid(id) ) {
        return res.status(404).send();
    }

    if ( _.isBoolean(body.completed) && body.completed ) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, { $set: body }, {new: true})
        .then(( todo ) => {
            if ( !todo ) {
                return res.status(404).send();
            }

            res.status(200).send({todo});
        })
        .catch(( err ) => {
            res.status(400).send();
        });
});

app.delete('/todos/:id', userAuth.authenticate, ( req, res ) => {
    var id = req.params.id;
    
    if ( !ObjectID.isValid(id) ) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
        })
        .then(( todo ) => {
            if ( !todo ) {
                return res.status(404).send();
            }

            res.status(200).send({todo});
        })
        .catch(( err ) => {
            res.status(400).send();
        });
});

};