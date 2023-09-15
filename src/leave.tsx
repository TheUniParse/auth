import domain from './domain'
import Legend from './legend'

export default function Leave({
  updateUsers,
  setMessage,
}: any) {
  return (
    <>
      <Legend border='dashed'>Leaving</Legend>

      <button className='my-2' type='button' onClick={() => handler('logout')}>
        LogOut / SignOut
      </button>
      <br />

      <button
        className='text-red-300'
        type='button'
        onClick={() => handler('deleteAccount')}>
        Delete Account
      </button>
    </>
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
