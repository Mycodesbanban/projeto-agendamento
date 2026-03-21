const express = require("express")
const router = express.Router()
const agendamentoControll = require("../controllers/AgendamentoControll")
const authMiddleware = require("../middlewares/auth")
const adminMiddleware = require("../middlewares/Admin")


router.post("/", authMiddleware, agendamentoControll.agendamento)
router.get("/", authMiddleware, agendamentoControll.listar)
router.delete("/:id", authMiddleware, agendamentoControll.cancelarHorario)
router.get("/disponivel", authMiddleware, agendamentoControll.disponiveis)
router.put("/:id/cancelar",authMiddleware,  agendamentoControll.CancelarAgendamentos)
router.put("/:id/aceitar",authMiddleware, adminMiddleware, agendamentoControll.AceitarAgendamentos)
router.get("/admin",authMiddleware, adminMiddleware, agendamentoControll.admin)
console.log("agendamento carregado")
module.exports = router