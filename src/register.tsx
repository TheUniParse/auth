import { useState } from 'react'

export default function Register() {
  const [username, setUsername] = useState('username1')
  const [password, setPassword] = useState('password1')
  const [email, setEmail] = useState('username1@gmail.com')
  const [role, setRole] = useState('admin')
  const [message, setMessage] = useState('waiting...')

  const user = { username, password, email, role }

  return (
    <fieldset className='m-0  rounded-xl p-0 text-center'>
      <legend className='text-center text-3xl'>
        Registration
      </legend>

      <label className='mb-1 inline-block text-left'>
        username:
        <br />
        <input
          type='text'
          placeholder='username'
          value={username}
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
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </label>
      <br />

      <label className='mb-1 inline-block text-left'>
        email:
        <br />
        <input
          type='email'
          placeholder='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <br />

      <label className='mb-1 inline-block text-left'>
        role:
        <br />
        <input
          type='text'
          placeholder='role'
          value={role}
          onChange={e => setRole(e.target.value)}
        />
      </label>
      <br />
      <br />

      <input type='submit' onClick={handleSumbit} />
      <br />
      <br />

      <pre className='inline-block text-left'>{message}</pre>
    </fieldset>
  )

  async function handleSumbit(e: any) {
    e.preventDefault()

    const body = JSON.stringify(user)
    const res = await fetch('http://localhost:3000/register', {
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
