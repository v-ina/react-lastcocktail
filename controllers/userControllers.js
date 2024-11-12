const {User} = require('../db/sequelizeSetup')
const {Op, UniqueConstraintError, ValidationError} = require('sequelize')
const bcrypt = require('bcrypt');

const findAllUser = (req,res)=>{
    let query = req.query.search
    if(query){
        User.findAll({ where : { name : { [Op.like] : `${query}%` } } })
        .then((result)=>{
            res.json(res.json({message : `il y a ${result.length} resultat avec votre mot cle ${query} `, data : result}))
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
    } else{
        User.findAll()
        .then((result)=>{
                res.json(result)
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
    }
}

const findUserByPk = (req,res)=>{
    /*
    const userId = parseInt(req.params.id)
    const currentUser = users.find(el=>el.id === userId)
    if(!currentUser){
        res.json( {message : `user number ${userId} n'existe pas`})
    } else{ 
        User.findByPk(userId)
        .then(()=>{
            const result = {message : `c'est l'info de utilisateur numero ${userId}`, data : currentUser}
            res.json(result)
        })
        .catch((error)=>{res.json({message : 'il y a une erreur', errormessage : error.message})})
    }
    */
    const userId = parseInt(req.params.id)
        User.findByPk(userId)
        .then((result)=>{
            if(result){
                result.password = "hidden"
                res.json({message : 'un utilisateur a ete trouve', data : result})
            } else{
                res.status(404).json({message : `Aucun utilisateur ne correspond à l'id n°${req.params.id}`})
            }
        })
        .catch((error)=> {
            res.status(500).json({message : 'une erreur est survenue', data : error.message})
        })
}
const createUser = (req,res)=>{
    bcrypt.hash(req.body.password, 10)
    .then((hash)=>{
        console.log('this is new hash' ,hash);
        User.create({...req.body, password : hash})
        .then((user)=>{
            let result = {message : `on a cree un utilisateur `, data : user}
            res.status(201).json(result)
        })
        .catch((error)=>{
            if(error instanceof UniqueConstraintError || error instanceof ValidationError){
                return res.status(400).json({ message: error.message })
            }
            // res.status(409).json({message : 'il y a une erreur', errormessage : error.message})
            res.status(500).json({ message: `L'utilisateur n'a pas pu être créé`, data: error.message })
        })
    })
    .catch(error => {
        console.log(error.message);
    })

    
}
const updateUser = (req,res)=>{
    /*
    const userId = parseInt(req.params.id)
    let updatedUser
    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        if(element.id === userId)
        updatedUser = {value : element, index : i}
    }
    if(!updatedUser){
        res.json({message : `il y a pas de user number ${userId}`})
    } else{
        User.update({...updatedUser.value, ...req.body}, {where : {id : updatedUser.value.id}})
        .then(()=>{
            users[updatedUser.index] = {...updatedUser.value, ...req.body}
            const result = {message: `on a bien modifie user number ${userId}`, data : {...updatedUser.value, ...req.body}}
            res.json(result)
        })
        .catch((error)=>{res.json({message : 'il y a une erreur', errormessage : error.message})})
    }
    */
    User.findByPk(req.params.id)
    .then((result)=>{
        if (result){
            // if(result.id !== req.params.id){
            //     return res.status(403).json({message : `droit insuffisants.`})
            // }

            /* 내가쓴답 pour empeche l'utilisateur de mettre a jour son username
            if(req.body.name){
                return res.status(403).json({ message: `tu peut pas changer username` })
            }
            // 와우 폴이 쓴건 걍 간단하게 한줄 ㄷ ㄷ
            */
            req.body.name = result.name   // on empeche l'utilisateur de mettre a jour son username
            return result.update(req.body)
            .then(()=>{
                res.status(201).json({ message: 'cet utilisateur a bien été mis à jour.', data: result })
            })
        } else {
            res.status(404).json({ message: `Aucun utilisateur à mettre à jour n'a été mis à jour.` })
        }
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
           return res.status(400).json({ data: error.message })
        }
           res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
    })
}

const deleteUser = (req,res)=>{
/*
    const userId = parseInt(req.params.id)
    let deletedUser
    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        if(element.id === userId)
        deletedUser = {value : element, index : i}
    }
    if(!deletedUser){
        res.json({message : `il y a pas de user number ${userId}`})
    } else{
        User.destroy({where : {id : userId}})
        .then(()=>{
            users = users.filter(el=> el.id !== userId)
            const result = {message: `on a bien supprime user number ${userId}`, data : deletedUser.value}
            res.json(result)
        })
        .catch((error)=>{res.json({message : 'il y a une erreur', errormessage : error.message})})
    }
    */

    User.findByPk(req.params.id)
    .then((result)=>{
        if(result){
            return result.destroy()
            .then(()=>{
                res.json({ message: 'cet utilisateur a bien été supprime.', data: result })
            })
        } else {
            res.status(404).json({ message: `Aucun utilisateur à supprimer.` })
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
    })
}



module.exports =  {findAllUser , findUserByPk, createUser, updateUser, deleteUser }

