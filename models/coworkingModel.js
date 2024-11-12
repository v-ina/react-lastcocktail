// description de ma table cote javascripts

// const sequelize = new Sequelize('sqlite::memory:');   // 우리는 이 줄 필요없음. 우리는 이미 config한 코드 줄이 app.js에 있음
// const sequelize = new Sequelize('bordeaux_coworkings', 'root', '', { // 4eme est les options
//     host: 'localhost',  // root =  utilisateur racine
//     dialect: 'mariadb'
// });

module.exports = (sequelize, DataTypes)=>{
    return sequelize.define('Coworking', {
      // Model attributes are defined here
      // id :{
      //   type : DataTypes.INTEGER,
      //   primaryKey : true,
      //   autoIncrement : true
      // },
      name : { 
        type : DataTypes.STRING, 
        allowNull: false, 
        unique : { 
          msg : 'le nom est deja pris'
          },
        validate : { 
          notEmpty : { 
            msg : "le nom ne peut pas etre vide"
          },
          len :{
            args : [2,50],
            msg : 'le nom doit faire au moins 2 caracteres et maximum 50 caracteres.'
            // 처음에 이거 [2,10]으로 쓰니까 깨졌음. 왜냐면 이미 10글자를 넘는 디폴트 데이터 베이스가 있었기 때문에 아예 앱이 깨짐
          }
        } 
      },
      price : {
         type : DataTypes.JSON,
         validate : {
          //custom validator 만들기
          isTrueAtLeastOne(value){
            if(value.hasOwnProperty("hour") && value.hasOwnProperty("day") && value.hasOwnProperty("month")){
              // if((!value.hour && !value.day && !value.month)){  // !이거 not으로 하면 0을 받지 않기 때문에 !는 false임을 잊지 말자. null이 아님 
              if((value.hour === null && value.day === null && value.month === null)){
                throw new Error('il faut remplir au moins un champs de price')
              }
            } else {
              throw new Error('nom de propriete est pas correct')
            }
            
            // undifiend는 null 이 아니라서 만약에 req.body에 "dy" : null을 쓰면 만들어진다.
          }
        }
      },
      address : { type : DataTypes.JSON },
      superficy : { 
        type : DataTypes.INTEGER,
        validate : {
          isInt : {
            msg : "superficy doit etre un entier..."
          }
        }
       },
      capacity : { 
        type : DataTypes.INTEGER,
        validate : {
          isInt : {
            msg : "superficy doit etre un entier..."
          }
        }
       },
       attachments :{type : DataTypes.JSON}

    }, { onDelete : 'CASCADE' });
};

