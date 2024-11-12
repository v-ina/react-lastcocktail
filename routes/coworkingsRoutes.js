// fragementer, menage ... pour d'etre maintenable 

const express = require('express')
const router = express.Router()
// let mockCoworkings = require('../mock-coworkings')  // 이 배열은 처음에 데이터베이스 셋업할때만 쓰고 그 뒤에는 신경안써도됨.
// const { Coworking } = require('../db/sequelizeSetup')
// const {Op} = require('sequelize')
// const coworking = require('../models/coworking')
// 각각의 루트에서 각각의 모델을 만드는 함수를 불러오는게 됨

const {findAllCoworkings , findCoworkingByPk, createCoworking, updateCoworking, deleteCoworking, findAllCoworkingsRawSQL, createCoworkingWithImg, createCoworkingWithFile, updateCoworkingWithImg } = require('../controllers/coworkingControllers')
const {protect, restrictToOwnAuthor } = require('../controllers/authControllers')
const { Coworking } = require('../db/sequelizeSetup')

const multer = require('../middleware/multer-config');
const multerFile = require('../middleware/multer-config-file')
// const multerAttachement = require('../middleware/multer-config-attachment')


router
    .route('/withimg')
    .post(protect, multer, createCoworkingWithImg) // multer va intercepter

router 
    .route('/withimg/:id')
    .put(protect, restrictToOwnAuthor(Coworking), multer, updateCoworkingWithImg)

router
    .route('/withfile')
    .post(protect, multerFile, createCoworkingWithFile )






    
    /* img, file 합치려니까 안되네
router
    .route('/withattachment')
    .post(protect, multerAttachement, createCoworkingWithAttachment)
*/

router
    .route('')   // soit ('/') ca. ca marche aussi.

    // .get( (req, res) => {
    //     res.json('Hello World !')
    // })

    .get(findAllCoworkings)
        /*
        (req, res) => {
        // res.json(mockCoworkings)

        /* 내가 쓴답
        Coworking.findAll()
        .then((coworkings)=>{
            res.json({"message" :`j'ai trouve ${mockCoworkings.length} elements`, data : mockCoworkings})
        })
        .catch(()=>{
            res.json({"message" : "il y a une erreur"})
        })

        */

        /* 진짜 답 + 서치 추가
        let query = req.query.search
        if(query){
            Coworking.findAll({ where : { name : { [Op.like] : `${query}%` } } })
            .then((result)=>{
                res.json(result)
            })
            .catch((error)=>{
                res.json(error)
            })
        } else{
            Coworking.findAll()
            .then((result)=>{
                    res.json(result)
            })
            .catch((error)=>{
                res.json(error)
            })
        }
        */
    // })

// protect는 미들웨어고, createCoworking은 endpoint함수임.
    .post(protect, createCoworking)        
    // .post(async (req, res)=>{  
        // const newId = mockCoworkings[mockCoworkings.length-1].id +1
        // let coworking = {id: newId, ...req.body}
        // mockCoworkings.push(coworking)

        /*
        for (let i = 0; i < mockCoworkings.length; i++) {
        Coworking.creat({
                name : mockCoworkings[i].name,
                price : { 
                    "hour" : mockCoworkings[i].price.hour,
                    "day" : mockCoworkings[i].price.day,
                    "month" : mockCoworkings[i].price.month
                },
                address : `${mockCoworkings[i].address.number} ${mockCoworkings[i].address.street} ${mockCoworkings[i].address.postCode} ${mockCoworkings[i].address.city} `,
                superficy : mockCoworkings[i].superficy,
                capacity : mockCoworkings[i].capacity,
                created : new Date()
            })
        }
        */

        /*
        Coworking.create({
            name: "Oasis Coworking",
            price: { "hour": 4, "day": 21, "month": 100 },
            address: { "number": "68bis", "street": "avenue Jean Jaurès", "postCode": 33150, "city": "Cenon" },
            superficy: 200,
            capacity: 27,
       })
       */

       /*
       Coworking.create({
            name : req.body.name,
            price : req.body.price,
            address : req.body.address,
            superficy : req.body.superficy,
            capacity : req.body.capacity
       })
       */



       /* id 1부터 시작하기
       const newId = mockCoworkings[mockCoworkings.length-1].id +1
       const newCreate = { "id" : newId ,...req.body }
       */

        /*최종 답
       const newCreate = { ...req.body }
       
       Coworking.create(newCreate)
       .then((data)=>{
        const newCoworking = data.dataValues
        mockCoworkings.push(newCoworking)
        res.json({message : 'le coworking a bien ete ajoute' , data : newCreate})
       })
       .catch((error)=>{
        console.log(error);
            res.json({"message" : error.errors[0].message})
        })
        */
        


        /* awiat와 syncs 쓰는 법  맨 위에 .post(async (req, res)=>{ 여기에 async 써주기
        const cowrkingsss =  await Coworking.create(newCreate)

        try{
            res.json({message : 'le coworking a bien ete ajoute' , data : cowrkingsss})
        } catch(error){
            res.json({"message" : error.errors[0].message})
        }
        */
    // })

router
    .route('/rawsql') // pure sql
    .get(findAllCoworkingsRawSQL)



router
    .route('/:id')
    .get(findCoworkingByPk)
    // .get( (req, res) => {
        /*
        let result = mockCoworkings.find(el => el.id === parseInt(req.params.id))
    
        if (!result) {
            result = `Aucun élément ne correspond à l'id n°${req.params.id}`
        }
        res.json(result)
        */


       /* findBypK로 내가 쓴답
       const cowokingId = parseInt(req.params.id)
       const finedCoworking = mockCoworkings.find(el => el.id === cowokingId)
       let result
       if (!finedCoworking) {
        result = `Aucun élément ne correspond à l'id n°${req.params.id}`
        res.json(result)
        }
       Coworking.findByPk(cowokingId)
       .then(()=>{
            result = {message : `this is information of comment number ${cowokingId}`, data : finedCoworking}
            res.json(result)
        })
        .catch((error)=>{res.json(error)})
        */

        /*최종 답
        const cowokingId = parseInt(req.params.id)
        Coworking.findByPk(cowokingId)
        .then((result)=>{
            if(result){
                res.json({message : 'un coworking a ete trouve', data : result})
            } else{
                res.json({message : `Aucun élément ne correspond à l'id n°${req.params.id}`})
            }
        })
        .catch((error)=> {
            res.json({message : 'une erreur est survenue', data : error.message})
        })
        */
    // })
        
    
    .put(protect, restrictToOwnAuthor(Coworking), updateCoworking)
    // .put((req,res)=>{
        /*  내가 쓴 답     
        let finedElment
        for (let i = 0; i < mockCoworkings.length; i++) {
            const element = mockCoworkings[i]
            if(element.id === Number(req.params.id)){
                finedElment = {value : element, index: i}
            } 
        }
        if(!finedElment){
            res.json({message : `on peux pas trouver coworking number ${req.params.id}`, data : {}})
        }
 
        Coworking.update({ ...finedElment.value,...req.body },{
            where : {
                "id" : finedElment.value.id
            }  
        })
        // index와 id가 달라지는 약간의 문제가 있음. 오브젝트가 갖고 있는 id가 => seauelize Setup에서 아예 id를 자동으로 1부터 시작되지 않도록 object의 id로 직접 넣어줌
        .then(()=>{
            let result = {... finedElment.value, ...req.body}
            mockCoworkings[finedElment.index] = result
            result = {message : `on a bien modifie data de numero ${finedElment.value.id}`, data : result}
            res.json(result)
        })
        .catch((error)=>{
            console.log(error);
            res.json({"message" : error.e.message})
        })
        */

        // 수업중 같이쓴답 + 내가쓴답
        /*
        const cowokingId = parseInt(req.params.id)
        Coworking.update(req.body, { where : { id : cowokingId } })
        .then((result)=>{
            // console.log(result); // update의 경우 result가 꽤 독특하다.
                if (result){
                    let updatedData
                    Coworking.findByPk(cowokingId)
                    .then((response)=>{
                        updatedData = response
                        res.json({message : 'Le coworking a bien été mis à jour', datas : updatedData})
                    })
                    .catch(error =>res.json({message : 'il y a une erreur'}))
                } else {
                    res.json({message : `aucun cowrking n'a été mis à jour`})
                }
            })
        .catch((error)=>{
            res.json({message : 'La mise a juor a échouté.'})
        })
        */

        // 폴이 쓴 답
        /*
        const cowokingId = parseInt(req.params.id)

        Coworking.update(req.body, { where : { id : cowokingId } })
        .then((result)=>{
            console.log(result);
            if(result >0){
                Coworking.findByPk(cowokingId)
                .then((coworking)=>{
                    res.json({message : 'le coworking a bien ete mis a jour', data : coworking})
                })
                .catch((error)=>{
                    res.json({message : 'une erreur est survenue'})
                })
            }else{
                res.json({message : `aucun coworking n'a ete trouve`})
            }
        })
        .catch((error)=>{
            res.json({message : 'la mis a jour a ete echoue'})
        })
        */

        // 또! 고친답
        /*최종 답
        Coworking.findByPk(req.params.id)
            .then((result) => {
                if (result) {
                    result.update(req.body)
                        .then(() => {
                            res.json({ message: 'Le coworking a bien été mis à jour.', data: result })
                        })
                        .catch(error => {
                            res.json({ message: 'La mise à jour a échoué.', data: error.message })
                        })
                } else {
                    res.json({ message: `Aucun coworking n'a été mis à jour.` })
                }
            })
            .catch(error => {
                res.json({ message: 'Une erreur est survenue.', data: error.message })
            })
            */

 


        /*
        let finedElemnt
        for (let i = 0; i < mockCoworkings.length; i++) {
            const element = mockCoworkings[i]
            if(element.id === Number(req.params.id)){
                finedElemnt = {value : element, index: i}
            }
        }
        let result
        if(finedElemnt){
            mockCoworkings[finedElemnt.index] = {...mockCoworkings[finedElemnt.index],...req.body}
            result = {message : `on a bien modifie data de numero ${finedElemnt.index}`, data : mockCoworkings[finedElemnt.index]}
        }else{
            result = {message : `on peux pas trouver coworking number ${req.params.id}`, data : {}}
        }
        res.json(result)
        */
        
    // })
    
    .delete(protect, restrictToOwnAuthor(Coworking), deleteCoworking)
    // .delete((req,res)=>{
        /*
        const coworking = mockCoworkings.find(el=>el.id === parseInt(req.params.id))
        let result
        if(coworking){
            mockCoworkings = mockCoworkings.filter(el=> el.id !== coworking.id)
            result = {message : 'coworking supprime', data : coworking}
        } else{
            result = {message : "le coworking n'existe pas", data : coworking}
        }
        res.send(result)
        */

        /* 내가쓴 답
        let finedElment
        for (let i = 0; i < mockCoworkings.length; i++) {
            const element = mockCoworkings[i]
            if(element.id === Number(req.params.id)){
                finedElment = {value : element, index: i}
            }
        }
        console.log(finedElment);

        if(!finedElment){
            res.json({message : `on peux pas trouver coworking number ${req.params.id}`, data : {}})
        }

        Coworking.destroy({
            where : {
                "id" : finedElment.value.id
            }
        })
        .then(()=>{
            mockCoworkings = mockCoworkings.filter(el=> el.id !== finedElment.value.id)
            res.json({message : `on a bien efface cette element id ${finedElment.value.id}`, data : finedElment.value})
        })
        .catch((error)=>{
            res.json({message : `on peut pas trouver cette element id ${req.params.id}`})
        })
        */
        // 위 방법은 불필요한 문장이 많음. 처음 for하는 부분은 findByPk로 해결될 수 있는 부분이고, 나머지 부분도 배열과 데이터베이스 둘다 
        // 평행선에 두고 여기도 고치고 저기도 고치는 거기 때문에 둘이 씽크되지 않는 문제가 있음.


        /* 최종 답
        const cowokingId = parseInt(req.params.id)
        Coworking.findByPk(cowokingId)
            .then((coworking)=>{
                if(coworking){  // 왜냐면 delete의 result는 삭제된 엘레먼트의 수를 알려줌 그래서 0 아니면 1이 보였던 거임. put도 마찬가지 일듯?
                    Coworking.destroy({ where : { id : cowokingId } })
                    .then((result)=>{
                        res.json({message : 'Le coworking a bien été supprime', datas : coworking})
                    })
                    .catch(error =>{
                        res.json({message : `La supprision a échouté.`, data : error.message})
                    })
                } else{
                    res.json({message : `aucun coworking tourve`})
                }
            })
            .catch((error)=>{
                res.json({message : `La requête n'a pas aboutie.`})
            })
        })    
        */

    
module.exports = router
//  coworkingRoutes는 미들웨어임