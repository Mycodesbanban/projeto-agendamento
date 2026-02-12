const express = require("express")
const app = express()
const router = express.Router()
const authMiddleware = require("../middlewares/auth")
const userControll = require("../controllers/UserControll")

router.post("/", userControll.createUser )
console.log("rota /register carregada")

module.exports = router