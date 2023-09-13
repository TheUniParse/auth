import { useState } from 'react'
import Admin from './admin'
import Leave from './leave'
import Login from './login'
import Register from './register'
import Users from './users'

export default function App() {
  const [users, setUsers] = useState([])

  return (
    <div>
      <Users users={users} updateUsers={updateUsers} />
      <Register updateUsers={updateUsers} />
      <Login />
      <Admin />
      <Leave updateUsers={updateUsers} />
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
