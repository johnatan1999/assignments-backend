const { ObjectId } = require("bson");

const Matiere = {
    _id: ObjectId,
    id: Number,
    nom: String,
    image: String
}

const User = {  
    _id: ObjectId,
    name: String,
    email: String,
    password: String,
    token: String,
    role: String,
};

const Eleve = {
    _id: ObjectId,
    id: Number,
    nom: String,
    prenom: String,
    image: String,
    sexe: String
}

const Professeur = {
    _id: ObjectId,
    nom: String,
    prenom: String,
    image: String,
    matiere: Matiere
}

module.exports = {
    Matiere,
    User,
    Eleve,
    Professeur
}