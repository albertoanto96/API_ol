var express = require('express')
var bodyParser = require( 'body-parser' );
var app = express();
var username = "";
app.use( bodyParser.urlencoded({ extended: true }) );
var mongoose = require('mongoose');
var multer = require('multer');
var Hash = require('jshashes');
var cors = require('cors');
var session = require('express-session')
module.exports=app;
var path = require('path');

var Schema = mongoose.Schema;


mongoose.connect("mongodb://localhost:27017/olimpiades", function (err) {
    if (!err) {
        console.log("We are connected")
    }
});
var User =require('../models/users');
var Event = require('../models/events')
var New =require('../models/news');
var Team = require('../models/teams')

var u;
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin",  "*");
res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS");
res.header('Access-Control-Allow-Headers', "Content-Type, Authorization, Content-Length, X-Requested-With,X-Custom-Header,Origin");
res.header('Access-Control-Allow-Credentials',"true")
next();
});

app.post('/logout',function (req,res) {
    username="";
    res.send("200")
});

app.post('/push', function (req, res) {
    var pass = req.body.password;
    var passhash = new Hash.SHA256(pass).hex(pass);
    u = new User({name: req.body.name, password: passhash, image: false, active: true});
    u.save().then(function () {
        User.find({name: req.body.name}).then(function (response) {
            res.send(response);
        });
    });
});

app.post('/loginw', function (req, res) {
    var pass = req.body.password;
    var passhash = new Hash.SHA256(pass).hex(pass);
    User.find({name: req.body.name, password: passhash}).then(function (response) {
        username = req.body.name;
        if (response.length===0) {
            response = "no login";
        }
        res.send(response);

    });
});


app.delete('/deleteadv', function (req, res) {

    Event.remove({_id: req.body.advid}, function (err, upd) {
        res.send(upd)
    })


});
app.put('/updateTeam',function (req,res) {


    var pointsNew;
    var pointsOld;
    var points;
    Team.findOne({name:req.body.team},function (err,ans) {
        pointsOld = Number(ans.points);
        pointsNew = Number(req.body.points);
        points = pointsOld + pointsNew;

        Team.findOneAndUpdate({name: req.body.team}, {points: points}, function (err) {

            res.send(err)
        })
    })
});

app.put('/winneradv',function (req,res) {

    var pointsOld;
    var pointsNew;
    var points;
    Event.findOneAndUpdate({title:req.body.title},{winner:req.body.winner},function (err) {
        Team.findOne({name:req.body.winner},function (err,ans) {
            pointsOld=Number(ans.points);
            pointsNew=Number(req.body.points);
            points= pointsOld+pointsNew;

            Team.findOneAndUpdate({name:req.body.winner},{points:points},function (err) {

            })
        });
        Team.findOne({name:req.body.loser},function (err,ans) {
            pointsOld=Number(ans.points);
            pointsNew=Number(req.body.points2);
            points= pointsOld+pointsNew;

            Team.findOneAndUpdate({name:req.body.loser},{points:points},function (err) {

                res.send(err)
            })
        })
    })


});



app.get('/allAdvs', function (req, res) { //todos los anuncios
    var advs = [];
    var id, title, sport, category, team1,team2,date,time,link,round,points,points2,winner,location;

    Event.find(function (err, adv) {
        for (var i = 0; i < adv.length; i++) {
            id = adv[i]._id;
            title = adv[i].title;
            sport=adv[i].sport;
            category=adv[i].category;
            team1=adv[i].team1;
            team2=adv[i].team2;
            date=adv[i].date;
            time=adv[i].time;
            link=adv[i].link;
            round=adv[i].round;
            points=adv[i].points;
            points2=adv[i].points2;
            winner=adv[i].winner;
            location=adv[i].location;

            advs.push({
                id:id,
                title:title,
                sport:sport,
                category:category,
                team1:team1,
                team2:team2,
                date:date,
                time:time,
                link:link,
                round:round,
                points:points,
                points2:points2,
                winner:winner,
                location:location


            })
        }
        res.send(advs)

    });
});

app.get('/getTeams', function (req, res) {
    var listTeam = [];
    Team.find(function (err, us) {
        for (var i = 0; i < us.length; i++) {
            listTeam.push({name: us[i].name, category: us[i].category,color: us[i].color,points: us[i].points,telephone: us[i].telephone, captain:us[i].captain});
        }
        res.send(listTeam);
    });
});
app.get('/search/:word', function (req, res) {

    var id, title, sport, category, team1,team2,date,time,link,round,points,points2,winner,location;
    var advList = [];
    var word = req.params.word;
    Event.find({$text: {$search: word}}, function (err, adv) {
        //Si no va, añadir a la base de datos un inidce con
        //db.advs.createIndex({ title: "text", description: "text", exchange: "text"})
        if(adv != undefined) {

            for (var i = 0; i < adv.length; i++) {
                id = adv[i]._id;
                title = adv[i].title;
                sport=adv[i].sport;
                category=adv[i].category;
                team1=adv[i].team1;
                team2=adv[i].team2;
                date=adv[i].date;
                time=adv[i].time;
                link=adv[i].link;
                round=adv[i].round;
                points=adv[i].points;
                points2=adv[i].points2;
                winner=adv[i].winner;
                location=adv[i].location;
                advList.push({
                    id:id,
                    title:title,
                    sport:sport,
                    category:category,
                    team1:team1,
                    team2:team2,
                    date:date,
                    time:time,
                    link:link,
                    round:round,
                    points:points,
                    points2:points2,
                    winner:winner,
                    location:location


                });
            }
            res.send(advList)
        }
        else {
            res.send(advList);
        }

    });
});

app.post('/addTeam', function (req, res) {
    Team.find({name: req.body.name}).then(function (response) {

        if (response[0] != undefined) {
            res.send("500");
        }
        else {
            var a = new Team({
                name:req.body.name,
                telephone:req.body.telephone,
                color:req.body.color,
                captain:req.body.captain,
                category:req.body.category,
                points:0
            });
            a.save().then(function () {
            });
            res.send("200");
        }
    });
});

app.post('/addNew', function (req, res) {

    New.find({title: req.body.title}).then(function (response) {

        if (response[0] != undefined) {
            res.send("500");
        }
        else {
            var a = new New({
                title:req.body.title,
                body:req.body.body
            });
            a.save().then(function () {
            });
            res.send("200");
        }
    });
});


app.post('/addEvent', function (req, res) {

    Event.find({title: req.body.title}).then(function (response) {

            var a = new Event({
                title: req.body.title ,
                sport: req.body.sport,
                link: req.body.link,
                round:req.body.round,
                category:req.body.category,
                location:req.body.location,
                team1:req.body.team1,
                team2:req.body.team2,
                date:req.body.date,
                points:req.body.points,
                points2:req.body.points2,
                time:req.body.time,
                all:req.body.all
            });
            a.save().then(function () {
            });
            res.send("200");

    });
});
app.get('/events',function (req, res) {
    Event.find(function (err, event) {
        res.send(event);
    })
});
app.get('/news',function (req, res) {
    New.find(function (err, notic) {
        res.send(notic);
    })
});

app.get('/teams',function (req, res) {
    Team.find(function (err, team) {
        res.send(team);
    })
});
app.post('/teamevents',function (req, res) {
    var team=req.body.equip;
    Event.find({ $or: [ { team1: team }, { team2: team },{all:"true"} ] },function (err, event) {
        res.send(event);
    })
});
app.post('/register',function (req, res) {
    var pass = req.body.password;
    var passhash = new Hash.SHA256(pass).hex(pass);
    u = new User({mail: req.body.mail, password: passhash});
    User.find({mail: req.body.mail, password: passhash}).then(function (response) {
        if (response.length===0) {
            u.save().then(function () {
                User.find({mail: req.body.mail}).then(function (response) {
                    res.send(response);
                });
            });
        }
        else {
            res.send("error");
        }
    });

});
app.post('/login',function (req, res) {
    var pass = req.body.password;
    var passhash = new Hash.SHA256(pass).hex(pass);
    User.find({mail: req.body.mail, password: passhash}).then(function (response) {
        if (response.length===0) {
            response = "no login";
        }
        res.send(response);
    });
});


app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../public/tpls', 'error.html'));
});

app.listen(80, function () {
    console.log('App listening on port 80!!')
});

