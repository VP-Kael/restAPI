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

const { productModel } = require('./Model/product');
const { teamModel } = require('./Model/team');
const { projectModel } = require('./Model/project');

app.get('/api/product', (req, res)=>{
    if (Object.keys(req.query).length === 0){
        productModel.find({Visibility: 1}, "-_id -Visibility", {sort: {ProductName: 1}}, (err, data)=>{
            if (!err){
                console.log("find all");
                res.status(200).send(data);
            }else{
                res.status(400).send(err);
            }
        })
    }else{
        productModel.find({Visibility: 1, ProductName: req.query.productName}, (err, data)=>{
            if (!err){
                if (data.length === 0){
                    console.log("product does not exist");
                    res.status(200).send("product does not exist");
                }else{
                    res.status(200).send(data);
                }
            }else{
                res.status(400).send(data);
            }
        })
    }
})

app.get('/api/product_team', (req, res)=>{
   teamModel.find({Visibility: 1, TeamName: req.query.teamName}, (err1, data1)=>{
       if (!err1){
            if (data1.length === 0){
                console.log("team does not exist");
                res.status(400).send("team does not exist");
            }else{
                productModel.find({Visibility: 1, StudentTeamID: data1[0]._id}, (err2, data2)=>{
                    if (!err2){
                        res.status(200).send(data2);
                    }else{
                        res.status(400).send(err2);
                    }
                })
            }
       }else{
           res.status(400).send(data1);
       }
   })
});

app.get('/api/product_project', (req, res)=>{
    projectModel.find({Visibility: 1, ProjectName: req.query.projectName}, (err1, data1)=>{
        if (!err1){
            if (data1.length === 0){
                console.log("project does not exist");
                res.status(400).send("project does not exist");
            }else{
                productModel.find({Visibility: 1, ProjectID: data1[0]._id}, (err2, data2)=>{
                    if (!err2){
                        res.status(200).send(data2);
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

app.post('/api/product:post', (req,res)=>{
    projectModel.find({Visibility: 1, ProjectName: req.query.projectName}, (err1, data1)=>{
        if (!err1){
            if (data1.length === 0){
                console.log("project does not exist");
                res.status(400).send("project does not exist");
            }else{
                teamModel.find({Visibility: 1, TeamName: req.query.teamName}, (err2, data2)=>{
                    if (!err2){
                        if (data2.length === 0){
                            console.log("team does not exist");
                            res.status(400).send("team does not exist");
                        }else {
                            const product = new productModel({
                                ProductName: req.query.productName,
                                Product: " ", //need more attribute of the product
                                StudentTeamID: data2[0]._id,
                                ProjectID: data1[0]._id
                            });
                            product.save((err3, data3)=>{
                                if (!err3){
                                    console.log("add one new product");
                                    res.status(200).send(data3);
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

//there should not be put function, the product should be overwritten by every upload

app.delete('/api/product:delete', (req, res)=>{
    productModel.findOneAndDelete({Visibility: 1, ProductName: req.query.productName}, (err, data)=>{
        if (!err){
            res.status(200).send(data);
        }else{
            res.status(400).send(err);
        }
    })
});
//product might not need the soft delete