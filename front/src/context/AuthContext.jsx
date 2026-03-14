
import { createContext, useState,  useEffect } from 'react'
import axios from "axios"
export  const AuthContext = createContext()

// Provider

export const AuthContextProvider = ({children}) =>{
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(()=> localStorage.getItem("token"))
    const [loading, setLoading] = useState(true)
    const login = async (email, password) =>{
        const response = await axios.post("http://localhost:3000/login" , {
            email,
            password
        })
        const receivedToken = response.data.token
        localStorage.setItem("token", receivedToken)
        setToken(receivedToken)
        await fetchUser(receivedToken)
    }
    const agenda = async(data,horario, servico)=> {
        if(!token){
    throw new Error("Usuário não autenticado")
  }
      const response=  await axios.post("http://localhost:3000/agenda",{
        data,
        horario,
        servico
      },{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      return response.data
      
    }

    const register = async (nome,email, password) =>{
        const response = await axios.post("http://localhost:3000/register" , {
            nome,
            email,
            password
        })
        const receivedToken = response.data.token
        localStorage.setItem("token", receivedToken)
        setToken(receivedToken)
        await fetchUser(receivedToken)
    }
    const fetchUser = async(authToken)=>{
        try {
            const response = await axios.get("http://localhost:3000/me",{
                headers:{
                    Authorization:`Bearer ${authToken}`
                }
            })
            setUser(response.data)
        } catch (e) {
            logout()
        }finally{
            setLoading(false)
        }
    }
      const logout = () =>{
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
    }
    useEffect(()=>{
        if(token){
            fetchUser(token)
        }else{
            setLoading(false)
        }
    },[token])
    return(
    <AuthContext.Provider value={{user, token, login,register, logout, loading, agenda}}>
        {!loading && children}
    </AuthContext.Provider>
    )
}

export default AuthContext