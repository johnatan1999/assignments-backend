// Assignment est le "modèle mongoose", il est connecté à la base de données
const { where } = require("../model/assignment");
let Assignment = require("../model/assignment");

/* Version sans pagination */
// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/


function getAssignmentByState(req, res) {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  Assignment.find({'rendu': req.query.state === 'rendu', nom: { $regex: req.query.criteria }})
  .limit(limit)
  .skip(limit * page)
  .exec((err, assignments) => {
    if(err) res.send(err);
    res.send(assignments);
  })
}

// Récupérer tous les assignments (GET), AVEC PAGINATION
function getAssignments(req, res) {
  // nom: String,
  //   description: String,
  //   note: Number,
  //   eleve: Eleve,
  //   professeur: Professeur,
  //   dateDeRendu: Date,
  //   matiere: Matiere,
  var aggregations = [];
  var match = {};
  if(req.query.criteria) {
    match.nom = {"$regex": req.query.criteria.toLowerCase(), "$options": "i"}
  } if(req.query.state) {
    match.rendu = req.query.state === "rendu";
  }
  aggregations = [{ $match: match }];
  var aggregateQuery = Assignment.aggregate(aggregations).sort('-dateUpdate');
  // if(!req.query.state) {
    Assignment.aggregatePaginate(
      aggregateQuery,
      {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, assignments) => {
        if (err) {
          res.send(err);
        }
        res.send(assignments);
      }
    );
  // }
  // else {
  //   getAssignmentByState(req, res);
  // }
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
  let assignmentId = req.params.id;

  Assignment.findOne({ id: assignmentId }, (err, assignment) => {
    if (err) {
      res.send(err);
    }
    res.json(assignment);
  });
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
  let assignment = new Assignment();
  assignment.id = req.body.id;
  assignment.nom = req.body.nom;
  assignment.description = req.body.description;
  assignment.dateDeRendu = req.body.dateDeRendu;
  assignment.rendu = req.body.rendu;
  assignment.professeur = req.body.professeur;
  assignment.eleve = req.body.eleve;
  assignment.dateUpdate = new Date();
  
  // console.log("POST assignment reçu :");
  // console.log(assignment);

  assignment.save((err) => {
    if (err) {
      res.send("cant post assignment ", err);
    }
    res.json({ message: `${assignment.nom} saved!` });
  });
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
  req.body.dateUpdate = new Date();
  Assignment.findByIdAndUpdate(
    req.body._id,
    req.body,
    { new: true },
    (err, assignment) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log(req.body._id, "updated");
        res.json({ message: "updated" });
      }

      // console.log('updated ', assignment)
    }
  );
}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
  Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: `${assignment.nom} deleted` });
  });
}

module.exports = {
  getAssignments,
  getAssignmentByState,
  postAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
