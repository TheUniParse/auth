import domain from "./domain"

export default function Admin({ setMessage }: any) {
  return (
    <fieldset className='m-0  rounded-xl text-center'>
      <legend className='text-center text-3xl'>
        Authorization
      </legend>

      <button type='button' onClick={handler}>
        Request Admin Access
      </button>
    </fieldset>
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
