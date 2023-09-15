import { useState } from 'react'
import domain from './domain'
import Legend from './legend'

export default function Login({ setMessage }: any) {
  const [username, setUsername] = useState('username1')
  const [password, setPassword] = useState('Password1')

  const user = { username, password }

  return (
    <>
      <Legend border='dashed'>Entering</Legend>

      <form onSubmit={handleSumbit} className='mb-5 px-3'>
        <label className='mb-1 inline-block text-left'>
          username:
          <br />
          <input
            type='text'
            placeholder='username'
            value={username}
            required
            onChange={e => setUsername(e.target.value)}
          />
        </label>
        <br />

        <label className='mb-1 inline-block text-left'>
          password:
          <br />
          <input
            type='password'
            placeholder='password'
            pattern='^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[\w\W]{5,12}$'
            title='enter 5~12 characters: a~z or 0~9 or _'
            required
            value={password}
            onChange={e => {
              setPassword(e.target.value)
            }}
          />
        </label>
        <br />

        <input
          className='mt-3'
          type='submit'
          value='LogIn / SignIn'
        />
      </form>
    </>
  )

  async function handleSumbit(e: any) {
    e.preventDefault()

    const body = JSON.stringify(user)
    const res = await fetch(`${domain}/login`, {
      method: 'POST',
      credentials: 'include', // allow cookies
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    setMessage(
      `status: ${res.status} ${
        res.statusText
      }\n${await res.text()}`
    )
  }
}
