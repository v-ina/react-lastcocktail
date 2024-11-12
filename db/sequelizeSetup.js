const CoworkingModel = require('../models/coworkingModel')   // 여기서 CoworkingModel은 함수임. 우리가 coworking.js에 작성해서 export한 것이 함수이므로
const UserModel = require('../models/userModel')

// let mockCoworkings = require('../mock-coworkings')
// phpmyAdmin과 연결시키기
const { Sequelize, DataTypes } = require('sequelize');   // 시퀄라이즈는 알아서 datatype을 못 알아듣고, datatype을 명시해주기를 원함. 그래서 써야하는 거임.


const sequelizeNoUpdateAttributes = require('sequelize-noupdate-attributes');





const sequelize = new Sequelize('bordeaux_coworkings', 'root', '', { // 4eme est les options
    host: 'localhost',  // root =  utilisateur racine
    dialect: 'mariadb',
    logging: false   // 모든 정보가 터미널에 너무 많이 적히니까 '전부 다 logger하지마' 로 쓴거임
});

sequelizeNoUpdateAttributes(sequelize)

// try, catch는 await를 써야해서 조금 귀찮으니 then으로 하자.
sequelize.authenticate()
.then(()=>console.log('la connecxion a la base de donnees a bien etet etablie.'))
.catch((error)=>console.error(`impossible de se conncecter a la base de donness ${error}`))


// sequilize의 model 은 데이터베이스의 table이 된다. 
const Coworking = CoworkingModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)
const RoleModel = require('../models/roleModel')
const Role = RoleModel(sequelize, DataTypes)

const ReviewModel = require('../models/reviewModel')
const Review = ReviewModel(sequelize, DataTypes)


const { setCoworking , setUser , setRole, setReview } = require('./setDataSample')


Role.hasMany(User
    // , {
    // foreignKey : {
    //     allowNull : false
    // }
// }
)
User.belongsTo(Role)
// 이거 써두니까 user테이블에 바로 roleId 콜론 생김. 
// la realation entre coworking et user
User.hasMany(Coworking)
Coworking.belongsTo(User)

Coworking.hasMany(Review)
Review.belongsTo(Coworking)

User.hasMany(Review)
Review.belongsTo(User)





sequelize.sync({force: true})
 // force : on va ecraser quand on lancer le serveur)
.then(async()=>{
    // 순서도 중요함.
    await setRole(Role)
    await setUser(User)
    await setCoworking(Coworking)
    await setReview(Review)
    

        /* 내가 쓴답
        for (let i = 0; i < mockCoworkings.length; i++) {

            Coworking.create({
                name : mockCoworkings[i].name,
                price : { 
                  "hour" : mockCoworkings[i].price.hour,
                  "day" : mockCoworkings[i].price.day,
                  "month" : mockCoworkings[i].price.month
                },
                address : `${mockCoworkings[i].address.number} ${mockCoworkings[i].address.street} ${mockCoworkings[i].address.postCode} ${mockCoworkings[i].address.city} `,
                superficy : mockCoworkings[i].superficy,
                capacity : mockCoworkings[i].capacity,
            })
        }
        */

        /* setDataSample로 이사함
        mockUsers.forEach(user =>{
            bcrypt.hash(user.password, 10)
            .then((hashResult)=>{
                // User.create({...user, password : hashResult})로 쓰는 대신에 요렇게도 할 수 있음.
                // user.password = hashResult
                // User.create(user)
                User.create({...user, password : hashResult})
                .then(()=>{})
                .catch(error =>{console.log(error.message);})
            });    
        })
        */
        //이거 then이랑 catch를 create랑 붙여서 썼어야 했는데 깜빡하고 forEach밖에 썼더니 데이터베이스도 포스트맨도 잘 동작은 하는데 서버 새로고침할때마다 콘솔에 에러메세지 생겼었음

        /*setDataSample로 이사함
        mockCoworkings.forEach(element =>{
            //  밑에 한줄씩 적는 방법보다 이 방법도 가능
            // const newCoworking = {...element}
            // Coworking.create(newCoworking)
           
            Coworking.create({
                id : element.id,
                name : element.name,
                price: element.price,
                address : element.address,
                superficy : element.superficy,
                capacity : element.capacity
            })
            .then(()=>{})
            .catch(error =>{console.log(error.message);})
            // 이미 원래 있던 donnee에 오류를 catch해 두지 않아서 len을 [2,10]으로 두었을 때 오류 메세지를 내보내기 보다는 그냥
            // 앱 자체가 버그가 걸려 깨졌던 거임. 
        })
        */
    })
.catch((error)=>{
    console.log(error.message);
})
    // then이 필요없다. 왜냐면 우리는 새로운 coworking을 우리가 postman을 통해서 보낼 때만 만들고 싶거든.
    
// 이 줄로 이제 myAdmin에 새로운 줄이 하나 생기고, 
// 이제 또 postman을 이용해서 user를 추가시킬 수도 있게 되었다. 

module.exports = { sequelize, Coworking , User, Role, Review }
// 이렇게 Coworking을 export 해주는 이유는, 정보를 수정하고/ 더하고/빼고 하는 엔드 포인트에서도 사용하기 위함.