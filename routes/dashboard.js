const Matiere = require("../model/Matiere");

const Professeur = require("../model/professeur");
const Eleve = require("../model/Eleve");
let Assignment = require("../model/assignment");
const Etat = require('../routes/assignments').Etat;

function getDashboard(req, res) {
    Matiere.countDocuments((err, matiere) => {
        if (err) {
            res.send(err);
        }
        Professeur.countDocuments((err, professeur) => {
            if (err) {
                res.send(err);
            }
            Eleve.countDocuments((err, eleve) => {
                if (err) {
                    res.send(err);
                }
                res.json({
                    status: 200,
                    eleve: eleve,
                    professeur: professeur,
                    matiere: matiere
                });
            });
        });
    });
}


function getAssignmentDashboard(req, res){
    Assignment.countDocuments((err, assignment) => {
        if (err) {
            res.send(err);
        }
        Assignment.where({ 'rendu': true }).countDocuments((err, assignmentRendu) => {
            if (err) {
                res.send(err);
            }
            Assignment.where({ 'rendu': false }).countDocuments((err, assignmentPasRendu) => {
                if (err) {
                    res.send(err);
                }
                Assignment.where({ 'etat': Etat.EN_COURS }).countDocuments((err, assignmentEnCours) => {
                    if (err) {
                        res.send(err);
                    }
                    res.json({
                        status: 200,
                        assignment: assignment,
                        assignmentRendu: assignmentRendu,
                        assignmentPasRendu: assignmentPasRendu,
                        assignmentEnCours: assignmentEnCours
                    });
                });
            });
        });
    });
}

function getSuccessRateByMatter(req, res){
    Assignment.aggregate(
        [
          { $match: { rendu: true }},
          {
            $group:
              {
                _id: {id:"$professeur.matiere._id",nom:"$professeur.matiere.nom"},
                avgNote: { $avg: "$note" }
              }
          }
        ]
     )
    .exec((err, assignments) => {
        if(err) res.send(err);
        res.send(assignments);
    });
}

function getSuccessRateByProf(req, res) {
    Assignment.aggregate([
        { $match: { rendu: true} },
        { "$sort": { "professeur._id": -1 } },
        {
            $group: {
                _id: { id: '$professeur._id', nom: '$professeur.nom' },
                successRate: { $avg: "$note" }
            }
        },
    ]).exec((err, data) => {
        if(err)
            res.send(err)
        res.json(data)
    });
}

module.exports = {
    getDashboard,
    getAssignmentDashboard,
    getSuccessRateByMatter,
    getSuccessRateByProf
};
