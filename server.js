let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const cors = require('cors');
let professeur = require('./routes/professeur');
let assignment = require('./routes/assignments');
let matiere = require('./routes/matiere');
let eleve = require('./routes/eleves');
let user = require('./routes/users');
let cours = require('./routes/cours');

let dashboard = require('./routes/dashboard');
let _ = require('./routes/_');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
//const uri = 'mongodb+srv://mb:P7zM3VePm0caWA1L@cluster0.zqtee.mongodb.net/assignments?retryWrites=true&w=majority';
const uri='mongodb+srv://joh:foot@cluster0.wqqnt.mongodb.net/assignments?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(cors());
app.options('*', cors())
app.use((req, res, next) =>  {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "https://assignments-frontend.herokuapp.com/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.route(prefix + '/assignments')
  .get(user.verifyToken, assignment.getAssignments)
  .post(user.verifyToken, assignment.postAssignment)
  .put(user.verifyToken, assignment.updateAssignment);


app.route(prefix + '/assignments/:id')
.get(user.verifyToken, assignment.getAssignment)
.delete(user.verifyToken, assignment.deleteAssignment);

app.route(prefix + '/assignments/eleve/:id')
.get(assignment.getStudentAssignmentsGroupedByProfessor)

// Eleve
app.route(prefix + '/eleves')
  .get(user.verifyToken, eleve.getEleves)
  .post(user.verifyToken, eleve.postEleve);

app.route(prefix + '/professeurs')
  .post(user.verifyToken, professeur.postProfesseur)
  .get(user.verifyToken, professeur.getProfesseurs)

  app.route(prefix + '/matieres')
  .post(user.verifyToken, matiere.postMatiere)
  .get(user.verifyToken, matiere.getMatieres)

  app.route(prefix + '/matieres-pagination')
  .get(user.verifyToken, matiere.getMatieresPagination)

app.route(prefix + '/register')
  .post(user.doRegister)

app.route(prefix + '/login')
  .post(user.doLogin)

app.route(prefix + '/logout')
  .get(user.logout)

app.route(prefix + '/remove-collection')
  .delete(user.verifyToken, _.removeCollection);

app.route(prefix + '/dashboard')
  .get(user.verifyToken, dashboard.getDashboard);

app.route(prefix + '/dashboard-assignments')
.get(user.verifyToken, dashboard.getAssignmentDashboard);

app.route(prefix + '/success-rate-by-students')
  .get(dashboard.getSuccessRateByMatter);
  
app.route(prefix + '/dashboard-sucess-by-prof')
  .get(dashboard.getSuccessRateByProf);

app.route(prefix + '/cours')
  .get(user.verifyToken, cours.getCours)
  .post(user.verifyToken, cours.postCours);

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré  sur http://localhost:' + port);

module.exports = app;


