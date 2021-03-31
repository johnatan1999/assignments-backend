const Matiere = require('../model/Matiere');

function getMatieres(req, res){
    Matiere.find((err, Matieres) => {
        if(err){
            res.send(err)
        }

        res.send(Matieres);
    });
}

function postMatiere(req, res) {
    let matiere = new Matiere();
    matiere.id = req.body.id;
    matiere.nom = req.body.nom;
    matiere.image = req.body.image;
    matiere.save((err) => {
        if (err) {
            res.send("cant post matiere ", err);
        }
        res.json({ message: `${matiere.nom} saved!`, matiere:matiere});
    });
}

module.exports = {
    getMatieres,
    postMatiere
}