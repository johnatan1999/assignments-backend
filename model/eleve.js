let mongoose = require('mongoose');
const User = require('./IModel').User;

var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let EleveSchema = Schema({
    id: Number,
    nom: String,
    prenom: String,
    image: String,
    sexe: String,
    identifiant: User
});

EleveSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Eleve', EleveSchema);
