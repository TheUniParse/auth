import { useState } from 'react'

export default function Leave({ updateUsers }: any) {
  const [message, setMessage] = useState('waiting...')

  return (
    <fieldset className='m-0  rounded-xl p-0 text-center'>
      <legend className='text-center text-3xl'>
        LogOut / Delete Account
      </legend>

      <button type='button' onClick={e => handler(e, 'logout')}>
        LogOut
      </button>
      <br />
      <br />

      <button
        className='text-red-300'
        type='button'
        onClick={e => handler(e, 'deleteAccount')}>
        Delete Account
      </button>
      <br />

      <pre className='inline-block text-left'>{message}</pre>
    </fieldset>
  )

  async function handler(e: any, route: string) {
    e.preventDefault()

    const res = await fetch(`http://localhost:3000/${route}`, {
      method: 'DELETE',
      credentials: 'include', // allow cookies
    })

    updateUsers()
    setMessage(
      `status: ${res.status} ${
        res.statusText
      }\n${await res.text()}`
    )
  }
}
