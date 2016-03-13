var express = require('express');
var router = express.Router();

/* INSTRUCTIONS
var geotest = require('./geotools');

geotest.findZipDistance('98020', '98199', function(distance) {
    if (distance != null) {
        console.log(distance);
    }
    else {
        console.log("sad");
    }
});

*/

var dbgeo = require('monk')('localhost/geonames');

function findZipDistance(zip1, zip2, callback) {
  var zipCodes = dbgeo.get('postal_codes');
  zipCodes.findOne({'zipcode':zip1}, function(err, zip_obj_1) {
    if(err) console.log(err.message);
    if (!zip_obj_1 || zip_obj_1 == null) {
      console.log("Zip code 1 [%s] could not be found", zip1);
      callback(null);
    }
    else {
      zipCodes.findOne({'zipcode':zip2}, function(err, zip_obj_2) {
        if (err) console.log(err.message);
        if (!zip_obj_2 || zip_obj_2 == null) {
          console.log("Zip code 2 [%s] could not be found", zip2);
          callback(null);
        }
        else {
          // WE HAVE TWO ZIPS
          console.log("SUCC");
          var distance = distanceLatLong(zip_obj_1.loc, zip_obj_2.loc);
          console.log("DISTANCE: %s", distance);
          console.log(distance);
          callback(distance);
        }
      });
    }
  });
}

// http://andrew.hedges.name/experiments/haversine/
function distanceLatLong (coords1, coords2) {
  console.log(coords1);
  console.log(coords2);
  var lon1 = parseFloat(coords1[1]);
  var lon2 = parseFloat(coords2[1]);
  var lat1 = parseFloat(coords1[0]);
  var lat2 = parseFloat(coords2[0]);
  var R = 3959;
  var dlon = lon2 - lon1;
  var dlat = lat2 - lat1;
  dlon = dlon.toRad();
  dlat = dlat.toRad();
  var a = Math.pow(Math.sin(dlat/2), 2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.pow(Math.sin(dlon/2),2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d.toFixed(1);
}

// http://stackoverflow.com/a/14561433/679716
Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

module.exports = router;
module.exports.findZipDistance = findZipDistance;