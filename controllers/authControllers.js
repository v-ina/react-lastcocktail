const {User, Role, Coworking} = require('../db/sequelizeSetup')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = require('../configs/tokenData')


const roleHierarchy = {
    editor : ["editor"],
    admin : ["admin", "editor"], // admin 은 editor의 역할을 갖을수 있게
    superamind : ["superadmin", "admin", "edit"]
}

const login=(req,res)=>{
    User.scope('withPassword').findOne({where : {name : req.body.name}})
    .then((result)=>{
        if(!result){
            return res.status(404).json({message : `le nom d'utilisateur n'existe pas`})
        }
        bcrypt.compare(req.body.password, result.password)
        .then((isValid)=>{
            if(!isValid){
                return res.status(401).json({message : `le mot de passe n'est pas valid`})
            }

            const token = jwt.sign({
                data: /*req.body*/ result.name
              }, SECRET_KEY /* secret은 다른 단어도 될수 있고, 변수도 될 수 있다. */, { expiresIn: '5h' });
            
            
            // res.cookie('coworkingapi_jwt', token)
            res.json({message : `login reussi` ,data : token /*, data : token  (위의 쿠키 덕분에 필요 없음)*/})   // return 썼으니까 else안해도 됨
        })
        // } else {
        //     return res.json({message : `le mot de passe est valid`, result : result})
        // }
        console.log("c'est req.body" ,req.body);
        console.log('cest result.name', result.name);
        console.log(`c'est hearders.auth`, req.headers);
    })
    .catch((error)=>{res.status(500).json({data : error.message})})
}

const protect = (req,res,next) =>{
    // 쿠키가 있으므로 이렇게 쓸 수 있음.
    if(!req.headers.authorization){
        return res.status(401).json({message : `vous n'etes pas authentifie`})
    }
    const token = req.headers.authorization.split(' ')[1]
    // console.log('this is token : ' ,token);
    

    /* 큐키 쓴뒤로 계속 터져서 그냥 req.headers로 쓸래...
    console.log(`c'est req.cookies`,req.headers.cookie);
    console.log(`c'est hearders.auth`, req.headers);
    if(!req.headers.cookie){
        return res.status(401).json({message : `vous n'etes pas authentifie`})
    }
    const token = req.headers.cookie.split('=')[1]
    */


    if(token){
        try{
            const decoded = jwt.verify(token, SECRET_KEY)
            // console.log('this is decoded data',decoded)
            req.name = decoded.data
            console.log('next ');
            next()
        } catch(error){
            return res.status(403).json({message : `le token n'est pas valide.`})
        }
    }
}

// implementer le middleware pour restreindre l'acces aux tuilisateurs admin
const restrict = (labelRole)=> {
    return (req, res, next) =>{
        /* admin이 여러명이면 안되서 탈락
        console.log('this is req', req);
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, SECRET_KEY)
        console.log(decoded.data.name)
        if(decoded.data.name === "soo1"){
            try{
               return next()
                
            } catch(error){
                return res.status(403).json({message : `c'est interdit a l'accesser si t'es pas administrateur.`})
    
            }
        }
        res.status(403).json({message : `c'est interdit a l'accesser si t'es pas administrateur.`})
        */
    
        User.findOne({where : {name : req.name} })
        .then((user)=>{
            // 토큰은 1주일짜리가 있는데 만약에 아이디를 삭제하고 다른걸 또 만들었어.그러면 navigateur에는 토큰이 있는데 유저는 없는 경우임. 이런 아주 희안한 경우도 
            console.log(user.roleId);
            return Role.findByPk(user.roleId) // 여기 리턴 덕분에 여기 then의 catch가 필요없음
            .then(role =>{
                console.log('role',role.label);
                // if(role.dataValues.label === role){
                    if(roleHierarchy[role.label/*role dans le token*/].includes(labelRole)){
                    next()
                } else {
                    res.status(403).json({message : `Droits insuffisants`})
                }
            })
        })
        .catch((error)=>{
            console.log(error.message);
            return res.status(500).json({message : `une erreur est survenue.`})
        })
    }
}


// implementer le middleware qui sera utilis sur updateCoworking et delteteCoworking, qui permettra d'interagir sur la ressouce suelement si on en est l'auteur. si ce n'est pas le cas, on renvoie une erreur.
const restrictToOwnAuthor = (Model) =>{
    return (req, res, next) => {

        // console.log(req);
        // 폴이 쓴답
        User.findOne({where : {name : req.name}}) 
        .then((user)=>{
            if(!user){
                return res.status(404).json({message : `pas d'utilisateur trouve.`})
            }
            Model.findByPk(req.params.id)
            .then(coworking => {
                console.log(user.id, coworking);
                if(user.id === coworking.userId){
                    next()
                } else {
                    res.status(403).json({ message: `Vous n'êtes pas l'auteur de la ressource.` })
                }
            })
            .catch(error => {
                return res.status(500).json({ message: `Pas de coworking trouvé.` })
            })
        })
        .catch(error => res.status(500).json({message : error.message}))


    /* 내가쓴답 정정편 coworking을 먼저 찾으면 coworking을 찾지 못한 경우도 추가해줘야한다. 
    Coworking.findByPk(req.params.id)
    .then((resultOfCoworking)=>{
        if(!resultOfCoworking){
            res.status(404).json({message : `cette corworking existe pas`})
        }
        User.findOne({where: {id : resultOfCoworking.userId}})
        .then((foundUser)=>{
            if(foundUser){
                return next()
            } else {
                res.status(403).json({message : 'vous avez pas le droit.'})
            }
        })
    })
    .catch(error => res.json({message : error.message}))
    */
    }
}


const correctUser =(req,res) => {
    User.findOne({where : {name: req.name}})
    .then((authUser)=>{
        Role.findByPk(authUser.RoleId)
        .then(role => {
            if(roleHierarchy[role].includes('admin')){
                return next()
            }
            if(authUser.id === parseInt(req.params.id)){
                next()
            } else {
                res.status(403).json({message : 'droit insuffisants'})
            }
        })
    })
    .catch(error => res.status(500).json({message : error.message}))
}


//처음에 postman에서 계속 오류났었음. app.js에 새로운 루터를 만든 문제도 있었고(어짜피 둘다 userRoutes안에서 작동하므로 따로 불러올 필요 없음),
// 그리고 얘 자체가 userRoute안에 있는거라서 api/users/login 으로 써야하는데 postman에 /apoi/login으로 찾으니 계속 404 나왔음
// ici on genere un token
module.exports = { login, protect, restrict, restrictToOwnAuthor, correctUser }