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


module.exports = function (app) {

  app.route('/api/books')
  
    //works
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project3");
        let collection = dbo.collection('books');
        collection.find().toArray(function(err, result) {
            res.json(result);
          });
      });
    
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
        if (book.title === '') {
          res.send('Please enter book title');
        } else {
          try {
            collection.insertOne(book, function(err, doc) {
                collection.findOne({title: book.title}, function(err, doc) {
                  res.send(doc);
                });
            });
          } catch (e) {
            console.log('error with insertion: ' + e);
          }
        }
      });
    })
    
    // works
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project3");
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


///api/books/5babc6a6c442351f923b3a8c - test book 8
  app.route('/api/books/:id')
    // works
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project3");
        let collection = dbo.collection('books');
        //console.log(bookid);
        collection.findOne({_id: ObjectId(bookid)}, function(err, doc) {
          //console.log(doc);
          if (!doc) {
            res.send("book doesn't exist");
          } else {
            res.send(doc);
          }
          
        });
        /*
        try {
          collection.findOne({_id: ObjectId(bookid)}, function(err, doc) {
            //if (err) console.log(err);
            // could try catch here
            try {
              res.send(doc);
            } catch (e) {
              console.log('error');
            }
          });
        } catch (e) {
          //console.log('no book exists');
          res.send('no book exists');
        }
        */
        
      });
    })
    
    //works
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project3");
        let collection = dbo.collection('books');
        
        try {
          
          collection.findOneAndUpdate(
            { _id: ObjectId(bookid) },
            { $addToSet: { comments: comment } },
            function(err, doc) {
              collection.findOne({_id: ObjectId(bookid)}, function(err, doc) {
                res.send(doc);
              });
          });
          
        } catch (e) {
          console.log(e);
        }
      });
    })
    
    // works
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("fcc-cert6-project3");
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
