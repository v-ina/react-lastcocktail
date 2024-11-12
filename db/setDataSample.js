const mockCoworkings = require('./mock-coworkings')
const mockUsers = require('./mock-users')
const bcrypt = require('bcrypt')



const setCoworking = (Coworking) =>{
    Promise.all([
        mockCoworkings.forEach(element =>{
            const newCoworking = {...element, userId : null}
            Coworking.create(newCoworking)
            .then(()=>{})
            .catch(error =>{console.log(error.message);})
        })
    ])
}

const setUser = (User) =>{

    Promise.all([
        mockUsers.forEach(user =>{
            bcrypt.hash(user.password, 10)
            .then((hashResult)=>{
                User.create({...user, password : hashResult})
                .then(()=>{})
                .catch(error =>{console.log(error.message)})
            });    
        })
    ])
    
}

/*
const roles = [
    {label : "admin"},
    {label : "editor"}, 
    {label : "user"}
]
*/

const setRole = (Role) =>{
    /* 방법을 바꿈 
    roles.forEach(role => {
    Role.create(role)
    .then(()=>{})
    .catch(error =>{console.log(error.message)})
    })
    */


    /*
    Promise.all([])
    Role.create({label : "admin"})
    Role.create({label : "editor"})
    */
    
    // sequelizeSetup에서 await를 써서 순서를 착착착 하기로 했잔아. 근데 await는 promise랑 같이 일하는애야. 그래서 얘네도 promise로 문맥을 바꿔줘야함.
    Promise.all([Role.create({label : "superadmin"}),Role.create({label : "admin"}), Role.create({label : "editor"}), Role.create({label : "user"})])
}


const setReview = (Review) =>{
    Promise.all([
        console.log('review setting')
    ])
}

module.exports = { setCoworking , setUser , setRole, setReview }
