const express = require("express")
const router = express.Router()
const agendamentoControll = require("../controllers/AgendamentoControll")
const authMiddleware = require("../middlewares/auth")


router.post("/", authMiddleware, agendamentoControll.agendamento)
router.get("/", authMiddleware, agendamentoControll.listar)
router.delete("/:id", authMiddleware, agendamentoControll.cancelarHorario)

console.log("agendamento carregado")
module.exports = router