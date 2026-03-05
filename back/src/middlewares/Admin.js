const express = require("express")
// const app = express()
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Usuario = require("../models/UserModel")

module.exports = async function adminMiddleware(req, res , next){
    try {
        const user =await Usuario.findById(req.userId)
        if(user.role !=="admin"){
            return res.status(403).json({
                error:"voce nao e o admin"
            })
        }
        next()
      
    } catch (error) {
         return res.status(401).json({
            error:"token invalido"
        })
    }

}