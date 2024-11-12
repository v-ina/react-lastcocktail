const {Review, User, Coworking} = require('../db/sequelizeSetup')
const {Op, UniqueConstraintError, ValidationError} = require('sequelize')
const jwt = require('jsonwebtoken')


const findAllReview = (req, res) => { 
    let query = req.query.search
    if(query){
        Review.findAll({ where : { content : { [Op.like] : `%${query}%`} } })
        .then((result)=>{ res.json({message : `il y a ${result.length} resultat avec votre mot cle ${query} `, data : result}) })
        .catch((error)=>{ res.status(500).json(error) })
    } else{
        Review.findAll({include : User})
        .then((result)=>{ res.json({message : `il y a ${result.length} reviews `, data : result}) })
        .catch((error)=>{ res.status(500).json(error) })
    }
}


const findReviewByPk = (req,res) =>{
        Review.findByPk(req.params.id)
        .then((result)=>{
            if(result){
                res.json({message : 'un Review a ete trouve', data : result})
            } else{
                res.status(404).json({message : `Aucun élément ne correspond à l'id n°${req.params.id}`})
            }
        })
        .catch((error)=> { res.status(500).json({message : 'une erreur est survenue', data : error.message}) })  
}


const createReview = (req,res) =>{
    // const coworkingId = req.params.coworkingId // 이과정 불필요함. 그냥 req.body에 CoworkingId : 적어서 api만들어도 됨.
    // if(!coworkingId){
    //     return res.status(404).json({message : `on a besoin d'acces au coworking d'abord pour laisser un review`})
    // }
    // Coworking.findByPk(req.params.coworkingId)
    // .then(result => {
    //     if(!result){
    //         return res.status(404).json({message : `on peut pas trouver coworking id n°${req.params.coworkingId}`})
    //     }

        User.findOne({where : {name : req.name}})
        .then(foundUser =>{
            if(!foundUser){
                return res.status(404).json({message : `L'utilisateur n'a pas été trouvé`})
            }

            const userIdWhoCreate = foundUser.id
            return Review.create({...req.body,/* CoworkingId : coworkingId,*/ userId : userIdWhoCreate}) // 여기 userId는 여튼 phpmyAdmin에 생성된 fk 콜론의 이름과 같아야함. 
            .then(()=>{
                res.json({message : 'le review a bien ete ajoute' , data : req.body})
            })
        })
    // })
    .catch((error)=> {
        if(error instanceof ValidationError){ // Unique설정안했으니 딱히 필요없어서 지웠음
            return res.status(400).json({message : error.message})
        }
        res.status(500).json({message : 'une erreur est survenue', data : error.message}) 
    })
}

const updateReview = (req,res) =>{
    Review.findByPk(req.params.id)
    .then((result) => {
        if (result) {
            return result.update(req.body)
                .then(() => { res.json({ message: 'Le Review a bien été mis à jour.', data: result }) })
        } else {
            res.status(404).json({ message: `Aucun Review à mettre à jour n'a été mis à jour.` })
        }
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
            return res.status(400).json({ message: 'Une erreur est survenue.', data: error.message })
        }
        res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
    })
}

const deleteReview = (req,res) =>{
    const cowokingId = parseInt(req.params.id)
    Review.findByPk(cowokingId)
        .then((result)=>{
            if(result){  
                return result.destroy({ where : { id : cowokingId } })
                .then((result)=>{ res.json({message : 'Le Review a bien été supprime', datas : result}) })
            } else{
                res.status(404).json({message : `aucun Review tourve`})
            }
        })
        .catch((error)=>{
            res.status(500).json({message : `La requête n'a pas aboutie.`})
        })
}    


const reviewsAssociateCoworking = (req,res) =>{

}


module.exports =  {findAllReview , findReviewByPk, createReview, updateReview, deleteReview }
