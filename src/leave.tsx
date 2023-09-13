export default function Leave({
  updateUsers,
  setMessage,
}: any) {
  return (
    <fieldset className='m-0  rounded-xl text-center'>
      <legend className='text-center text-3xl'>Leaving</legend>

      <button type='button' onClick={e => handler(e, 'logout')}>
        LogOut / SignOut
      </button>
      <br />
      <br />

      <button
        className='text-red-300'
        type='button'
        onClick={e => handler(e, 'deleteAccount')}>
        Delete Account
      </button>
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
