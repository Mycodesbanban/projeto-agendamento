const express = require("express")
const app = express()
const router = express.Router()
const authMiddleware = require("../middlewares/auth")
const userControll = require("../controllers/UserControll")



router.post("/", userControll.LoginUser)
console.log("login carregando")
module.exports = router