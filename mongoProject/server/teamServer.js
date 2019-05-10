const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost:27017/project", err=>{
    if (!err){
        console.log("connect success");
    } else{
        console.log("connect fail");
    }
});


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.listen(port, ()=>{
    console.log(`server running on ${port}`);
});


const { teamModel } = require('./Model/team');

app.get('/api/team', (req, res)=>{
    if (Object.keys(req.query).length === 0){
        teamModel.find({Visibility: 1}, "-id -Visibility", {sort: {TeamName: 1}}, (err, data)=>{
            if (!err){
                console.log("find all");
                res.status(200).send(data);
            }else{
                res.status(400).send(err);
            }
        })
    }else{
        teamModel.find({Visibility: 1, TeamName: req.query.name}, "-id -Visibility", {sort: {TeamName: 1}}, (err, data)=>{
            if (!err){
                console.log("find name from query");
                res.status(200).send(data);
            }else{
                res.status(400).send(err);
            }
        })
    }
});

app.post('/api/team:post', (req, res)=>{
    const team = new teamModel({
        TeamName: req.query.name
    });
    team.save((err, response)=>{
        if (!err){
            res.status(200).send(response)
        }else{
            res.status(400).send(err)
        }
    })
});

app.put('/api/team:put', (req, res)=>{
    teamModel.findOneAndUpdate({Visibility: 1, TeamName: req.query.name},
        {$set: {TeamName: req.query.change, }, sort: {_id: 1}},
        {upsert:false, new:true}).populate('ads').exec(function(err, item){
        //upsert: true for creating new record if there is none
        //new: true for display the updated new record
        if (!err){
            console.log("find one and update success");
            res.status(200).send(item);
        }else{
            res.status(400).send(err);
        }
    });
});

app.delete('/api/team:delete', (req, res)=>{
    if (req.query.soft !== '1'){
        teamModel.findOneAndDelete({Visibility: 1, TeamName: req.query.name}, {sort: {_id: 1}}, (err, data)=>{
            if (!err){
                console.log("find one and delete success");
                res.status(200).send(data);
            }else{
                console.log(err);
                res.status(400).send(err);
            }
        })
    }else{
        console.log(req.query);
        teamModel.findOneAndUpdate({Visibility: 1, TeamName: req.query.name},
            {$set: {Visibility: 0 }, sort: {_id: 1}},
            {upsert:false, new:true}).populate('ads').exec(function(err, item){
            if (!err){
                console.log("soft delete");
                res.status(200).send(item);
            }else{
                res.status(400).send(err);
            }
        });
    }
});