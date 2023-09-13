import { useState } from 'react'

export default function Register({ updateUsers }: any) {
  const [username, setUsername] = useState('username1')
  const [password, setPassword] = useState('Password1')
  const [confirmPassword, setConfirmPassword] =
    useState('Password1')
  const [email, setEmail] = useState('username1@gmail.com')
  const [confirmEmail, setConfirmEmail] = useState(
    'username1@gmail.com'
  )
  const [role, setRole] = useState('Admin')
  const [message, setMessage] = useState('waiting...')

  return (
    <form onSubmit={handleSumbit}>
      <fieldset className='m-0  rounded-xl text-center'>
        <legend className='text-center text-3xl'>
          Registration
        </legend>

        <label className='mb-1 inline-block text-left'>
          email:
          <br />
          <input
            type='email'
            placeholder='email'
            pattern='^[\w\.-]+@[\w\.-]+\.\w+$'
            title='enter username@address.domain'
            required
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              setConfirmEmail('')
            }}
          />
        </label>
        <br />

        <label className='mb-1 inline-block text-left'>
          confirm email:
          <br />
          <input
            type='email'
            placeholder='confirm email'
            pattern={email}
            title='confirm email'
            required
            disabled={!email}
            value={confirmEmail}
            onChange={e => setConfirmEmail(e.target.value)}
            onPaste={e => e.preventDefault()}
          />
        </label>
        <br />
        <br />

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
        <br />

        <label className='mb-1 inline-block text-left'>
          password:
          <br />
          <input
            type='password'
            placeholder='password'
            pattern='^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[\w\W]{5,12}$'
            title='enter 5~12 characters, at least one UpperCase letter A~Z, LowerCase latter a~z, digit 0~9'
            required
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              setConfirmPassword('')
            }}
          />
        </label>
        <br />

        <label className='mb-1 inline-block text-left'>
          confirm password:
          <br />
          <input
            type='password'
            placeholder='confirm password'
            pattern={password}
            title='confirm password'
            required
            disabled={!password}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            onPaste={e => e.preventDefault()}
          />
        </label>
        <br />
        <br />

        <label className='mb-1 inline-block text-left'>
          role:{' '}
          <select
            required
            onChange={e => setRole(e.target.value)}>
            <option selected>Admin</option>
            <option>Guest</option>
          </select>
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

    const user = { username, password, email, role }
    const body = JSON.stringify(user)

    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      credentials: 'include', // allow cookies
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    updateUsers()
    setMessage(
      `status: ${res.status} ${
        res.statusText
      }\n${await res.text()}`
    )
  }
}
