const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3001
// const {sequelize} = require('./db/sequelizeSetup')




// middleware qui me permet d'interpreter le body de ma requete en format json
app.use(express.json())
app.use(morgan('dev'))

const coworkingRouter = require('./routes/coworkingsRoutes')
app.use('/api/coworkings',  coworkingRouter)
const userRouter = require('./routes/userRoutes')
app.use('/api/users', userRouter)
const reviewRouter = require('./routes/reviewsRoutes')
app.use('/api/reviews', reviewRouter)

// const loginRouter = require('./routes/userRoutes')
// app.use('/api/login', loginRouter)
// app.use('/', coworkingRouter)

// app.use('/api/coworkings/:id', coworkingRouter)


const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use('/images', express.static(__dirname + '/images'))



app.get('/', (req,res)=>{
    /* exemple d'un cookie de premiere visite d'un site
    console.log(req.cookies);
    res.cookie('estDejaVenuSurleSite' , true)

    if(req.cookies.estDejaVenuSurleSite){
        res.json('hello world')
    } else {
        res.json('salut tu es nouveau!')
    }
    */
    res.json('hello world')
})




/*
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')

app.use('/api/users' , userRouter )
app.use('./api/revies', revieRouter)
*/

/*
app.get('/', (req, res) => {
    res.json('Hello World !')
})
*/

// app.get('/api/coworkings', (req, res) => {
//     // Afficher la phrase : Il y a ... coworkings dans la liste. 
//     res.json(mockCoworkings)
// })

/*
app.get('/api/coworkings/:id', (req, res) => {
    let result = mockCoworkings.find(el => el.id === parseInt(req.params.id))

    if (!result) {
        result = `Aucun élément ne correspond à l'id n°${req.params.id}`
    }
    res.json(result)
})
*/


// implementer le endpoint post qui renvoie une reponse "post fonctionne"
// app.post('/api/coworkings/', (req, res)=>{
    // ajouter le coworking dans le tableau, en automatisant la generation d'un id.
    // on recupere le dernier element du tableau et on ajoute +1 a son id.

    /* 내가 만든답
    let mockCoworkingsid = mockCoworkings[mockCoworkings.length-1].id +1
    req.body.id = mockCoworkingsid
    mockCoworkings.push(req.body)
    console.log(mockCoworkings);
    */

    // 내가 만든답 2. 일단 postman에서 id를 지우고 쓴 답
    /*
    req.body.id = mockCoworkings[mockCoworkings.length-1].id +1
    mockCoworkings.push(req.body)
    console.log(mockCoworkings);
    */

    /*
    // 같이 쓴 답
    let coworking = req.body
    coworking.id = mockCoworkings[mockCoworkings.length-1].id +1
    // mockCoworkings.push(coworking)
    // console.log(mockCoworkings);

    // 여기에 capacity, superficy 추가하기
    coworking.capacity = 150
    coworking.superficy = 200
    mockCoworkings.push(coworking)
    */

    // 함수로 만들어봄
    /*
    formulaire(req, 500,200)
    console.log(mockCoworkings);
    */

    /*
    // 답 같이 만들어봄
    const newId = mockCoworkings[mockCoworkings.length-1].id +1
    // let coworking = { id: newId, superficy : req.body.superficy, capacity : req.body.capacity, name : req.body.name}
    
    // 윗줄과 같음
    // ...SPREAD OPERATOR => pour tableau, pour l'objet
    let coworking = {id: newId, ...req.body}
    mockCoworkings.push(coworking)

    // On renvoie un objet qui contient les proprietes message et data
    console.log(coworking);
    let result = {message : 'le coworking a bien ete ajoute', data : coworking}
    res.json(result)
    */
// })

/*
const formulaire =(req, capacity, superficy)=>{
    let coworking = req.body
    coworking.id = mockCoworkings[mockCoworkings.length-1].id +1
    coworking.capacity = capacity
    coworking.superficy = superficy
    mockCoworkings.push(coworking)
}
*/


// implementer le endpoint put coworkings avec :id, ainsi que lq requete correspondante dans postman

// app.put('/api/coworkings/:id' , (req,res)=>{
    
    /* 내가 쓴답 이거의 문제는 
    let objetId = req.params.id
    let currentElement = mockCoworkings.find(el=> el.id===parseInt(objetId))

    if(!currentElement){
        res.json(`no result with id number ${objetId}`)
    } else {
        currentElement.superficy = req.body.superficy
        currentElement.capacity = req.body.capacity
        res.json(currentElement)
    }
    */
    

    /* 쌤이 쓴답
    const coworking = mockCoworkings.find(el=>el.id === parseInt(req.params.id))
    coworking.superficy = req.body.superficy
    const result = {message : 'coworking modifie', data: coworking}
    res.json(result)
    */


    // 내가 쓴 답은 복사본은 수정하고 있고, 이 방법이 원래 mockCoworkings 자체를 수정하는 방법
    /*
    let foundElement;
    for (let i = 0; i < mockCoworkings.length; i++) {
        const element = mockCoworkings[i];
        if(element.id === parseInt(req.params.id)){
             foundElement = {value: element, index: i}
        }
    }
    if(!foundElement){
        res.json(`no result with id number ${parseInt(req.params.id)}`)
    } else {
        mockCoworkings[foundElement.index] = {...foundElement.value, ...req.body}
        let result = {message:'coworking modifie', data :{...foundElement.value, ...req.body}}
        res.json(result)
    }
    */

    // 두 번째 코드에서는 요소의 인덱스와 값을 따로 저장한 후 객체 병합을 통해 업데이트하였기 때문에 요소의 변경사항을 좀 더 명시적으로 파악할 수 있습니다. 반면 첫 번째 코드에서는 바로 해당 요소를 업데이트하고 있어서 요소의 변경사항을 직접 추적하기 어려울 수 있습니다.
// })

/*
app.put('/api/coworkings/:id', (req, res) => {
    const coworking = mockCoworkings.find((el) => el.id === parseInt(req.params.id))
    let result;
    if (coworking) {
        coworking.superficy = req.body.superficy
        coworking.address.number = req.body.address.number
        coworking.address.postCode = req.body.address.postCode
        result = { message: 'Coworking modifié', data: coworking }
    } else {
        result = { message: `Le coworking n'existe pas`, data: {} }
    }

    res.json(result)
})
*/


// 2 혼자 만들어보기 성공!!!
/*
app.put('/api/coworkings/:id' , (req,res)=>{
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
})
*/

/* 2
app.put('/api/coworkings/:id' , (req,res)=>{
	let foundElement;
    for (let i = 0; i < mockCoworkings.length; i++) {
        const element = mockCoworkings[i];
        if(element.id === parseInt(req.params.id)){
             foundElement = {value: element, index: i}
        }
    }
    if(!foundElement){
        res.json(`no result with id number ${parseInt(req.params.id)}`)
    } else {
        mockCoworkings[foundElement.index] = {...foundElement.value, ...req.body}
        let result = {message:'coworking modifie', data :{...foundElement.value, ...req.body}}
        res.json(result)
    }
})
*/



/*
app.put('/api/coworkings/:id', (req, res) => {
    const coworking = mockCoworkings.find((el) => el.id === parseInt(req.params.id))   // retourver endpoint avec id
    let result;
    if (coworking) {
        // coworking.superficy = req.body.superficy            // 만약에 다른 파라미터를 바꾸고 싶을 땐 어떻게 할거야 계속 추가할거야? 이런문제가 생김
        coworking = {...coworking, ...req.body} // ...req.body를 먼저 쓰면 겹치는 부분이 coworking으로 덮어씌워짐. 그래서 ...req.body를 뒤에 써야 수정됨
        result = { message: 'Coworking modifié', data: coworking }
    } else {
        result = { message: `Le coworking n'existe pas`, data: {} }
    }
    res.json(result)
})
*/


/*
app.put('/api/coworkings/:id', (req, res) => {
    let coworking = mockCoworkings.find((el) => el.id === parseInt(req.params.id))   // retourver endpoint avec id
    let result;
    if (coworking) {
        // coworking.superficy = req.body.superficy            // 만약에 다른 파라미터를 바꾸고 싶을 땐 어떻게 할거야 계속 추가할거야? 이런문제가 생김
        coworking = {...coworking, ...req.body} // ...req.body를 먼저 쓰면 겹치는 부분이 coworking으로 덮어씌워짐. 그래서 ...req.body를 뒤에 써야 수정됨
    
        result = { message: 'Coworking modifié', data: coworking }
    } else {
        result = { message: `Le coworking n'existe pas`, data: {} }
    }
    res.json(result)
})
*/


// app.delete('/api/coworkings/:id', (req,res)=>{

    /*
    let modifiedMockCoworkings = []
    let objetId = req.params.id
    let currentElement = mockCoworkings.find(el=> el.id===parseInt(objetId))
    console.log(currentElement);

    for (let i = 0; i < mockCoworkings.length; i++) {
        if(i !== currentElement.id){
            modifiedMockCoworkings.push(mockCoworkings[i])
        }
        
    }
    res.send('bien supprime')
    */


    /* 정답
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


    /*
    for (let i = 0; i < mockCoworkings.length; i++) {
        let element = mockCoworkings[i]
        if(element.id === parseInt(req.params.id)){
            mockCoworkings[i] = {}
        }
    }  

    res.send('bien supprime')
    */
// })


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


/*
const importation = require('./exemple')
console.log(importation) 

const { identify } = require('./exemple')
console.log(identify);

const importation2 = require('./exemple')
console.log(importation2);

const {myFunction} = require('./exemple')
myFunction()

const {add} = require('./exemple')
add(3,4)
const {substract} = require('./exemple')
substract(3,4)
*/