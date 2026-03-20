import React from 'react'
import AuthContext from '../../context/AuthContext'
const { user } = useContext(AuthContext)

const AdminAgendamentos = () => {
  return (
    <div>
        {user.role==="admin" ? (
            <div></div>
        ): (
            <div><p>Acesso Negado</p></div>
        )}

    </div>
        
  )
}

export default AdminAgendamentos