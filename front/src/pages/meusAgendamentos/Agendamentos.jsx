import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import React from 'react'


const Agendamentos = () => {
    const {meusAgendamentos} = useContext(AuthContext)
    const [agendamento, setAgendamento] = useState([])
    const [token, setToken] = useState(()=> localStorage.getItem("token"))  
    
    const carregarAgendamentos = async() =>{
        const data = await meusAgendamentos()
        setAgendamento(data)
    }
    const CancelarAgendamento = async(id) =>{
        const response = await axios.put(`http://localhost:3000/${id}/cancelar`,{},{ headers:{
            Authorization:`Bearer ${token}`
        }})
        await carregarAgendamentos()
        return response.data 
        
    }
    useEffect(()=>{
        carregarAgendamentos()
    }, [])
  return (
    <div>
        <h2>Meus agendamentos</h2>
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
            {ag.status ==="ativo" && (
            <button onClick={()=>CancelarAgendamento(ag._id)}>
                Cancelar
            </button>
            )}

            </div>
        ))}
    </div>
  )
}

export default Agendamentos