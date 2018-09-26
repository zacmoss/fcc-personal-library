/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
/*
const mongoose = require('mongoose');
Promise = require('bluebird');
mongoose.Promise = Promise;
*/

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    // works
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      //console.log(title);
      let book = {
        title: title,
        comments: []
      }
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project3");
        //if (!dbo.collection('books')) dbo.createCollection('books');
        let collection = dbo.collection('books');
        try {
          collection.insertOne(book, function(err, doc) {
              collection.findOne({title: book.title}, function(err, doc) {
                res.send(doc);
              });
          });
        } catch (e) {
          console.log('error with insertion: ' + e);
        }
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project2");
        let collection = dbo.collection('books');

        try {
          collection.remove();
          res.send('complete delete successful');
        } catch (e) {
          console.log(e);
          res.send('Book not deleted.');
        }
        
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project2");
        let collection = dbo.collection('books');
        try {
          collection.findOneAndUpdate({_id: ObjectId(bookid)}, {$addToSet: comment}, function(err, doc) {
              
              collection.find({_id: ObjectId(bookid)}, function(err, doc) {
                console.log('works');
                res.send(doc);
              });
          });
          
        } catch (e) {
          res.send(e);
        }
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project2");
        let collection = dbo.collection('books');

        if (bookid) {
          try {
            collection.deleteOne({_id: ObjectId(bookid)});
            res.send('delete successful');
          } catch (e) {
            console.log(e);
            res.send('book not deleted.');
          }
        } else {
          res.send('must input id');
        }
      });
    });
  
};
