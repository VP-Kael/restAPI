const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost:27017/profile", err=>{
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


const { clientOrganizationModel } = require('./Model/client_organization');

app.get('/api/organization', (req, res)=>{
    if (Object.keys(req.query).length === 0){
        clientOrganizationModel.find({Visibility: 1}, "-id -Visibility", {sort: {OrganizationName: 1, OrganizationSize: 1}}, (err, data)=>{
            if (!err){
                console.log("find all");
                res.status(200).send(data);
            }else{
                res.status(400).send(err);
            }
        })
    }else{
        clientOrganizationModel.find({Visibility: 1, OrganizationName: req.query.name}, "-id -Visibility", {sort: {organizationName: 1}}, (err, data)=>{
            if (!err){
                console.log("find name from query");
                res.status(200).send(data);
            }else{
                res.status(400).send(err);
            }
        })
    }
});

app.post('/api/organization:post', (req, res)=>{
    const organization = new clientOrganizationModel({
        OrganizationName: req.query.name,
        OrganizationSize: req.query.size,
        OrganizationDescription: req.query.description
    });
    organization.save((err, response)=>{
        if (!err){
            res.status(200).send(response)
        }else{
            res.status(400).send(err)
        }
    })
});

app.put('/api/organization:put', (req, res)=>{
    clientOrganizationModel.findOneAndUpdate({Visibility: 1, OrganizationName: req.query.name},
        {$set: {OrganizationSize: req.query.size * 1, }, sort: {_id: 1}},
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

app.delete('/api/organization:delete', (req, res)=>{
    if (req.query.soft !== '1'){
        clientOrganizationModel.findOneAndDelete({Visibility: 1, OrganizationName: req.query.name}, {sort: {_id: 1}}, (err, data)=>{
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
        clientOrganizationModel.findOneAndUpdate({Visibility: 1, OrganizationName: req.query.name},
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