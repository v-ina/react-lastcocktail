/*
const {Coworking} = require('../db/sequelizeSetup')
const {Op, UniqueConstraintError, ValidationError} = require('sequelize')
const jwt = require('jsonwebtoken')


const findAllCoworkings = (req, res) => { 
    let query = req.query.search
    if(query){
        Coworking.findAll({ where : { name : { [Op.like] : `${query}%` } } })
        .then((result)=>{ res.json({message : `il y a ${result.length} resultat avec votre mot cle ${query} `, data : result}) })
        .catch((error)=>{ res.status(500).json(error) })
    } else{
        Coworking.findAll()
        .then((result)=>{ res.json(result) })
        .catch((error)=>{ res.status(500).json(error) })
    }
}


const findCoworkingByPk = (req,res) =>{
        Coworking.findByPk(req.params.id)
        .then((result)=>{
            if(result){
                res.json({message : 'un coworking a ete trouve', data : result})
            } else{
                res.status(404).json({message : `Aucun élément ne correspond à l'id n°${req.params.id}`})
            }
        })
        .catch((error)=> { res.status(500).json({message : 'une erreur est survenue', data : error.message}) })  
}


const createCoworking = (req,res) =>{
    if(!req.headers.authorization){
        return res.status(401).json({message : `vous n'etes pas authentifie`})
    }
    const token = req.headers.authorization.split(' ')[1]

    if(token){
        try{
            const decoded = jwt.verify(token, 'secret_key')
        } catch(error){
            return res.status(403).json({message : `le token n'est pas valide.`})
        }
    }
    
    Coworking.create(req.body)
    .then((data)=>{ res.json({message : 'le coworking a bien ete ajoute' , data : req.body}) })
    .catch((error)=>{ res.status(500).json({"message" : error.message}) })
}

const updateCoworking = (req,res) =>{
    Coworking.findByPk(req.params.id)
    .then((result) => {
        if (result) {
            return result.update(req.body)
                .then(() => { res.json({ message: 'Le coworking a bien été mis à jour.', data: result }) })
        } else {
            res.status(404).json({ message: `Aucun coworking à mettre à jour n'a été mis à jour.` })
        }
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
            return res.status(400).json({ message: 'Une erreur est survenue.', data: error.message })
        }
        res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
    })
}

const deleteCoworking = (req,res) =>{
    const cowokingId = parseInt(req.params.id)
    Coworking.findByPk(cowokingId)
        .then((result)=>{
            if(result){  
                return result.destroy({ where : { id : cowokingId } })
                .then((result)=>{ res.json({message : 'Le coworking a bien été supprime', datas : result}) })
            } else{
                res.status(404).json({message : `aucun coworking tourve`})
            }
        })
        .catch((error)=>{
            res.status(500).json({message : `La requête n'a pas aboutie.`})
        })
}    


module.exports = {findAllCoworkings , findCoworkingByPk, createCoworking, updateCoworking, deleteCoworking}
*/