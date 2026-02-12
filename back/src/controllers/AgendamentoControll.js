const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Agenda = require("../models/AgendaModel")
// const middleware = require("../middlewares/auth")

const agendamentoControll = {
    async agendamento(req, res) {
        try{
            const userId = req.userId
            const {servico, horario, data} = req.body
            if(!servico || !horario || !data){
                return res.status(400).json({
                    error:"nao foram encontrados dados"
                })
    
            }
            const [hora, minuto] = horario.split(":").map(Number)

            const dataHoraAgendamento = new Date(data)
            dataHoraAgendamento.setHours(hora, minuto, 0, 0)
            const agora = Date.now()
            const agendamentoTime = dataHoraAgendamento.getTime()

            if (agora > agendamentoTime) {
                return res.status(401).json({
                    error: "nao e possivel agendar no passado"
                })
            }
            
            const horas = dataHoraAgendamento.getHours()
            if(horas >= 19 || horas < 8){
                return res.status(401).json("nao e possivel agendar antes do horario")
            }


            const horarioExist = await Agenda.findOne({ horario: dataHoraAgendamento })
            
            if(horarioExist){
                return res.status(400).json({
                    error:"ja existe um horario marcado"
                })
            }  
            
        await Agenda.create({
        userId,
        servico,
         horario: dataHoraAgendamento,
          data: dataHoraAgendamento})


            res.status(200).json({
                sucess:"agendamento criado",
                status:"ativo"
            })

        } catch(error){
            res.status(500).json({
                error:"ocorreu um error na montagem de seu agendamento tente novamente mais tarde"
            })
        }
        
    },
    async listar(req, res){
        try{
            const userId = req.userId
            const agendamentos= await Agenda.find({userId}).sort({data:1, horario:1})
            return res.status(200).json(agendamentos)

        }catch(error){
            res.status(500).json({
                error:"erro no listamento"
            })
        }
    },
    async cancelarHorario(req, res) {
        try{

            const {id}= req.params
            const agendamento = await Agenda.findById(id)
            if(!agendamento){
                return res.status(404).json({
                    error:"nao foi encontrado"
                })
            }
            if( agendamento.userId.toString() !== req.userId){
              return res.status(403).json({
                    error:"agendamento nao encontrado"
                })
            }

            const Data = Date.now()
            const agendamentoData = new Date(agendamento.data)
            const agendamentoHorario = new Date(agendamento.horario)
            
            agendamentoData.setHours(
                agendamentoHorario.getHours(),
                agendamentoHorario.getMinutes(),
                0,
                0
            )
            const agendamentoTime = agendamentoData.getTime()

            const limeteCancelamento = agendamentoTime - 7200000
            if(Data >= limeteCancelamento){
                return res.status(401).json({
                    error:"so pode cancelar antes de 2 horas"
                })
            }
            if(agendamento.status !== "ativo"){
                return res.status(401).json({
                    error:"ja foi cancelado esse agendamento"
                })
            }
            agendamento.status = "cancelado"
            await agendamento.save()

           return res.status(200).json({
                sucess:"agendamento cancelado",
            })
        }catch(error){
        return res.status(500).json({
            error:"ocorreu um erro tente novamente mais tarde"
        }) 
        }

    }
}

module.exports = agendamentoControll