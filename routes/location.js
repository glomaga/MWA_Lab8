var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient

var sess;
var listlocations;
var db;

MongoClient.connect('mongodb://localhost:27017/homework8', (err, database) => {
  if (err) return console.log(err)
  db = database;
  console.log("DB connect");
});

/* GET home page. */
router.get('/', function (req, res, next) {
  db.collection('homework8').find().toArray(function (err, results) {
    if (err) return console.log(err)
    sess = req.session;
    var location;
    if (sess.updateLocation !== undefined) {
      location = {
        Id: sess.updateLocation.Id,
        Name: sess.updateLocation.Name,
        Category: sess.updateLocation.Category,
        location: {
          type:"Point",
          coordinates: [sess.updateLocation.location.coordinates[0],sess.updateLocation.location.coordinates[1]]
        } 
      }

      sess.updateLocation = undefined;
    } else {
      var location = {
        Id: undefined,
        Name: undefined,
        Category: undefined,
        location: {
          type:"Point",
          coordinates: [0,0]
        } 
      }
    }
    res.render('location', { title: 'LOCATION', errors: undefined, locations: results, location: location });
  });
});


router.post('/location', function (req, res, next) {

  req.assert('name', "a valid name is required").notEmpty();
  req.assert('longitude', "a valid longitude is required, numeric").notEmpty().isDecimal();
  req.assert('latitude', "a valid latitude is required, numeric").notEmpty().isDecimal();

  var errors = req.validationErrors();
  //console.log("ERRROR" + errors);
  if (errors) {
    db.collection('homework8').find().toArray(function (err, results) {
      if (err) return console.log(err)

      var location = {
        Id: undefined,
        Name: undefined,
        Category: undefined,
        location: {
          type:"Point",
          coordinates: [0,0]
        } 
      }
      res.render('location', { title: 'LOCATION', errors: errors, locations: results, location: location });
    });
  }
  else {
    // NEW INFORMATION
    //console.log(req.body.id.length);
    if (req.body.id.length === 0) {
      console.log("save new values");

      var location = {
        Name: req.body.name,
        Category: req.body.category,
        location: {
          type:"Point",
          coordinates: [ parseFloat(req.body.longitude),parseFloat(req.body.latitude)]
        } 
      }


    //  console.log(location);
      db.collection('homework8').save(location, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
      });
    }
    // UPDATE INFORMATION
    else {
      console.log("update values");
      id = req.body.id;
      var query = { "_id": new mongodb.ObjectID(id) };

      var location = {
        Name: req.body.name,
        Category: req.body.category,
        location: {
          type:"Point",
          coordinates: [parseFloat(req.body.longitude),parseFloat(req.body.latitude)]
        } 
      }

      db.collection('homework8').updateOne(query, { $set: location }, (err, result) => {
        if (err) return console.log(err)
        console.log('update to database')
        res.redirect('/')
      });

    }
  }
}
);

router.delete = function (req, res) {
  var id = req.params.id;
  //console.log("id to delete " + id);
  var query = { _id: new mongodb.ObjectID(id) };
  db.collection("homework8").remove(query, (err, result) => {
    if (err) return console.log(err)
    console.log('delete to database')
    res.redirect('/');
  });
};

router.update = function (req, res) {
  var id = req.params.id;
  var query = { _id: new mongodb.ObjectID(id) };
  db.collection('homework8').findOne(query, function (err, values) {
    if (err) return console.log(err)

    var location = {
      Id: values._id,
      Name: values.Name,
      Category: values.Category,
      location: {
        type:"Point",
        coordinates: [values.location.coordinates[0],values.location.coordinates[1]]
      } 
    } 
    //console.log("edit:" + location.Id);
    sess = req.session;
    sess.updateLocation = location;
    res.redirect('/');
    //res.render('location', { title: 'LOCATION', errors: undefined, locations: list, location: results });

  });
};

module.exports = router;
