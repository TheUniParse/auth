import domain from './domain'

export default function Leave({
  updateUsers,
  setMessage,
}: any) {
  return (
    <fieldset className='m-0  rounded-xl text-center'>
      <legend className='text-center text-3xl'>Leaving</legend>

      <button type='button' onClick={() => handler('logout')}>
        LogOut / SignOut
      </button>
      <br />
      <br />

      <button
        className='text-red-300'
        type='button'
        onClick={() => handler('deleteAccount')}>
        Delete Account
      </button>
    </fieldset>
  )

  async function handler(route: string) {
    const res = await fetch(`${domain}/${route}`, {
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
