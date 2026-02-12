const express = require("express")
// const app = express()
const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = function authMiddleware(req, res , next){
    const authHeader = req.headers.authorization
    if(!authHeader) {
        return res.status(401).json({
            error:"Token nao fornecido"
        })
    }

    const [, token] = authHeader.split(" ")
    try{

        const JwtVerify = jwt.verify(token, process.env.CHAVESECRETAJWT)
        req.userId= JwtVerify.userId

        next()
        console.log(req.headers)

    }
    
    catch(error){
        return res.status(401).json({
            error:"token invalido"
        })
    }

}