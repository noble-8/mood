var express = require('express');
var app = express();
const querystring = require('querystring');
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://172.31.81.115:27017/";

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {

	res.send(`
the API is hosted on AWS.

the UI dashboard which is run on using metabase - https://www.metabase.com/ 
the UI is hosted here http://mood-361323134.us-east-1.elb.amazonaws.com:3000/

username is akash7nair@gmail.com password is akashiscool1
I can add new users using their email id

the visualisation for the data is here : http://mood-361323134.us-east-1.elb.amazonaws.com:3000/question#eyJkYXRhc2V0X3F1ZXJ5Ijp7ImRhdGFiYXNlIjo0LCJxdWVyeSI6eyJzb3VyY2UtdGFibGUiOjZ9LCJ0eXBlIjoicXVlcnkifSwiZGlzcGxheSI6InRhYmxlIiwidmlzdWFsaXphdGlvbl9zZXR0aW5ncyI6e319

here is an example of the address of all afghan kebobs http://mood-361323134.us-east-1.elb.amazonaws.com:3000/question#eyJkYXRhc2V0X3F1ZXJ5Ijp7ImRhdGFiYXNlIjo0LCJxdWVyeSI6eyJzb3VyY2UtdGFibGUiOjYsImFnZ3JlZ2F0aW9uIjpbWyJjb3VudCJdXSwiZmlsdGVyIjpbImFuZCIsWyI9IixbImZpZWxkIiw0NixudWxsXSwiQWZnaGFuIl1dLCJicmVha291dCI6W1siZmllbGQiLDUxLG51bGxdXX0sInR5cGUiOiJxdWVyeSJ9LCJkaXNwbGF5IjoidGFibGUiLCJ2aXN1YWxpemF0aW9uX3NldHRpbmdzIjp7fX0=


the postman collection is here
https://www.getpostman.com/collections/f6e5fec240af74f6ed54


walk through for the API
to have an optimised well sorted query you can specify the condition with 
{
  "query": {
    "$or": [
      {
        "grades.grade": "P"
      },
      {
        "name": "Bully'S Deli"
      }
    ]
  },
  "fields":{"address":1,"cuisine":1},
  "limit":100,
  "skip":1,
  "sort":{"cuisine": -1}
}

to specify the condition to display the result you can specify the query as shown :

$or": [
      {
        "grades.grade": "P"
      },
      {
        "name": "Bully'S Deli"
      }
]
example this query returns 

if you want to get all the restaurants which serve afghan cuisine and have a score > 5
$and": [
      {
        "cuisine": "Afghan"
      },
      {
        "grades.score": {"$gt":5}
      }
]


the whole query would be 
{
  "query": {
"$and": [
      {
        "cuisine": "Afghan"
      },
      {
        "grades.score": {"$gt":5}
      }
]

  },
  "fields":{"cuisine":1,"grades.score":1},
  "limit":100,
  "skip":0,
  "sort":{"cuisine": -1}
}


get the all the values which has P grade
{
  "query": {"grades.grade": "P"},  
  "limit":100,
  "skip":1
}



data paging to ensure optimised queries i have included skip and limit to limit the number of queries displayed. for example if you have 9 records and need to distribute it evenly over 3 pages you can make 3 requests with limit :3 skip:0 , limit :3 skip:3,limit :3 skip:6  

to selct the number of fields to add to the output you can add the field name to the field column along with the integer 1 if you want to display it or 0 if you want to hide it

		`);
});

app.post('/query', function (req, res) {
	
	var limit = req.body.limit==undefined?10:Number(req.body.limit);
	var skip = req.body.skip==undefined?0:Number(req.body.skip);
	var query = req.body.query 
	var fields = req.body.fields
	var sort = req.body.sort
	console.log(query)
	MongoClient.connect(url, function(err, db) {
	  if (err) {
		console.log(err);
		res.send("please try again in sometime")
		return;
	  }
	var dbo = db.db("mood");
	
	dbo.collection("restaurants").find(query).project(fields).limit(limit).skip(skip).sort(sort).toArray(function(err, result) {
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
	if(req.query.name!=undefined && req.query.name.length!=0){
		query["name"] = req.query.name.toString() 
	}
	if(req.query.cuisine!=undefined && req.query.cuisine.length!=0){
		query["cuisine"] = req.query.cuisine.toString() 
	}
	if(req.query.restaurant_id!=undefined && req.query.restaurant_id.length!=0){
		query["restaurant_id"] = req.query.restaurant_id.toString() 
	}
	if(req.query.building!=undefined && req.query.building.length!=0){
	query["address.building"] = req.query.building.toString()
	}
	if(req.query.street!=undefined && req.query.street.length!=0){
	query["address.street"] = req.query.street.toString()
	}
	if(req.query.grade!=undefined && req.query.grade.length!=0){
	query["grades.grade"] = req.query.grade.toString()
	}
	if(req.query.score!=undefined && req.query.score.length!=0){
	query["grades.score"] = Number(req.query.score)
	}
		console.log(query)
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
	if(req.query.name!=undefined && req.query.name.length!=0){
		query["name"] = new RegExp(req.query.name)
	}
	if(req.query.cuisine!=undefined &&req.query.cuisine.length!=0){
		query["cuisine"] = new RegExp(req.query.cuisine)
	}
	if(req.query.restaurant_id!=undefined && req.query.restaurant_id.length!=0){
		console.log(req.query.restaurant_id)
		query["restaurant_id"] = new RegExp(req.query.restaurant_id)
	}
	if(req.query.building!=undefined && req.query.building.length!=0){
		query["address.building"] = new RegExp(req.query.building)
	}
	if(req.query.street!=undefined && req.query.street.lrngth!=0){
		query["address.street"] = new RegExp(req.query.street)
	}
	if(req.query.grade!=undefined && req.query.grade.length!=0){
		query["grades.grade"] = new RegExp(req.query.grade)
	}
	if(req.query.score!=undefined && req.query.score.length!=0){
		query["grades.score"] = Number(req.query.score)
	}
		console.log(query)
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

