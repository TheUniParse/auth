import { useState } from 'react'

export default function Admin() {
  const [message, setMessage] = useState('waiting...')

  return (
    <fieldset className='m-0  rounded-xl p-0 text-center'>
      <legend className='text-center text-3xl'>Admin authorization</legend>

      <button type='button' onClick={handler}>
        Request Admin Access
      </button>
      <br />

      <pre className='inline-block text-left'>{message}</pre>
    </fieldset>
  )

  async function handler(e: any) {
    e.preventDefault()

    const res = await fetch('http://localhost:3000/admin', {
      method: 'GET',
      credentials: 'include', // allow cookies
    })

    setMessage(
      `status: ${res.status} ${
        res.statusText
      }\n${await res.text()}`
    )
  }
}
