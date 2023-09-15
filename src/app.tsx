import { useState } from 'react'
import { mutate } from 'swr'
import Register from './register'
import Users from './users'
import Log from './log'
import domain from './domain'
import Authentication from './authentication'

export default function App() {
  const [message, setMessage] = useState('Waiting...')
  const updateUsers = () => mutate(`${domain}/users`)

  return (
    <div className='mb-[7em] flex flex-wrap items-start justify-evenly selection:bg-transparent selection:text-yellow-400'>
      <Register
        updateUsers={updateUsers}
        setMessage={setMessage}
      />
      <Authentication
        updateUsers={updateUsers}
        setMessage={setMessage}
      />

      <Users updateUsers={updateUsers} />

      <Log message={message} />
    </div>
  )
}
