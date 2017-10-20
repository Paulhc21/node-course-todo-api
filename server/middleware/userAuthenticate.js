const {User} = require( './../models/user' );

module.exports = {

    //function to authenticate a user by the token in the browser header
    authenticate( req, res, next ) {
        var token = req.header('x-auth');
        
        User.findByToken(token)
            .then((user) => {
                if ( !user ) {
                    return Promise.reject();
                }
    
                req.user = user;
                req.token = token;
                next();
            })
            .catch(( err ) => {
                res.status(401).send();
            });
    }
};