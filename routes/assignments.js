// Assignment est le "modèle mongoose", il est connecté à la base de données
const { where } = require("../model/assignment");
let Assignment = require("../model/assignment");
const { Professeur } = require("../model/IModel");
const { Role } = require("./users");
const ProfesseurModel = require("../model/professeur");

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


const Etat = {
  EN_COURS: 1,
  EN_ATTENTE: 2,
  NOTEE: 3
}

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

function getStudentAssignmentsByProfessor(req, res) {
  Assignment.find({ 'eleve.id': req.params.eleve_id, 'professeur._id': req.params.prof_id }, (err, assignments) => {
    if(err) res.send(err);
    res.send(assignments);
  });
}

function getStudentAssignmentsGroupedByProfessor(req, res) {
  ProfesseurModel.find({}, (err, professeurs) => {
    if(err) res.send(err);
    const response = { id: req.params.id, data: [] }
    const promises = []
    for(professeur of professeurs) {
      promises.push(
        // Assignment.find({ 'eleve._id': req.params.id, 'professeur._id': professeur._id }).select(['-professeur', '-eleve'])
        Assignment.find({ 'eleve._id': req.params.id, 'professeur._id': professeur._id })
      );
    }
    Promise.all(promises).then((data) => {
      for(i in data) {
        response.data.push({
          professeur: professeurs[i],
          assignments: data[i]
        })
      }
      res.send(response);
    });
  })
} 

function getQueryFilterByRole(req) {
  if(req.user) {
    if(req.user.role === Role.Prof) {
      return { 'professeur._id': req.profid }
    }
  }
  return {};
}

function UpdateMatchQueryByRole(req, match={}) {
  if(req.user) {
    if(req.user.role === Role.Prof) {
      match['professeur._id'] = req.profid;
    }else if(req.user.role === Role.Eleve) {
      match['eleve._id'] = req.eleveid;
    } 
  }
  return match;
}



// Récupérer tous les assignments (GET), AVEC PAGINATION
function getAssignments(req, res) {
  var aggregations = [];
  var match = {};
  if(req.query.criteria) {
    match.nom = {"$regex": req.query.criteria.toLowerCase(), "$options": "i"}
  } 
  if(req.query.state) {
    if(req.query.state === ''+Etat.NOTEE) {
      match.etat = parseInt(req.query.state);
    } else {
      match.rendu = req.query.state === "rendu";
      match.etat = {$ne: Etat.NOTEE};
   }
  }
  match = UpdateMatchQueryByRole(req, match)
  aggregations = [{ $match: match }];
  var aggregateQuery = Assignment.aggregate(aggregations).sort('-dateUpdate');
  Assignment.aggregatePaginate(
    aggregateQuery, { page: parseInt(req.query.page) || 0, limit: parseInt(req.query.limit) || 10 },
    (err, assignments) => {
      if (err) res.send(err);
      res.send(assignments);
    }
  );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
  let assignmentId = req.params.id;
  filter = { id: assignmentId }
  Assignment.findOne(filter, (err, assignment) => {
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
  assignment.rendu = req.body.note > 0 ? true : req.body.rendu;
  assignment.professeur = req.body.professeur;
  assignment.eleve = req.body.eleve;
  assignment.note = req.body.note;
  assignment.dateUpdate = new Date();
  assignment.etat = req.body.etat;
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
  getStudentAssignmentsByProfessor,
  Etat, 
  getStudentAssignmentsGroupedByProfessor
};
