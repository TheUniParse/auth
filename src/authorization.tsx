import domain from './domain'
import Legend from './legend'

export default function Authorization({ setMessage }: any) {
  return (
    <>
      <Legend border='dashed'>Authorization</Legend>

      <button className='mt-2' type='button' onClick={handler}>
        Request Admin Access
      </button>
      <br />
      <br />
    </>
  )

  async function handler() {
    const res = await fetch(`${domain}/admin`, {
      method: 'GET',
      credentials: 'include', // allow cookies
    })

    setMessage(
      `status: ${res.status} ${
        res.statusText
      }\n${await res.text()}`
    )
  }
}
