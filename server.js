
var express = require('express');
var bodyparser = require('body-parser');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options = { useNewUrlParser: true, useUnifiedTopology: true }
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get('/addbook', function (req, res) {
  res.render('pages/addbook');
});

app.get('/book', function (req, res) {
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("book");
    var query = {};
    dbo.collection("bookdb")
      .find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('pages/book', { book: result });
        db.close();
      });
  });

});

app.post('/addbookadd', function (req, res) {
  var idadd = req.body.id;
  var nameadd= req.body.name;
  var priceadd = req.body.price;
  var yearadd = req.body.year;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("book");
    var myobj = {  book_id: idadd,
      book_name: nameadd,
      price: priceadd,
      year:yearadd
     };
    dbo.collection("bookdb").insertOne(myobj, function(err, result) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
      res.redirect("/book");
    });
  });

});

app.get('/bookdetails/:name', function (req, res) {
  var namebook = req.params.name;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("book");
    var query = { book_name: namebook };
    dbo.collection("bookdb").findOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('pages/bookdetails', { detail: result });
      db.close();
    });
  });
});

app.get('/edit/:name', function (req, res) {
  var namebookedit = req.params.name;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("book");
    var query = { book_name: namebookedit };
    dbo.collection("bookdb").findOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('pages/edit', { detail: result });
      db.close();
    });
  });
});

app.post('/booksave', function (req, res) {
  var idsave = req.body.id;
  var namesave= req.body.name;
  var pricessave = req.body.price;
  var yearsave = req.body.year;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("book");
    var myquery = { book_id: idsave };
    var newvalues = {
      $set: {
        book_id: idsave,
        book_name: namesave,
        price: pricessave,
        year:yearsave
      }
    };
    dbo.collection("bookdb").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      res.redirect("/book");
    });
  });
});

app.get('/delete/:name', function (req, res) {
  var namedelete = req.params.name;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("book");
    var myquery = {book_name:namedelete};
    dbo.collection("bookdb").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
      res.redirect("/book");
    });
  });
});

app.listen(8080);
console.log('8080 is the magic port http://localhost:8080/');