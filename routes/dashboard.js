const Matiere = require("../model/Matiere");

const Professeur = require("../model/professeur");
const Eleve = require("../model/Eleve");
let Assignment = require("../model/assignment");

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
                res.json({
                    status: 200,
                    assignment: assignment,
                    assignmentRendu: assignmentRendu,
                    assignmentPasRendu: assignmentPasRendu
                });
            });
        });
    });
}


module.exports = {
    getDashboard,
    getAssignmentDashboard,
};
