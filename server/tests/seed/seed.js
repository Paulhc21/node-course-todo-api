const {ObjectID} = require( 'mongodb' ),
      jwt = require( 'jsonwebtoken' );

const {Todo} = require( './../../models/todo' ),
      {User} = require( './../../models/user' );

const testUserOneId = new ObjectID();
const testUserTwoId = new ObjectID();
const usersTest = [{
    _id: testUserOneId,
    email: 'paul@test.com',
    password: 'testonepass123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: testUserOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: testUserTwoId,
    email: 'emily@test.com',
    password: 'testtwopass123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: testUserTwoId, access: 'auth'}, 'abc123').toString()
    }]
}];

const todosTest = [{
    _id: new ObjectID(),
    text: 'first test todo',
    _creator: testUserOneId
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 121314,
    _creator: testUserTwoId
}];

const populateTodos = ( done ) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todosTest);
        })
        .then(() => done());
};

const populateUsers = ( done ) => {
    User.remove({})
        .then(() => {
            var userOne = new User(usersTest[0]).save();
            var userTwo = new User(usersTest[1]).save();

            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
};

module.exports = {
    todosTest,
    populateTodos,
    usersTest,
    populateUsers
}