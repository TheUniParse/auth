import { useState } from 'react'

export default function Users() {
  const [users, setUsers] = useState([])

  return (
    <fieldset className='m-0  rounded-xl p-0 text-center'>
      <legend className='text-center text-3xl'>Users</legend>

      <button type='button' onClick={handler}>
        Query Users
      </button>
      <br />
      <br />

      {users.map((user: any) => (
        <details key={user.id} className='mb-2'>
          <summary>{user.username}</summary>
          <ul className='text-left'>
            <li>username: {user.username}</li>
            <li>email: {user.email}</li>
            <li>hached password: {user.hachedPw}</li>
            <li>role: {user.role}</li>
          </ul>
        </details>
      ))}
    </fieldset>
  )

  async function handler(e: any) {
    e.preventDefault()

    const res = await fetch('http://localhost:3000/users', {
      method: 'GET',
      credentials: 'include', // allow cookies
    })

    if (res.status === 200) setUsers(await res.json())
    else console.log(res.status, res.statusText)
  }
}
