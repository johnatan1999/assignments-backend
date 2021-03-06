const Eleve = require("../model/eleve");
const Role = require('../model/role');
const createUser = require("./users").createUser;

// Récupérer tous les eleves (GET), AVEC PAGINATION
function getAllEleves(req, res) {
  Eleve.find({}, (err, eleves) => {
    if(err) res.send(err);
    res.send(eleves);
  })
}

function getEleves(req, res) {
    var aggregateQuery = Eleve.aggregate();
    
    Eleve.aggregatePaginate(
      aggregateQuery,
      {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, eleves) => {
        if (err) {
          res.send(err);
        }
        res.send(eleves);
      }
    );
  }


/*function getEleves(req, res){
    Eleve.find((err, eleves) => {
        if(err){
            res.send(err)
        }

        res.send(eleves);
    });
}*/

// Ajout d'un eleve (POST)
function postEleve(req, res) {
    let eleve = new Eleve();
    eleve.id = req.body.id;
    eleve.nom = req.body.nom;
    eleve.prenom = req.body.prenom;
    eleve.image = req.body.image || '';
    eleve.sexe = req.body.sexe;
    eleve.iduser = req.body.iduser || '';
    var user = {};
    user.name = `${eleve.nom} ${eleve.prenom}`;
    user.password = "password"
    user.email = `${eleve.nom}${eleve.prenom}@gmail.com`.toLowerCase();
    user.role = Role.ELEVE;
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
    postEleve,
    getAllEleves
}