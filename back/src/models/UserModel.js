const mongoose = require("mongoose")

const {Schema} = mongoose

const usuarioModel = new Schema({
    nome:{
        type:String,
        required:true,
    },
    email:{
        type: String,
        lowercase :true,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
},
{timestamps:true}
)
const Usuario = mongoose.model("Usuario", usuarioModel)

module.exports = Usuario;