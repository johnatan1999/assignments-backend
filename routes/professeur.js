const Professeur = require('../model/professeur');

function getProfesseurs(req, res){
    Professeur.find((err, professeurs) => {
        if(err){
            res.send(err)
        }

        res.send(professeurs);
    });
}

module.exports = {
    getProfesseurs
}