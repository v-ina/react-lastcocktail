module.exports = (sequelize, DataTypes)=>{
    return sequelize.define('role', {
        label : {
            type : DataTypes.STRING
        },

    },        
    {
        // updatedAt : false,
        // createdAt : false
        timestamps : false
    }
    )
}