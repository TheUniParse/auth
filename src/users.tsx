import useSWR from 'swr'
import domain from './domain'

export default function Users({ updateUsers }: any) {
  const url = `${domain}/users`
  const { data: users, error } = useSWR(url, async url => {
    const res = await fetch(url)
    const data = await res.json()
    return data
  })

  return (
    <fieldset className='m-0 flex min-w-[13em] flex-col items-center rounded-xl text-center'>
      <legend>
        <h2>Users Accounts</h2>
      </legend>

      <button type='button' onClick={updateUsers}>
        Refetch
      </button>
      <br />

      <UsersHandler users={users} error={error} />
    </fieldset>
  )
}

function UsersHandler({ users, error }: any) {
  if (error) return <p>server down!!, failed to load users</p>
  if (!users) return <p>Loading...</p>
  if (!users.length) return <p>no users</p>
  return users.map((u: any) => <User key={u.id} user={u} />)
}

function User({ user }: any) {
  return (
    <details className='m-1 inline-block rounded-xl border-[thin] border-solid px-2'>
      <summary>{user.username}</summary>

      <ul className='text-left'>
        {Object.entries(user).map(([k, v]: any) => (
          <li key={k} className='break-all'>
            <span className='text-cyan-500'>{k}</span>: {v}
          </li>
        ))}
      </ul>
    </details>
  )
}
