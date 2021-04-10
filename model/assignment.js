let mongoose = require('mongoose');
const Matiere = require('./IModel').Matiere;
const Eleve = require('./IModel').Eleve;
const Professeur = require('./IModel').Professeur;

var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    id: Number,
    nom: String,
    description: String,
    note: Number,
    eleve: Eleve,
    professeur: Professeur,
    dateDeRendu: Date,
    matiere: Matiere,
    rendu: Boolean,
    dateUpdate: Date,
    enCours: Boolean
});

AssignmentSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);



