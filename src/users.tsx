export default function Users({ users, updateUsers }: any) {
  return (
    <fieldset className='m-0  rounded-xl p-0 text-center'>
      <legend className='text-center text-3xl'>
        Users Accounts
      </legend>

      <button type='button' onClick={updateUsers}>
        Query Users Accounts
      </button>
      <br />

      {users.length ? (
        users.map((user: any) => (
          <details
            key={user.id}
            className='m-2 inline-block rounded-xl border-[thin] border-solid px-1'>
            <summary>{user.username}</summary>
            <ul className='text-left'>
              {Object.entries(user).map(([k, v]: any) => (
                <li key={k} className='break-all'>
                  <span className='text-cyan-500'>{k}</span>:{' '}
                  {v}
                </li>
              ))}
            </ul>
          </details>
        ))
      ) : (
        <p>no users</p>
      )}
    </fieldset>
  )
}
