var mongoose = require('mongoose');

// Création du schéma pour les commentaires
var commentaireArticleSchema = new mongoose.Schema({
  pseudo : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  contenu : String,
  date : { type : Date, default : Date.now }
});

// Création du Model pour les commentaires
var CommentaireArticleModel = mongoose.model('commentaires', commentaireArticleSchema);

module.exports = exports = CommentaireArticleModel;