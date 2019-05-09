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

const { projectModel } = require('./Model/project');
const { supervisorModel } = require('./Model/supervisor');
const { coordinatorModel } = require('./Model/coordinator');
const { proposalModel } = require('./Model/proposal');

app.get('/api/project', (req, res)=>{
    if (Object.keys(req.query).length === 0){
        projectModel.find({Visibility: 1}, "-_id -Visibility", {sort: {ProjectName: 1}}, (err, data)=>{
            if (!err){
                console.log("find all");
                res.status(200).send(data);
            }else{
                res.status(400).send(err);
            }
        })
    }else{
        projectModel.find({Visibility: 1, ProjectName: req.query.name}, (err, data)=>{
            if  (!err){
                console.log("find one");
                res.status(200).send(data);
            }else{
               res.status(400).send(err);
            }
        })
    }
});

app.get('/api/project_supervisor', (req, res)=>{
   supervisorModel.findOne({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName}, (err1, data1)=>{
       if (!err1){
           if (data1 == null){
               console.log("supervisor does not exist");
               res.status(200).send("supervisor does not exist");
           }else{
               projectModel.find({Visibility: 1, SupervisorID: data1._id}, (err2, data2)=>{
                   if (!err2){
                       console.log("find one project from supervisor");
                       res.status(200).send(data2)
                   }else{
                       res.status(400).send(err2);
                   }
               })
           }
       }else{
           res.status(400).send(err1);
       }
   })
});

app.get('/api/project_coordinator', (req, res)=>{
    coordinatorModel.findOne({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName}, (err1, data1)=>{
        if (!err1){
            if (data1 == null){
                console.log("coordinator does not exist");
                res.status(200).send("coordinator does not exist");
            }else{
                projectModel.find({Visibility: 1, CoordinatorID: data1._id}, (err2, data2)=>{
                    if (!err2){
                        console.log("find one project from coordinator");
                        res.status(200).send(data2)
                    }else{
                        res.status(400).send(err2);
                    }
                })
            }
        }else{
            res.status(400).send(err1);
        }
    })
});

app.get('/api/project_proposal', (req, res)=>{
    proposalModel.findOne({Visibility: 1, ProjectOutline: req.query.outline}, (err1, data1)=>{
        if (!err1){
            if (data1 == null){
                console.log("proposal does not exist");
                res.status(200).send("proposal does not exist");
            }else{
                projectModel.find({Visibility: 1, ProposalID: data1._id}, (err2, data2)=>{
                    if (!err2){
                        console.log("find one project from proposal");
                        res.status(200).send(data2)
                    }else{
                        res.status(400).send(err2);
                    }
                })
            }
        }else{
            res.status(400).send(err1);
        }
    })
});

app.post('/api/project:post', (req, res)=>{
   supervisorModel.findOne({Visibility: 1, FirstName: req.query.superFirstName, LastName: req.query.superLastName}, (err1, data1)=>{
       if (!err1){
           if (data1.length === 0){
               console.log("supervisor does not exist");
               res.status(200).send("supervisor does not exist");
           }else{
               coordinatorModel.findOne({Visibility: 1, FirstName: req.query.coorFirstName, LastName: req.query.coorLastName}, (err2, data2)=>{
                   if (!err2){
                       if (data2 === null){
                           console.log("coordinator does not exist");
                           res.status(200).send("coordinator does not exist");
                       }else{
                           proposalModel.findOne({Visibility: 1, ProjectOutline: req.query.outline}, (err3, data3)=>{
                               if (!err3){
                                   if (data3 === null){
                                       console.log("proposal does not exist");
                                       res.status(200).send("proposal does not exist");
                                   }else{
                                       const project = new projectModel({
                                           ProjectName: req.query.name,
                                           SubjectID: req.query.subjectID,
                                           Industry: req.query.industry,
                                           SupervisorID: data1._id,
                                           CoordinatorID: data2._id,
                                           ProposalID: data3._id
                                       });
                                       project.save((err4, data4)=>{
                                           if (!err4){
                                               console.log("add one new project");
                                               res.status(200).send(data4);
                                           }else{
                                               res.status(400).send(err4);
                                           }
                                       })
                                   }
                               }else{
                                   res.status(400).send(err3);
                               }
                           })
                       }
                   }else{
                       res.status(400).send(err2);
                   }
               })
           }
       }else{
           res.status(400).send(err1);
       }
   })
});

app.put('/api/project:put', (req, res)=>{
   projectModel.findOneAndUpdate({Visibility: 1, ProjectName: req.query.name},
       {$set: {ActivelyUsed: req.query.use}}, {upsert: false, new: true}).populate('ads').exec(function(err, data){
          if (!err){
              console.log("find one and update success");
              res.status(200).send(data);
          }else{
              res.status(400).send(err);
          }
    });
});

// update the project by supervisor, coordinator, or proposal is unnecessary.
// because all objects above to project are many-to-one
// For example, update project from supervisor is always that:
//      search supervisor name, get all projects belong to him/her,
//      update the project according to project name you just get.

app.delete('/api/project:delete', (req, res)=>{
    if (req.query.soft !== '1'){
        projectModel.findOneAndDelete({Visibility: 1, ProjectName: req.query.name}, (err, data)=>{
            if (!err){
                console.log("find one and delete");
                res.status(200).send(data);
            }else{
                res.status(400).send(err);
            }
        })
    }else{
        projectModel.findOneAndUpdate({Visibility: 1, ProjectName: req.query.name},
            {$set: {Visibility: 0}}, {upsert: false, new: true}).populate('ads').exec(function(err, data){
                if (!err){
                    console.log("soft delete project");
                    res.status(200).send(data);
                }else{
                    res.status(400).send(err);
                }
        })
    }
});