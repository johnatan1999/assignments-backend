let mongoose = require('mongoose');
const Matiere = require('./IModel').Matiere;
const User = require('./IModel').User;

var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;


let ProfesseurSchema = Schema({
    id: Number,
    nom: String,
    prenom: String,
    image: String,
    matiere: Matiere,
    identifiant: User
});

ProfesseurSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Professeur', ProfesseurSchema);
