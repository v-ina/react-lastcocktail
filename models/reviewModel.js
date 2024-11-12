module.exports = (sequelize, DataTypes)=>{
    return sequelize.define('review', {
        content : {
            type : DataTypes.STRING
        },
        rating : {
            type : DataTypes.INTEGER,
            validate : {
                max : 5,
                min : 0
            }
        }
    }, {updatedAt : false})
}