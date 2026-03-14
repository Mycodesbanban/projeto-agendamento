import React, { useState } from 'react'
import {Link} from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../../context/AuthContext"
import axios from 'axios'
const Agendamento = () => {
   const {agenda} = useContext(AuthContext)
  const [data, SetData] = useState("")
  const [horario, SetHorario] = useState("")
  const[horarioDisponivel, SetHorarioDisponivel] =useState([])
  const [servico, setServico] = useState("")
  const hoje = new Date().toISOString().split("T")[0]
  const buscarHorarios= async (data) =>{
    try{
      const response = await axios.get( `http://localhost:3000/disponiveis?data=${data}`)
      SetHorarioDisponivel(response.data.disponiveis)
    }catch(e){
      console.log(e)
    }
    }
 
 const handleSubmit = async(e) =>{
  e.preventDefault()
  const agendamento ={
    data, 
    horario,
    servico
  }
  await agenda(data, horario,servico)
  console.log(agendamento)
 }
  return (
    <div>

      <form onSubmit={handleSubmit}>
        <label>servico:

      <select value={servico} onChange={(e)=>setServico(e.target.value)} required>
      <option value="">Escolha um servico</option>
      <option value="corte">Corte de Cabelo</option>
      <option value="barba">Fazer a Barba</option>
      <option value="corte&Barba">Corte e Barba </option>
      </select>
        </label>
        <label>Data:<input type="date" value={data} min={hoje}
        onChange={(e)=>
          { SetData(e.target.value)
           buscarHorarios(e.target.value) }} required /></label>
        <select value={horario} onChange={(e)=>SetHorario(e.target.value)}>
          <option value="">Escolha um horario</option>
          {horarioDisponivel.map((h)=>(
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <button type="submit">Agendar</button>
      </form>

    </div>
  )
}

export default Agendamento