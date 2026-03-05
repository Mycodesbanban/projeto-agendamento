const express = require("express")
const router = express.Router()
const agendamentoControll = require("../controllers/AgendamentoControll")
const authMiddleware = require("../middlewares/auth")
const adminMiddleware = require("../middlewares/Admin")


router.post("/", authMiddleware, agendamentoControll.agendamento)
router.get("/", authMiddleware, agendamentoControll.listar)
router.delete("/:id", authMiddleware, agendamentoControll.cancelarHorario)
router.get("/disponivel", authMiddleware, agendamentoControll.disponiveis)
router.put("/agendamentos/:id/cancelar", adminMiddleware, agendamentoControll.CancelarAgendamentos)
router.put("/agendamentos/:id/aceitar", adminMiddleware, agendamentoControll.AceitarAgendamentos)
console.log("agendamento carregado")
module.exports = router