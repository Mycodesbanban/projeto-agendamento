const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Agenda = require("../models/AgendaModel")
const Usuario = require("../models/UserModel")
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
          
            const dataHoraAgendamento = new Date(`${data}T${horario}:00`)
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
            
            const limite30dias = agora + 2592000000
            const dataAgendamento = dataHoraAgendamento.getTime()
            if(dataAgendamento > limite30dias){
                return res.status(401).json({
                    error:"so e possivel agendar com 30 dias de antecendia"
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
            const {horario, data} = req.body
            const dataHoraAgendamento = new Date(`${data}T${horario}:00`)
            const horarioOcupado = await Agenda.findOne({horario:dataHoraAgendamento})
            if(horarioOcupado){
                return res.status(400).json({
                    error:"horario reservado"
                })
            }else{
                  res.status(500).json({
                error:"ocorreu um error na montagem de seu agendamento tente novamente mais tarde"
            })
            }
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

    },
    async disponiveis (req, res ){
        try{
            const { data } =req.query
            const horarioDisponivel=["08:00", "09:00", "10:00", "11:00", "12:00", "13:00","14:00", "15:00","16:00","17:00","18:00"]
            if(!data ){
                return res.status(400).json({
                    error:"error"
                })
            }
            
            const incioDoDia = new Date(data)
            incioDoDia.setHours(0,0,0,0)
            const fimDoDia = new Date(data)
            fimDoDia.setHours(23,59,59,999)
            const agendamentosDisponivels = await Agenda.find({horario:{$gte:incioDoDia,$lte:fimDoDia},status:"ativo" })
            const horarioOcupados = agendamentosDisponivels.map(ag =>{
                const hora = ag.horario.getHours().toString().padStart(2,"0")
                const minuto = ag.horario.getMinutes().toString().padStart(2,"0")
                return `${hora}:${minuto}`
            })
            const horarioLivre = horarioDisponivel.filter(
                hora => !horarioOcupados.includes(hora)
            )
            let horariosFiltrados = horarioLivre
            const hoje = new Date()
            const hojeFormanto = hoje.toISOString().split("T")[0]
            if(data === hojeFormanto){
                const horaAtual = hoje.getHours().toString().padStart(2,"0")
                const MinutoAtual = hoje.getMinutes().toString().padStart(2,"0")
                const horaFormada = `${horaAtual}:${MinutoAtual}`
                horariosFiltrados = horarioLivre.filter(
                    hora => hora > horaFormada
                )
            }
            res.status(200).json({
                data, 
                disponiveis:horariosFiltrados
            })

        }catch(error){
            return res.status(500).json({
                error:error
            })
        }

    },
    async AceitarAgendamentos (req, res){
        try {
            const {id} = req.params
            const agendamento = await Agenda.findById(id)
            if(!agendamento){
                return res.status(404).json({
                    error:"nao foi localizado nenhum agendamento"
                })
            }
            if(agendamento.status !=="pendente"){
                return res.status(400).json({
                    error:"esse agendamento ja foi processado"
                })
            }
            agendamento.status = "ativo"
            await agendamento.save()
            return res.json({
                message:"agendamento aceito com sucesso",
                agendamento
            })
            
        } catch (error) {
            return res.status(500).json({
                error:"erro interno no servidor tente novamente mais tarde"
            })
        }


    },
    async CancelarAgendamentos(req, res ) {
        try {
            
            const {id} = req.params
            const agendamento = await Agenda.findById(id)
            if(agendamento.status !=="pendente"){
                    return res.status(400).json({
                        error:"esse agendamento ja foi processado"
                    })
                }
            if(agendamento.status === "cancelado"){
                return res.status(403).json({
                    error:"o profissional cancelou seu agendamemto"
                })
            }
            agendamento.status = "cancelado"
            await agendamento.save()
            return res.json({
                message:"agendamento cancelado com sucesso",
                agendamento
            })
        } catch (error) {
             return res.status(500).json({
                error:"erro interno no servidor tente novamente mais tarde"
            })
        }
    }
}

module.exports = agendamentoControll