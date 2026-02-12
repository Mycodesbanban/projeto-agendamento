const Usuario = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()

const userControll = {
    async  createUser(req, res){ // cria o usuario
        try{
            const {nome, email, password} = req.body;
            if(!nome || !email || !password){
                return res.status(400).json({
                    error:"O nome email e senha sao obrigatorios"
                })
            }
            
            const UserExisting = await Usuario.findOne({email});
            if(UserExisting){
                return res.status(409).json({
                    error:"email esta sendo utilizado"
                })
            }
            if(password.length < 8 || password.length > 32){
                return res.status(400).json({
                    error:"a senha precisar ter entre 8 e 32 caracteres"
                })
            }
            
            const PasswordHash = await bcrypt.hash(req.body.password,12)
            await Usuario.create({
                nome,
                email,
                password:PasswordHash
            })
        }catch(error){
            return res.status(500).json({
                error:error
            })
        }
        res.send("usuario criado com sucesso!")
    },

    async LoginUser(req, res){
        try{
            const {email , password} = req.body
            if(!email || !password ){
                return res.status(400).json({
                    error:"email e senha sao obrigatorios "
                })
            }
            const user = await Usuario.findOne({
                email: email
            })
            if(!user){
                return res.status(401).json({
                    error:"dados invalidos"
                })
            }   
            const passwordCorret =  await bcrypt.compare(password, user.password)
            if(passwordCorret === false){
                return res.status(401).json({
                    error:"dados invalidos"
                })
            }
            const payload ={
                userId: user._id
            }
            const token = jwt.sign(payload,process.env.CHAVESECRETAJWT, {expiresIn:"1d"})
            return res.status(200).json({
                token,
                user:{
                    id:user._id,
                    nome:user.nome,
                    email:user.email
                }
            })
        } catch(error){
            return res.status(500).json({
                error:error})
        }

    }

}
module.exports = userControll