import React from 'react'
import { useState } from 'react'
import AuthContext from '../../context/AuthContext'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
    const {login} = useContext(AuthContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const handleSumbit=async(e)=>{
        e.preventDefault()
        if(!password){
            setError("a senha esta incorreta")
            return
        }
        if(!email){
            setError("email esta incorreto")
            return
        }
        await login(email, password)
    }
  return (
    <div>
        {error && (
            <p>{error}</p>
        )}
        <form onSubmit={handleSumbit}>
            <label name="email">
                <span>E-mail:</span>
                <input type="email" name='email' required placeholder='Digite seu E-mail' value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
             <label name="password">
                <span>Senha:</span>
                <input type="password" name='password' required placeholder='Digite sua senha' value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <p>Nao tem uma conta? <Link to="/register">Clique Aqui</Link></p>
            <button className='btn'>entrar</button>
        </form>
    </div>
  )
}

export default Login