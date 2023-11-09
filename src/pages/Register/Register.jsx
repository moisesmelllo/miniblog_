import { useAuthentication } from '../../hooks/useAuthentications'
import styles from './Register.module.css'

import { useState, useEffect } from 'react'

const Register = () => {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')

  // firebase
  const {createUser, error: authError, loading} = useAuthentication();

  useEffect(() => {
    const limparEstado = () => {
      setError('')
    }

    if(error) {
    const timer = setTimeout(limparEstado, 5000);
    return () => clearTimeout(timer)
    }
    
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    const user = {
      displayName,
      email,
      password
    }

    if(password !== confirmPassword) {
      setError('As senhas precisam ser iguais!!')
    }

    const res = await createUser(user)

    console.log(res);
  }

  useEffect(() => {
    if(authError) {
      setError(authError)
    }
  }, [authError])

  return (
    <div className={styles.register}>
      <h1>Cadastre-se para postar</h1>
      <p>Crie seu usuario e compartilhe suas historias</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Name: </span>
          <input 
            type="text" 
            name='displayName' 
            required 
            placeholder='Nome do usuario'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
        <label>
          <span>email: </span>
          <input 
            type="email" 
            name='email'
            required
            placeholder='Digite seu email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>password: </span>
          <input 
            type="password" 
            name='password'
            required
            placeholder='Digite sua senha'  
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          <span>Confirm password: </span>
          <input 
            type="password" 
            name='confirmPassword'  
            required
            placeholder='Confirme sua senha'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        {loading ? 
          <button className='btn'>Aguarde...</button> : 
          <button className='btn'>Cadastrar</button>
        }
        {error && <p className='error'>{error}</p>}
      </form>
    </div>
  )
}

export default Register