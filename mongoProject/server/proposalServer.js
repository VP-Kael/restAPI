const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost:27017/project", err=>{
    if (!err){
        console.log("connect success");
    }else{
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
const { proposalModel } = require('./Model/proposal');

app.get('/api/proposal', (req, res)=>{
   if (Object.keys(req.query).length === 0){
       proposalModel.find({Visibility: 1}, "-_id -Visibility", {sort: {ProjectOutline: 1}}, (err, data)=>{
           if (!err){
               console.log("find all");
               res.status(200).send(data);
           }else{
               res.status(400).send(data);
           }
       })
   }else{
       proposalModel.find({Visibility: 1, ProjectOutline: req.query.outline}, (err, data)=>{
           if (!err){
               console.log("find success");
               res.status(200).send(data);
           }else{
               res.status(400).send(err)
           }
       })
   }
});

app.get('/api/proposal_client', (req, res)=>{
    if (Object.keys(req.query).length === 0){
        proposalModel.find({Visibility: 1}, "-_id -Visibility", {sort: {ProjectOutline: 1}}, (err, data)=>{
            if (!err){
                console.log("find all");
                res.status(200).send(data);
            }else{
                res.status(400).send(data);
            }
        })
    }else{
        proposalModel.find({Visibility: 1, ClientID: req.query.clientID}, (err, data)=>{
            //the client ID is supplied directly because it comes from different micro service
            if (!err){
                console.log("find success");
                res.status(200).send(data);
            }else{
                res.status(400).send(err)
            }
        })
    }
});

app.post('/api/proposal:post', (req, res)=>{
   const proposal = new proposalModel({
       ProjectOutline: req.query.outline,
       ProjectBenefit: req.query.benefit,
       ProductUse: req.query.use,
       Beneficiaries: req.query.beneficiaries,
       ClientID: req.query.clientiD,
   });
   proposal.save((err, data)=>{
       if (!err){
           console.log("add one more record");
           res.status(200).send(data);
       }else{
           res.status(400).send(err);
       }
   })
});

app.put('/api/proposal:put', (req, res)=>{
    proposalModel.findOneAndUpdate({Visibility: 1, ProjectOutline: req.query.outline},
        {$set: {ProductUse: req.query.use}},
        {upsert: false, new:true}).populate('ads').exec(function(err, data){
          if (!err){
              console.log("update one success");
              res.status(200).send(data);
          }else{
              res.status(400).send(err);
          }
    })
});

app.delete('/api/proposal:delete', (req, res)=>{
   if (req.query.soft !== '1'){
       proposalModel.findOneAndDelete({Visibility: 1, ProjectOutline: req.query.outline}, (err, data)=>{
           if (!err){
               console.log("find one and delete success");
               res.status(200).send(data);
           }else{
               console.log(err);
               res.status(400).send(err);
           }
       })
   }else{
       proposalModel.findOneAndUpdate({Visibility: 1, ProjectOutline: req.query.outline},
           {$set: {Visibility: 0}}, {upsert: false, new: true}).populate('ads').exec(function(err, data){
               if (!err){
                   console.log("soft delete");
                   res.status(200).send(data);
               }else{
                   res.status(400).send(err);
               }
       })
   }
});