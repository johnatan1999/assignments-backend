let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

const Eleve = {
    id: Number,
    nom: String,
    prenom: String,
    image: String,
    sexe: String
}

const Matiere = {
    nom: String,
    image: String
}

let AssignmentSchema = Schema({
    id: Number,
    nom: String,
    description: String,
    note: Number,
    eleve: Eleve,
    dateDeRendu: Date,
    matiere: Matiere,
    rendu: Boolean
});

AssignmentSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);



