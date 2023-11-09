import styles from './Login.module.css'

import { useEffect, useState } from 'react'
import { useAuthentication } from '../../hooks/useAuthentications'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // firebase
  const {login, error: authError, loading} = useAuthentication();

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
    e.preventDefault();

    setError('');

    const user = {
      email,
      password
    }

    const res = await login(user)

    console.log(res);
  }

  useEffect(() => {
    if(authError) {
      setError(authError)
    }
  }, [authError])

  return (
    <div className={styles.login}>
      <h1>Entrar</h1>
      <p>Faça login para poder utilizar o sistema</p>
      <form onSubmit={handleSubmit}>
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
        {loading ? 
          <button className='btn'>Aguarde...</button> : 
          <button className='btn'>Entrar</button>
        }
        {error && <p className='error'>{error}</p>}
      </form>
    </div>
  )
}

export default Login