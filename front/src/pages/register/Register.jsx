import React from 'react'
import { useState } from 'react'
import AuthContext from '../../context/AuthContext'
import { useContext } from 'react'


const Register = () => {
    const {register} = useContext(AuthContext)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const handleSumbit=async(e)=>{
        e.preventDefault()
        if(password !== confirmPassword){
            setError("a senha nao esta igual")
            return
        }
        try {
            await register(name, email, password)
        } catch (error) {
            setError(error.response.data.error)
        }
      
        await register(name,email, password)

    }
  return (
    <div>
        <form onSubmit={handleSumbit}>
            {error && (
                <p>{error}</p>
            )}
            <label name="name">
                <span>Nome:</span>
                <input type="text" name='name' required placeholder='Digite seu nome' value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label name="email">
                <span>E-mail:</span>
                <input type="email" name='email' required placeholder='Digite seu E-mail' value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
             <label name="password">
                <span>Senha:</span>
                <input type="password" name='password' required placeholder='Digite sua senha' value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
             <label name="confirmpassword">
                <span>Confirme sua Senha:</span>
                <input type="password" name='confirmpassword' required placeholder='Confirme sua senha' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </label>
            <button className='btn'>Criar</button>
        </form>
    </div>
  )
}

export default Register