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


const { clientModel } = require('./Model/client');
const { clientOrganizationModel } = require('./Model/client_organization');

app.get('/api/client_organization', (req, res)=>{
    if (Object.keys(req.query).length === 0){
        clientModel.find({Visibility: 1}, "-id -Visibility", {sort: {FirstName: 1, LastName: 1}}, (err, data)=>{
            if (!err){
                console.log("find all");
                res.send(data);
            }else{
                res.send(err);
            }
        })
    }else{
        clientOrganizationModel.findOne({Visibility: 1, OrganizationName: req.query.name}, (err1, data1)=>{
            if (data1 == null){
                console.log("Organization does not exist");
            }else{
                if (!err1){
                    console.log(data1._id);
                    clientModel.findOne({Visibility: 1, ClientOrganizationID: data1._id}, (err2, data2)=>{
                        if (!err2){
                            console.log("fine one client from organization name");
                            res.send(data2);
                        }else{
                            console.log(err2);
                        }
                    })
                }else{
                    console.log(err1);
                }
            }
        })
    }
});

app.get('/api/client', (req, res)=>{
   if (Object.keys(req.query).length ===0){
       clientModel.find({Visibility: 1}, "-_id -Visibility", {sort: {FirstName: 1, LastName: 1}}, (err, data)=>{
           if (!err){
               console.log("find all");
               res.send(data);
           }else{
               res.send(err);
           }
       })
   }else{
       clientModel.findOne({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName}, (err, data)=>{
           if (!err){
               console.log("find one success");
               res.send(data);
           }else{
               res.send(err);
           }
       })
   }
});

app.post('/api/client:post', (req, res)=>{
    clientOrganizationModel.find({OrganizationName: req.query.organName}, (err1, data)=>{
        if (!err1){
            let oragnID = data[0]._id;
            const client = new clientModel({
                FirstName: req.query.firstName,
                LastName: req.query.lastName,
                Email: req.query.email,
                ContactNumber: req.query.number,
                TechnicalAbility: req.query.tech,
                SecondaryContactFirstName: req.query.first2,
                SecondaryContactLastName: req.query.last2,
                SecondaryContactEmail: req.query.email2,
                SecondaryContactNumber: req.query.number2,
                ClientOrganizationID: oragnID,
            });
            client.save((err2, response)=>{
                if (!err2){
                    console.log("add one new client");
                    res.status(200).send(response);
                }else{
                    res.status(400).send(err2);
                }
            })
        }else{
            res.send(err1);
        }
    });
});

app.put('/api/client:put', (req, res)=>{
    clientModel.findOneAndUpdate({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName},
        {$set: {ContactNumber: req.query.newNumber, }, sort: {_id: 1}},
        {upsert:false, new:true}).populate('ads').exec(function(err, item){
        //upsert: true for creating new record if there is none
        //new: true for display the updated new record
        if (!err){
            console.log("find one and update success");
            res.send(item);
        }else{
            res.send(err);
        }
    });
});

app.put('/api/client/:put_organization', (req, res)=>{
   clientOrganizationModel.find({OrganizationName: req.query.newOrgan}, (err1, data1)=>{
       if (!err1){
           let organID = data1[0]._id;
           clientModel.findOneAndUpdate({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName},
               {$set: {ClientOrganizationID: organID}},
               {upsert: false, new: true}).populate('ads').exec(function(err2, data2){
                   if (!err2){
                       console.log("update one organization success");
                       console.log("Hail Hydra");
                       res.send(data2);
                   }else{
                       res.status(400).send(err2);
                   }
           })
       }else{
           res.status(400).send(err1);
       }
   })
});

app.delete('/api/client:delete', (req, res)=>{
    if (req.query.soft !== '1'){
        console.log("client should be hard deleted");
        res.send("client should be hard deleted");
    }else{
       clientModel.findOneAndUpdate({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName},
           {$set: {Visibility: 0}},
           {upsert: false, new: true}).populate('ads').exec(function(err, data){
               if (!err){
                   res.send(data);
               }else{
                   res.status(400).send(err);
               }
       })
    }
});