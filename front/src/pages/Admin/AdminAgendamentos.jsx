import React from 'react'
import { useContext, useState, useEffect} from 'react'
import AuthContext from '../../context/AuthContext'
import axios from 'axios'

const AdminAgendamentos = () => {
  const { user } = useContext(AuthContext)
  const { admin } = useContext(AuthContext)
  const [agendamento, setAgendamento] = useState([])
  const [token, setToken] = useState(()=> localStorage.getItem("token"))  
  const mostraAgendamento = async() => {
    const data = await admin()
    setAgendamento(data)
     
  }
  const CancelarAgendamento = async(id) =>{
          const response = await axios.put(`http://localhost:3000/${id}/cancelar`,{},{ headers:{
              Authorization:`Bearer ${token}`
          }})
          await mostraAgendamento()
          return response.data 
          
      }
  const aceitarAgendamentos = async(id) =>{
          const response = await axios.put(`http://localhost:3000/${id}/aceitar`,{},{ headers:{
              Authorization:`Bearer ${token}`
          }})
          await mostraAgendamento()
          return response.data 
          
      }
        useEffect(()=>{
              mostraAgendamento()
          }, [])
  return (
    <div>
        { user && user.role==="admin" ? (
            <div>
        {agendamento.length === 0 &&(
            <p>Voce nao possui agendamentos </p>
        )}

        {agendamento.map((ag) =>(
            <div key={ag._id}>
            <p>
                <b>Servico:</b> {ag.servico}
            </p>
              <p>
                <b>Data:</b> {""} {new Date(ag.data).toLocaleDateString()}
            </p>
            <p>
                <b>Horario:</b> {""} {new Date(ag.horario).toLocaleTimeString([],{
                    hour:"2-digit",
                    minute:"2-digit"
                })}
            </p>
            <p><b>Status:</b>{ag.status}</p>
            {ag.status ==="pendente" && (
              <div>

            <button onClick={()=>CancelarAgendamento(ag._id)}>
                Cancelar
            </button>
               <button onClick={()=>aceitarAgendamentos(ag._id)}>
                aceitar
            </button>
              </div>
            )}
            </div>
        ))}</div>
        ): (
            <div><p>Acesso Negado</p></div>
        )}

    </div>
        
  )
}

export default AdminAgendamentos