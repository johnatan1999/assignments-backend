const Cours = require("../model/cours");
const Professeur = require("../model/professeur");
const { ObjectId } = require('mongodb');
/*function getProfesseurs(req, res){
    Professeur.find((err, professeurs) => {
        if(err){
            res.send(err)
        }

        res.send(professeurs);
    });
}*/

function getCours(req, res){
  Cours.find({'professeur.matiere._id' : ObjectId(req.query.id) },(err, cours) => {
      if(err){
          res.send(err)
      }
      res.send(cours);
  });
}


/*function getCour(req, res){
   
  // find users above 18 by city
  let aggregate = Cours.aggregate();
  aggregate.match({ 'professeur.matiere._id': req.query.id })

  let options = { page : (req.query.page - 1), limit : req.query.limit}
   
  // callback
  Cours.aggregatePaginate(aggregate, options, function(err, results, pages, count) {
    if(err) 
    {
      res.send(err);
    }
    else
    { 
      res.send(cours);
    }
  })
}*/


/*function getCours(req, res) {
  var aggregateQuery = Cours.aggregate([
    { $match: { 'professeur.matiere._id': req.query.id } },
  ]);*/
  /* aggregateQuery.match({ '$professeur.matiere._id': ObjectId(req.query.id) })
     .group({ _id: { titre: "$titre", cours: "$cours", pochette: "$pochette" } })*/

 /* Cours.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page - 1) || 0,
      limit: parseInt(req.query.limit) || 4,

    },
    (err, cours) => {
      if (err) {
        res.send(err);
      }
      res.send(cours);
    }
  );*/

  /*const page = parseInt(req.query.page-1) || 0;
  const limit = parseInt(req.query.limit) || 4;
  Cours.find({'professeur.matiere._id' : ObjectId(req.query.id) })
  .limit(limit)
  .skip(limit * page)
  .exec((err, cours) => {
    if(err) res.send(err);
    res.send(cours);
  })
}*/

// Ajout d'un cours (POST)
function postCours(req, res) {
  let cours = new Cours();
  cours.titre = req.body.titre;
  cours.cours = req.body.cours;
  cours.pochette = req.body.pochette;
  Professeur.findOne({ _id: req.body.professeur }, (err, professeur) => {
    if (err) res.send(err);
    cours.professeur = professeur;
    cours.save((err) => {
      if (err) {
        res.send("cant post cours ", err);
      }
      res.json({ message: `${cours.titre} saved!` });
    });
  });
}

module.exports = {
  getCours,
  postCours,
};
