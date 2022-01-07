var express = require('express');
var app = express();
const querystring = require('querystring');
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://172.31.81.115:27017/";

app.get('/find', function (req, res) {

	var limit=req.query.limit==undefined?10:Number(req.query.limit);
	var skip=req.query.skip==undefined?0:Number(req.query.skip);
	MongoClient.connect(url, function(err, db) {
	  if (err) {
		console.log(err);
		res.send("please try again in sometime")
		return;
	  }
	  var dbo = db.db("mood");
	  
	var query = {}
	if(req.query.name!=undefined){
		query["name"] = req.query.name.toString() 
	}
	if(req.query.cuisine!=undefined){
		query["cuisine"] = req.query.cuisine.toString() 
	}
	if(req.query.restaurant_id!=undefined){
		query["restaurant_id"] = req.query.restaurant_id.toString() 
	}
	if(req.query.building!=undefined){
	query["address.building"] = req.query.building.toString()
	}
	if(req.query.street!=undefined){
	query["address.street"] = req.query.street.toString()
	}
	if(req.query.grade!=undefined){
	query["grades.grade"] = req.query.grade.toString()
	}
	if(req.query.score=undefined){
	query["grades.score"] = Number(req.query.score)
	}
	dbo.collection("restaurants").find(query).limit(limit).skip(skip).toArray(function(err, result) {
	    if (err){
		console.log(err);
		res.send("please try again in sometime")
		return;
	    }
	    res.send(result);
	    db.close();
	    return;
	  });
	});
})

app.get('/findRegex', function (req, res) {

	var limit=req.query.limit==undefined?10:Number(req.query.limit);
	var skip=req.query.skip==undefined?0:Number(req.query.skip);
	MongoClient.connect(url, function(err, db) {
	  if (err) {
		console.log(err);
		res.send("please try again in sometime")
		return;
	  }
	  var dbo = db.db("mood");
	  
	var query = {}
	if(req.query.name!=undefined){
		query["name"] = new RegExp("/"+req.query.name+"/")
	}
	if(req.query.cuisine!=undefined){
		query["cuisine"] = req.query.cuisine.toString() 
	}
	if(req.query.restaurant_id!=undefined){
		query["restaurant_id"] = req.query.restaurant_id.toString() 
	}
	if(req.query.building!=undefined){
		query["address.building"] = req.query.building.toString()
	}
	if(req.query.street!=undefined){
		query["address.street"] = req.query.street.toString()
	}
	if(req.query.grade!=undefined){
		query["grades.grade"] = req.query.grade.toString()
	}
	if(req.query.score=undefined){
		query["grades.score"] = Number(req.query.score)
	}
		console.log(query);
	dbo.collection("restaurants").find(query).limit(limit).skip(skip).toArray(function(err, result) {
	    if (err){
		console.log(err);
		res.send("please try again in sometime")
		return;
	    }
	    res.send(result);
	    db.close();
	    return;
	  });
	});
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})



