const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost:27017/profile", err=>{
    if (!err){
        console.log("connect.success");
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
const { clientNoteModel } = require('./Model/clientNote');

app.get('/api/note', (req, res)=>{
    if (Object.keys(req.query).length === 0){
        console.log("must have a client");
    }else{
        let order;
        if ( req.query.order === '1' || req.query.order === "-1"){
            order = req.query.order * 1;
        }else{
            order = 1;
        }
        clientModel.find({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName}, (err1, data1)=>{
            if (!err1){
                if (data1.length == 0 ){
                    res.status(200).send("unexpect client");
                }else {
                    let clientID = data1[0]._id;
                    clientNoteModel.find({Visibility: 1, ClientID: clientID}, (err2, data2) => {
                        if (!err2) {
                            res.send(data2);
                        } else {
                            res.status(400).send(err2);
                        }
                    }).sort({_id: order})
                }
            }else{
                res.status(400).send(err1);
            }
        })
    }
});

app.post('/api/note:post', (req, res)=>{
   clientModel.find({Visibility: 1, FirstName: req.query.firstName, LastName: req.query.lastName}, (err1, data1)=>{
       if (!err1){
           if (data1.length == 0){
               res.status(200).send("unexpect client");
           }else{
               let clientID = data1[0]._id;
               const note = new clientNoteModel({
                  NoteText: req.query.note,
                  ClientID: clientID
               });
               note.save((err2, response)=>{
                  if (!err2){
                      res.status(200).send(response);
                  } else{
                      res.status(400).send(err2);
                  }
               });
           }
       }else{
           res.status(400).send(err1);
       }
   })
});

//note need not put

app.delete('/api/note:delete', (req, res)=>{
    if (req.query.soft !== '1'){
        clientNoteModel.findOneAndDelete({Visibility: 1, NoteText: req.query.note}, {sort: {_id: 1}}, (err, data)=>{
            if (!err){
                res.status(200).send(data);
            }else{
                res.status(400).send(err);
            }
        })
    }else{
        clientNoteModel.findOneAndUpdate({Visibility: 1, NoteText: req.query.note},
            {$set: {Visibility: 0}, sort: {_id: 1}},
            {upsert: false, new: true}).populate('ads').exec(function(err, data){
            if (!err){
                console.log("soft delete");
                res.status(200).send(data);
            }else{
                res.status(400).send(err);
            }
        })
    }
});