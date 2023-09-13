import { useState } from 'react'
import Admin from './admin'
import Leave from './leave'
import Login from './login'
import Register from './register'
import Users from './users'
import Log from './log'

export default function App() {
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('Waiting...')

  return (
    <div className='selection:bg-transparent selection:text-yellow-400'>
      <h1>Authentication</h1>
      <div className='mb-[7em] grid grid-flow-dense gap-x-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        <Register
          updateUsers={updateUsers}
          setMessage={setMessage}
        />
        <Login setMessage={setMessage} />
        <Leave
          updateUsers={updateUsers}
          setMessage={setMessage}
        />
        <Admin setMessage={setMessage} />
        <Users users={users} updateUsers={updateUsers} />
      </div>
      <Log message={message} />
    </div>
  )

  async function updateUsers() {
    const res = await fetch('http://localhost:3000/users', {
      method: 'GET',
      credentials: 'include', // allow cookies
    })

    if (res.status === 200) setUsers(await res.json())
    else console.log(res.status, res.statusText)
  }
}
