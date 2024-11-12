
const express = require('express')
const router = express.Router()
let mockCoworkings = require('../mock-coworkings')
const { Coworking } = require('../db/sequelizeSetup')


router
    .route('')

    .get((req, res) => {
        Coworking.findAll()
        .then((result)=>{
            res.json(result)
        })
        .catch((error)=>{
            res.json(error)
        })
    })

    .post((req, res)=>{  
       const newCreate = { ...req.body }
       Coworking.create(newCreate)
       .then((data)=>{
        mockCoworkings.push(data.dataValues)
        res.json({message : 'le coworking a bien ete ajoute' , data : newCreate})
       })
       .catch((error)=>{
            res.json({"message" : error.errors[0].message})
        })
    })


router
    .route('/:id')

    .get( (req, res) => {
        let result = mockCoworkings.find(el => el.id === parseInt(req.params.id))
        if (!result) {
            result = `Aucun élément ne correspond à l'id n°${req.params.id}`
        }
        res.json(result)
    })

    .put((req,res)=>{
        let findElement
        for (let i = 0; i < mockCoworkings.length; i++) {
            const element = mockCoworkings[i]
            if(element.id === Number(req.params.id)){
                findElement = {value : element, index: i}
            } 
        }
        if(!findElement){
            res.json({message : `on peux pas trouver coworking number ${req.params.id}`, data : {}})
        }
        Coworking.update({ ...findElement.value,...req.body },{
            where : {
                "id" : findElement.value.id
            }
        })
        .then(()=>{
            let result = {... findElement.value, ...req.body}
            mockCoworkings[findElement.index] = result
            res.json({message : `on a bien modifie data de numero ${findElement.value.id}`, data : result})
        })
        .catch((error)=>{
            console.log(error);
            res.json({"message" : error.e.message})
        })
    })
    
    .delete((req,res)=>{
        let findElement
        for (let i = 0; i < mockCoworkings.length; i++) {
            const element = mockCoworkings[i]
            if(element.id === Number(req.params.id)){
                findElement = {value : element, index: i}
            }
        }
        if(!findElement){
            res.json({message : `on peux pas trouver coworking number ${req.params.id}`, data : {}})
        }
        Coworking.destroy({
            where : {
                "id" : findElement.value.id
            }
        })
        .then(()=>{
            mockCoworkings = mockCoworkings.filter(el=> el.id !== findElement.value.id)
            res.json({message : `on a bien efface cette element id ${findElement.value.id}`, data : findElement.value})
        })
        .catch((error)=>{
            res.json({message : `on peut pas trouver cette element id ${req.params.id}`})
        })
    })
    
module.exports = router
