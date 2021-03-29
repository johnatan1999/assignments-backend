const Professeur = require('../model/professeur');
const createUser = require('./users').createUser;

function getProfesseurs(req, res){
    Professeur.find((err, professeurs) => {
        if(err){
            res.send(err)
        }

        res.send(professeurs);
    });
}

// Ajout d'un assignment (POST)
function postProfesseur(req, res) {
    let prof = new Professeur();
    prof.nom = req.body.nom;
    prof.prenom = req.body.prenom;
    prof.image = req.body.image;
    prof.matiere = req.body.matiere;
    prof.iduser = req.body.iduser || '';
    console.log("POST prof reçu :");
    console.log(prof);

    var user = {};
    user.name = `${prof.nom} ${prof.prenom}`;
    user.password = "password"
    user.email = `${prof.nom}${prof.prenom}@gmail.com`;
    user.role = "prof";
    user = createUser(user);
    prof.identifiant = user;
    prof.save((err) => {
        if (err) {
        res.send("cant post prof ", err);
        }
        res.json({ message: `${prof.nom} ${prof.prenom} saved!` });
    });
}

module.exports = {
    getProfesseurs,
    postProfesseur
}