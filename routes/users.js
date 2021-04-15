/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file
var User = require('../model/user');
const Professeur = require('../model/professeur');
const Eleve = require('../model/eleve');

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


const Role = {
    Admin: "admin",
    Prof: "professeur",
    Eleve: "eleve"
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
        user.password = undefined;
        const response = {
            token: token,
            name: user.name,
            role: user.role,
            _id: user._id
        }
        if(jwt.verify(user.token, config.secret)) {
            // Get user Info
            if(user.role === Role.Eleve) {
                Eleve.findOne({'identifiant._id': user._id}).exec((err, eleve) => {
                    if(err) res.send(err);
                    response.user_info = {
                        image:eleve.image, 
                        _id: eleve._id,
                        nom: eleve.nom,
                        prenom: eleve.prenom
                    }
                    res.status(200).send({ auth: true, user: response});
                })
            } else if(user.role === Role.Prof) {
                Professeur.findOne({'identifiant._id': user._id}).exec((err, prof) => {
                    if(err) res.send(err);
                    response.user_info = {
                        image:prof.image, 
                        _id: prof._id,
                        nom: prof.nom,
                        prenom: prof.prenom
                    }
                    res.status(200).send({ auth: true, user: response});
                })
            } else if(user.role === Role.Admin) {
                res.status(200).send({ auth: true, user: response});
            } else {
                res.status(401).send({error: 'Access denied'});
            }
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

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader) {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        if(jwt.verify(bearerToken, config.secret))  {
            const userId = req.headers['userid'];
            User.findOne({'_id': userId}, (err, user) => {
                if(err) {
                    res.status(401).send({error: 'Access denied'})
                }
                req.user = user;      
                if(user && user.role === Role.Prof) {
                    Professeur.findOne({'identifiant._id': userId}, (err, prof) => {
                        req.profid = prof._id;
                        next();
                    })
                } else if(user && user.role === Role.Eleve) {
                    Eleve.findOne({'identifiant._id': userId}, (err, eleve) => {
                        req.eleveid = eleve._id;
                        next();
                    })
                } else {
                    next();
                }
            });
            // console.log("role", user)
        }
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

function salut(req,res){
    res.send('slt');
}

module.exports = {
    salut,
    doRegister,
    doLogin,
    logout,
    createUser,
    verifyToken,
    Role
};
