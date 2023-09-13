import { useState } from 'react'

export default function Login() {
  const [username, setUsername] = useState('username1')
  const [password, setPassword] = useState('Password1')
  const [message, setMessage] = useState('waiting...')

  const user = { username, password }

  return (
    <form onSubmit={handleSumbit}>
      <fieldset className='m-0  rounded-xl p-0 text-center'>
        <legend className='text-center text-3xl'>LogIn</legend>

        <label className='mb-1 inline-block text-left'>
          username:
          <br />
          <input
            type='text'
            placeholder='username'
            pattern='\w{5,12}'
            title='enter 5~12 characters: a~z or 0~9 or _'
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
        <br />

        <input type='submit' />
        <br />

        <pre className='inline-block text-left'>{message}</pre>
      </fieldset>
    </form>
  )

  async function handleSumbit(e: any) {
    e.preventDefault()

    const body = JSON.stringify(user)
    const res = await fetch('http://localhost:3000/login', {
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
