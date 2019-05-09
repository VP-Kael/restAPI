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

const { supervisorModel } = require('./Model/supervisor');

app.get('/api/supervisor', (req, res)=>{
   if (Object.keys(req.query).length === 0){
       supervisorModel.find({Visibility: 1}, "-_id, -Visibility", {sort: {FirstName: 1, LastName: 1}}, (err, data)=>{
           if (!err){
               console.log("find all");
               res.status(200).send(data);
           }else{
               res.status(400).send(err);
           }
       })
   }else{
       supervisorModel.find({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName}, "-_id, -Visibility", (err, data)=>{
           if (!err){
               res.status(200).send(data);
           }else{
               res.status(400).send(err);
           }
       })
   }
});

app.post('/api/supervisor:post', (req, res)=>{
   const supervisor = new supervisorModel({
       FirstName: req.query.firstName,
       LastName: req.query.lastName,
       Email: req.query.email,
       OfficeLocation: req.query.office,
   });
   supervisor.save((err, data)=>{
      if (!err){
          res.status(200).send(data);
      } else{
          res.status(400).send(err);
      }
   });
});

app.put('/api/supervisor:put', (req, res)=>{
   supervisorModel.findOneAndUpdate({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName},
       {$set: {ContactNumber: req.query.number}},
       {upsert: false, new: true}).populate('ads').exec(function(err, data){
           if (!err){
               res.status(200).send(data);
           }else{
               res.status(400).send(err);
           }
   });
});

app.delete('/api/supervisor:delete', (req, res)=>{
    if (req.query.soft !== '1'){
        supervisorModel.findOneAndDelete({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName}, (err, data)=>{
            if (!err){
                console.log("hard delete");
                res.status(200).send(data);
            }else{
                res.status(400).send(err);
            }
        })
    }else{
        supervisorModel.findOneAndUpdate({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName},
            {$set: {Visibility: 0}}, {upsert: false, new: true}).populate('ads').exec(function(err, data){
                if (!err){
                    console.log("soft delete");
                    res.status(200).send(data);
                }else{
                    res.status(400).send(data);
                }
        })
    }
});



