const express = require("express")
const app = express()
const connectDB = require("./src/config/db")

// rotas
const createUser = require("./src/routes/CreateUser")
const LoginUser = require("./src/routes/Login")
const agendamentoRotas = require("./src/routes/Agendamento")

app.use(express.json())
connectDB()

app.use("/register", createUser)
app.use("/login", LoginUser)
app.use("/agenda", agendamentoRotas )


app.listen(3000, ()=>{
    console.log("servidor rodando na porta 3000")
})