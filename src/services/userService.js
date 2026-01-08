const User = require('../models/UserModel');

const getUser = async({id,email}) =>{
    let query = {}
    if(id){
        query._id = id
    }
    if(email){
        query.email = email
    }

    if(!id && !email){
        throw new Error(`User id or user email required.`)
    }

    return await User.findOne(query).select('-password')
}

module.exports ={
    getUser
}