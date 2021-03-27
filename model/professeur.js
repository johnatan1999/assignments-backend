let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

const Matiere = {
    nom: String,
    image: String
}

let ProfesseurSchema = Schema({
    id: Number,
    nom: String,
    prenom: String,
    image: String,
    matiere: Matiere
});

ProfesseurSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Professeur', ProfesseurSchema);
