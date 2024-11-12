// const {findAllCoworkings , findCoworkingByPk, createCoworking, updateCoworking, deleteCoworking } = require('../db/sequelizeSetup')
const {Coworking, User, Review, sequelize} = require('../db/sequelizeSetup')
const {Op, UniqueConstraintError, ValidationError, QueryTypes} = require('sequelize')
const jwt = require('jsonwebtoken')
const SECRET_KEY = require('../configs/tokenData')
const { login } = require('./authControllers')

// const { QueryTypes } = require('sequelize') 이줄을 오히려 안쓰니까 오류가 없어짐. 

const findAllCoworkings = (req, res) => { 
    let query = req.query.search
    if(query){
        Coworking.findAll({ where : { name : { [Op.like] : `${query}%` } } })
        .then((result)=>{
            res.json({message : `il y a ${result.length} resultat avec votre mot cle ${query} `, data : result})
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
    } else{
        Coworking.findAll({include : [Review,User]})
        .then((result)=>{
                res.json(result)
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
    }
}

const findCoworkingByPk = (req,res) =>{
    // const cowokingId = parseInt(req.params.id)
        Coworking.findByPk(req.params.id)
        .then((result)=>{
            if(result){
                res.json({message : 'un coworking a ete trouve', data : result})
            } else{
                res.status(404).json({message : `Aucun élément ne correspond à l'id n°${req.params.id}`})
            }
        })
        .catch((error)=> {
            res.status(500).json({message : 'une erreur est survenue', data : error.message})
        })  // 여기서 error.message 가 우리가 모델을 정의할때 unique에 썼던 프로퍼티인 msg임 
}


const createCoworking = (req,res) =>{
    /* 미들웨어로 정리했으니 여기 필요없음. 
    console.log('your token is' ,req.headers.authorization)
    if(!req.headers.authorization){
        return res.status(401).json({message : `vous n'etes pas authentifie`})
    }

    //  아래 한줄과 같음
    // const arrSubstrings = req.headers.authorization.split(' ')
    // const token = arrSubstrings[1]
    
    const token = req.headers.authorization.split(' ')[1]

    console.log('this is token : ' ,token);

    if(token){
        try{
            const decoded = jwt.verify(token, SECRET_KEY)
            //이 줄 다 썼는데도 계속 catch의 메세지인 le token n'est pas valide.를 잡았음. 토큰을 잘 입력했음에도. 알고보니 jwt를 require안했음.
            // secret_key도 다르게 쓰면 똑같이 안나옴. 
            console.log('token here', token);
            
            //verify 자체가 에러를 내느냐 안내느냐의 메소드이기 때문에 if else보다는 try catch를 쓴다.
            // try, catch는 무조건 async 함수와 같이 쓰는 것은 아니다. 거의 90%의 경우의 async함수에서 try, catch가 오류를 잡아내므로
            // 아주 유용하긴 하지만 try, catch가 async함수 안에서만 사용되는 것은 아니라는 것.
        } catch(error){
            return res.status(403).json({message : `le token n'est pas valide.`})
        }
    }
    */    


    User.findOne({where : {name : req.name}})
    .then(foundUser =>{
        if(!foundUser){
            return res.status(404).json({message : `L'utilisateur n'a pas été trouvé`})
        }

        const userIdWhoCreate = foundUser.id
        Coworking.create({...req.body, userId : userIdWhoCreate}) // 여기 userId는 여튼 phpmyAdmin에 생성된 fk 콜론의 이름과 같아야함. 
        .then(()=>{
            
            res.json({message : 'le coworking a bien ete ajoute' , data : req.body})
        })
        .catch((error)=>{
             res.status(500).json({"message" : error.message})
         })
    })
    .catch((error)=> {res.status(500).json({message : 'une erreur est survenue', data : error.message}) })

}




const updateCoworking = (req,res) =>{
    Coworking.findByPk(req.params.id)
    .then((result) => {
        if (result) {
            return result.update(req.body)
                .then(() => {
                    res.json({ message: 'Le coworking a bien été mis à jour.', data: result })
                })
                // .catch(error => {
                //     res.status(500).json({ message: 'La mise à jour a échoué.', data: error.message })
                // })
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
            if(result){  // 왜냐면 delete의 result는 삭제된 엘레먼트의 수를 알려줌 그래서 0 아니면 1이 보였던 거임. put도 마찬가지 일듯?
                return result.destroy({ where : { id : cowokingId } })
                .then((result)=>{
                    res.json({message : 'Le coworking a bien été supprime', datas : result})
                })
                // .catch(error =>{
                //     res.status(500).json({message : `La supprision a échouté.`, data : error.message})
                // })
            } else{
                res.status(404).json({message : `aucun coworking tourve`})
            }
        })
        .catch((error)=>{
            res.status(500).json({message : `La requête n'a pas aboutie.`})
        })
}    



const findAllCoworkingsRawSQL = (req, res) => { 

    // Coworking.findAll({include : Review})
    /*
    sequelize.query("SELECT `coworkings`.`id` AS `coworkings.id`, `coworkings`.`name`, `reviews`.`content` AS `reviews.content`, `reviews`.`rating` AS `reviews.rating`, `reviews`.`CoworkingId` AS `reviews.CoworkingId`, FROM `coworkings` LEFT JOIN `reviews` ON `coworkings.id ` = `reviews.CoworkingId`", {type : QueryTypes.SELECT})  
    */
   // 여기서 `users`는 테이블.

   /*
    sequelize.query("SELECT `c`.`name`, `c`.`price`, `c`.`address`, `c`.`superficy`, `c`.`capacity`,`r`.`content`, `r`.`rating` FROM `coworkings` AS `c` LEFT JOIN `reviews` AS `r` ON `c`.`id` = `r`.`CoworkingId`", {type : QueryTypes.SELECT})
    */

   sequelize.query("SELECT name,content,rating FROM coworkings LEFT JOIN reviews ON coworkings.id = reviews.CoworkingId", {type : QueryTypes.SELECT})
    .then((result)=>{
        console.log(result);
        res.json(result)
    })
    .catch((error)=>{
        res.status(500).json(error.message)
    })   
}


const createCoworkingWithImg =(req,res)=>{
    console.log('withimg ok');
    User.findOne({where : {name : req.name}})
    .then(foundUser =>{
        if(!foundUser){
            return res.status(404).json({message : `L'utilisateur n'a pas été trouvé`})
        }
        const userIdWhoCreate = foundUser.id
        console.log(`req.file`,req.files);
        
        const uploadedFiles =  req.files
        let typeToJson =[]

        
        for (let i = 0; i < uploadedFiles.length; i++) {
            typeToJson.push({})
            typeToJson[i].uploadfile = uploadedFiles[i].filename
        } 

        console.log(`c'est typeToJson`, typeToJson);
        
        if(req.files){
            console.log('condition ok');
            return Coworking.create({...req.body, userId : userIdWhoCreate, attachments : typeToJson /*`${req.protocol}://${req.get('host')}/attachments/${req.files.filename}`*/ }) // 여기 userId는 여튼 phpmyAdmin에 생성된 fk 콜론의 이름과 같아야함. 
            .then((result)=>{
                res.json({message : 'le coworking a bien ete ajoute' , data : result})
            })
        } else {
            return Coworking.create({...req.body, userId : userIdWhoCreate}) // 여기 userId는 여튼 phpmyAdmin에 생성된 fk 콜론의 이름과 같아야함. 
            .then(()=>{
                res.json({message : 'le coworking a bien ete ajoute' , data : req.body})
            })
        }
    })
    .catch((error)=> {
        console.log(error);
        res.status(500).json({message : 'une erreur est survenue', data : error.message}) })
}


const createCoworkingWithFile = (req, res) => {
    User.findOne({where : {name : req.name}})
    .then(foundUser =>{
        if(!foundUser){
            return res.status(404).json({message : `L'utilisateur n'a pas été trouvé`})
        }
        const userIdWhoCreate = foundUser.id
        
        Coworking.create({...req.body, userId : userIdWhoCreate, attachments : `${req.protocol}://${req.get('host')}/files/${req.file.filename}` }) // 여기 userId는 여튼 phpmyAdmin에 생성된 fk 콜론의 이름과 같아야함. 
        .then(()=>{
            res.json({message : 'le coworking a bien ete ajoute' , data : req.body})
        })
        .catch((error)=>{
             res.status(500).json({"message" : error.message})
         })
    })
    .catch((error)=> {res.status(500).json({message : 'une erreur est survenue', data : error.message}) })
}

/* img, file둘다 합치려니까 한됨. middleware에 configattachment 할 때 마지막에 module.exports = multer({storage: storage}).single('image'); 여기서  exports 때문인거같음. file할지 image할지. 아니려나
const createCoworkingWithAttachment =(req,res) =>{
    User.findOne({where : {name : req.name}})
    .then(foundUser =>{
        if(!foundUser){
            return res.status(404).json({message : `L'utilisateur n'a pas été trouvé`})
        }
        const userIdWhoCreate = foundUser.id
        Coworking.create({...req.body, userId : userIdWhoCreate, fileUrl : `${req.protocol}://${req.get('host')}/files/${req.file.filename}` }) // 여기 userId는 여튼 phpmyAdmin에 생성된 fk 콜론의 이름과 같아야함. 
        .then(()=>{
            res.json({message : 'le coworking a bien ete ajoute' , data : req.body})
        })
        .catch((error)=>{
             res.status(500).json({"message" : error.message})
         })
    })
    .catch((error)=> {res.status(500).json({message : 'une erreur est survenue', data : error.message}) })
}
*/



const updateCoworkingWithImg = (req,res) =>{
/* 왜 얘는 안되고 밑에 애는 되냐
    Coworking.findByPk(req.params.id)
    .then((result)=>{
        if(result){
            return result.update({...req.body, imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
            .then(()=>{
                res.status(201).json({message : `le coworking a bien ete mis a jour`, data : result})
            })
        } else { 
            res.status(404).json({ message: `Aucun coworking à mettre à jour n'a été trouvé.` })
        }
    })
    .catch(error => {
        if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
            return res.status(400).json({ message: error.message })
        }
        res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
    })

    */


    Coworking.findByPk(req.params.id)
    .then((result) => {
        if (result) {
            result.attachments = {}
            if(req.files){
                const uploadedFiles =  req.files
                let typeToJson =[]
                for (let i = 0; i < uploadedFiles.length; i++) {
                    typeToJson.push({})
                    typeToJson[i].uploadfile = uploadedFiles[i].filename
                } 
                return result.update({ ...req.body, attachments: typeToJson})
                .then((afterUpdate) => {
                    res.status(201).json({ message: 'Le coworking a bien été mis à jour.', data: afterUpdate })
                })
            } else {
                return result.update({ ...req.body, attachments: typeToJson})
                .then((afterUpdate) => {
                    res.status(201).json({ message: 'Le coworking a bien été mis à jour.', data: afterUpdate })
                })
            }

            
        } else {
            res.status(404).json({ message: `Aucun coworking à mettre à jour n'a été trouvé.` })
        }
    })
    .catch(error => {
        if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
            return res.status(400).json({ message: error.message })
        }
        res.status(500).json({ message: 'Une erreur est survenue.', data: error.message })
    })
}



module.exports = {findAllCoworkings , findCoworkingByPk, createCoworking, updateCoworking, deleteCoworking, findAllCoworkingsRawSQL, createCoworkingWithImg, createCoworkingWithFile, updateCoworkingWithImg}