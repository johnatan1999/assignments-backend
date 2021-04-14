let mongoose = require('mongoose');

var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Professeur = require('./IModel').Professeur;
let Schema = mongoose.Schema;

let CoursSchema = Schema({
    titre: String,
    cours: String,
    pochette: String,
    professeur: Professeur,
});

CoursSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Cours', CoursSchema);