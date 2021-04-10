/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file
var User = require('../model/user');

// register (POST)
function doRegister(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role;
    user.password = hashedPassword;


    console.log("POST user reçu :");
    console.log(user);

    // if user is registered without errors
    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });
    user.token = token;
    user.save((err) => {
        if (err) {
            res.send("cant post user ", err);
        }
        res.json({ message: `${user.name} saved!`, auth: true, user:user});
    });
}

//login (POST)
function doLogin(req, res) {
    let userEmail = req.body.email;
    User.findOne({ email: userEmail }, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        // check if the password is valid
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        // if user is found and password is valid
        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        user.token = token;
        // console.log("###", jwt.verify(token, config.secret));
        if(jwt.verify(user.token, config.secret)) {
            res.status(200).send({ auth: true, user:user });
        } else {
            res.status(401).send({error: 'Access denied'});
        }
        // return the information including token as JSON
        //res.json(assignment);
    });
}

//logout (GET)
function logout(req, res) {
    res.status(200).send({ auth: true, token: null });
}

// CREATES A NEW USER
/*router.post('/', function (req, res) {
    User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});
*/
// RETURNS ALL THE USERS IN THE DATABASE
/*router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});*/

// GETS A SINGLE USER FROM THE DATABASE
/*router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});*/

// DELETES A USER FROM THE DATABASE
/*router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
});*/

// UPDATES A SINGLE USER IN THE DATABASE
/*router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});*/

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader) {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        if(jwt.verify(bearerToken, config.secret)) 
            next();
        else
            res.status(401).send({error: 'Access denied'})
    } else {
        res.status(401).send({error: 'Access denied'})
    }
}

function createUser(user_) {
    var hashedPassword = bcrypt.hashSync(user_.password, 8);
    let user = new User();
    user.name = user_.name;
    user.email = user_.email;
    user.role = user_.role;
    user.password = hashedPassword;


    console.log("POST user reçu :");
    console.log(user);

    // if user is registered without errors
    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });
    user.token = token;
    user.save();
    return user;
}

module.exports = {
    doRegister,
    doLogin,
    logout,
    createUser,
    verifyToken
};
