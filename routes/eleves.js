const Eleve = require("../model/Eleve");
const createUser = require("./users").createUser;

function getEleves(req, res){
    Eleve.find((err, eleves) => {
        if(err){
            res.send(err)
        }

        res.send(eleves);
    });
}

// Ajout d'un assignment (POST)
function postEleve(req, res) {
    let eleve = new Eleve();
    eleve.nom = req.body.nom;
    eleve.prenom = req.body.prenom;
    eleve.image = req.body.image || '';
    eleve.sexe = req.body.sexe;
    eleve.iduser = req.body.iduser || '';
    var user = {};
    user.name = `${eleve.nom} ${eleve.prenom}`;
    user.password = "password"
    user.email = `${eleve.nom}${eleve.prenom}@gmail.com`;
    user.role = "eleve";
    user = createUser(user);
    eleve.identifiant = user;
    console.log("POST eleve reçu :");
    console.log(eleve);
    eleve.save((err) => {
        if (err) {
        res.send("cant post eleve ", err);
        }
        res.json({ message: `${eleve.nom} ${eleve.prenom} saved!` });
    });
}

module.exports = {
    getEleves,
    postEleve
}