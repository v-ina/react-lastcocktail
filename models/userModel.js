

module.exports = (sequelize, DataTypes)=>{
    return sequelize.define ('user',{
        name : {
            type : DataTypes.STRING,
            allowNull : false,
            noUpdate : true,
            unique : {
                msg : 'username est deja pris'
            },
            validate : {
                notEmpty : {
                    msg : 'user name ne peut pas etre vide'
                }
            }
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false,
            validate : {
                len : {
                    args : [8],
                    msg : 'password doit avoir plus de 8 caracteres.'
                }
            }
        },  
        age : {
            type : DataTypes.INTEGER,
            validate : {
                isInt : {
                    msg : "age doit etre un integer"
                },
                min : {
                    args : 1,
                    msg : "age doit etre plus de 1an"
                } // args를 0으로 했을 때 에러가 났음. 아마도 정수만 규정하는 애랑 confilt가 있었을 듯.
            }
        },
        email : {
            type : DataTypes.STRING
        }
    },  {
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withPassword: {
                attributes: {}
            }
        }
    } // 여기 얘네들 괄호 조심 scope를 sttributes랑 같은 레벨에 넣었더니 못읽었음.
    )
}