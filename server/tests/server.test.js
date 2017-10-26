const expect = require( 'expect' ),
      {ObjectID} = require( 'mongodb' ),
      request = require( 'supertest' );

const {app} = require( './../server' ),
      {Todo} =require( './../models/todo' ),
      {User} = require( './../models/user' ),
      {todosTest, populateTodos, usersTest, populateUsers} = require( './seed/seed' );

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me', () => {
    it('Should return user if authenticated', ( done ) => {
        request(app)
            .get('/users/me')
            .set('x-auth', usersTest[0].tokens[0].token)
            .expect(200)
            .expect(( res ) => {
                expect(res.body._id).toBe(usersTest[0]._id.toHexString());
                expect(res.body.email).toBe(usersTest[0].email);
            })
            .end(done);
    });

    it('Should return a 401 if not authenticated', ( done ) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(( res ) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', ( done ) => {
        var email = 'example@example.com',
            password = '123mnb!';

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect(( res ) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end(( err ) => {
                if ( err ) {
                    return done(err);
                }

                User.findOne({email})
                    .then(( user ) => {
                        expect(user).toExist();
                        expect(user.password).toNotBe(password);
                        done();
                    })
                    .catch(( err ) => done(err));
            });
    });

    it('should return validation errors if request invalid', ( done ) => {
        request(app)
            .post('/users')
            .send({
                email: 'wrong',
                password: 'bad'
            })
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', ( done ) => {
        request(app)
            .post('/users')
            .send({
                email: usersTest[0].email,
                password: 'valid123!'
            })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('Should login user and return auth token', ( done ) => {
        request(app)
            .post('/users/login')
            .send({
                email: usersTest[1].email,
                password: usersTest[1].password
            })
            .expect(200)
            .expect(( res ) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end(( err, res ) => {
                if ( err ) {
                    return done(err);
                }

                User.findById( usersTest[1]._id)
                    .then(( user ) => {
                        expect(user.tokens[0]).toInclude({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });
                        done();
                    })
                    .catch(( err ) => done(err));
            });
    });

    it('Should reject invalid login', ( done ) => {
        request(app)
            .post('/users/login')
            .send({
                email: usersTest[1].email,
                password: usersTest[1].password + '1'
            })
            .expect(400)
            .expect(( res ) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end(( err, res ) => {
                if ( err ) {
                    return done(err);
                }

                User.findById( usersTest[1]._id)
                    .then(( user ) => {
                        expect(user.tokens.length).toBe(0)
                        done();
                    })
                    .catch(( err ) => done(err));
            });
    })
})