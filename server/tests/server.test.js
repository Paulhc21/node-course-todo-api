const expect = require( 'expect' ),
      {ObjectID} = require( 'mongodb' ),
      request = require( 'supertest' );

const {app} = require( './../server' ),
      {Todo} =require( './../models/todo' );

const todosTest = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 121314
}];

beforeEach(( done ) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todosTest);
        })
        .then(() => done());
});

describe('POST /todos', () => {
    it('Should create a new todo', ( done ) => {
        var text = 'Run to the market';

        request( app )
            .post('/todos')
            .send({text})
            .expect(200)
            .expect(( res ) => {
                expect(res.body.text).toBe(text);
            })
            .end(( err, res ) => {
                if ( err ) {
                    return done(err);
                }

                Todo.find({text})
                    .then(( todo ) => {
                        expect(todo.length).toBe(1);
                        expect(todo[0].text).toBe(text);
                        done();
                    })
                    .catch(( err ) => done(err));
            });
    });

    it('Should not create todo with invalid body data', ( done ) => {
        request( app )
            .post('/todos')
            .send({})
            .expect(400)
            .end(( err, res ) => {
                if ( err ) {
                    return done(err);
                }

                Todo.find()
                    .then(( todo ) => {
                        expect(todo.length).toBe(2);
                        done();
                    })
                    .catch(( err ) => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('Should get all todos', ( done ) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect(( res ) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('Should return todo doc',  ( done ) => {
        request(app)
            .get(`/todos/${ todosTest[0]._id.toHexString() }`)
            .expect(200)
            .expect(( res ) => {
                expect(res.body.todo.text).toBe(todosTest[0].text);
            })
            .end(done);
    });

    it('Should return a 404 if todo not found', ( done ) => {
        request(app)
            .get(`/todos/${ new ObjectID().toHexString() }`)
            .expect(404)
            .end(done);
    });

    it('Should return a 404 for non-object ids', ( done ) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('Should remove a todo', ( done ) => {
        request(app)
            .delete(`/todos/${ todosTest[0]._id.toHexString() }`)
            .expect(200)
            .expect(( res ) => {
                expect(res.body.todo._id).toBe(todosTest[0]._id.toHexString())
            })
            .end(( err, res ) => {
                if ( err ) {
                    return done(err);
                }

                Todo.findById(todosTest[0]._id.toHexString())
                    .then(( todo ) => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch(( err ) => done(err));
            });
    });

    it('Should return a 404 if todo not found', ( done ) => {
        request(app)
            .delete(`/todos/${ new ObjectID().toHexString() }`)
            .expect(404)
            .end(done);
    });

    it('Should return a 404 for non-object ids', ( done ) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update the todo', ( done ) => {
        request(app)
            .patch(`/todos/${ todosTest[0]._id.toHexString() }`)
            .send({
                completed: true,
                text: 'testing update'
            })
            .expect(200)
            .expect(( res ) => {
                expect(res.body.todo.text).toBe('testing update');
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('Should clear completedAt when todo is not completed', ( done ) => {
        request(app)
            .patch(`/todos/${ todosTest[1]._id.toHexString() }`)
            .send({
                completed: false,
                text: 'testing update 2'
            })
            .expect(200)
            .expect(( res ) => {
                expect(res.body.todo.text).toBe('testing update 2');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});