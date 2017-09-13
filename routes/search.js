var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient

var db;

MongoClient.connect('mongodb://localhost:27017/homework8', (err, database) => {
  if (err) return console.log(err)
  db = database;
  console.log("DB connect");
});
/* GET home page. */
router.get('/', function(req, res, next) {
    var locations = {
        Id: undefined,
        Name: undefined,
        Category: undefined,
        location: {
          type:"Point",
          coordinates: [0,0]
        } 
      }
  res.render('search', { title: 'Search', errors: undefined , locations: locations});
});

router.post('/', function (req, res, next) {
    console.log("POST SEARCH" );
      req.assert('category', "a valid name is required").notEmpty();
      var errors = req.validationErrors();
      if (errors) {
        res.render('search', { title: 'Search', errors: errors });
    }
    else{
        var query = "";
        if(req.body.name===""){
            console.log("without name")
            query = 
            {   Category:req.body.category,
                location:
                  { $near :
                     {
                       $geometry: { type: "Point",  coordinates: [ parseFloat(req.body.longitude), parseFloat(req.body.latitude) ] },
                       $maxDistance: 5000
                     }
                  }
            };
        }
        else{
            console.log("with name")
            query = 
            {    Name:req.body.name,
                 Category:req.body.category,
                location:
                  { $near :
                     {
                       $geometry: { type: "Point",  coordinates: [ parseFloat(req.body.longitude), parseFloat(req.body.latitude) ] },
                       $maxDistance: 5000
                     }
                  }
            };
        }
        console.log(req.body.name);
        
        db.collection("homework8").find(query).limit(3).toArray( (err, result) => {
            console.log('searching')
            console.log(result);
            res.render('search', { title: 'Search', errors: undefined, locations:result });
            
          });
    }
});    

module.exports = router;