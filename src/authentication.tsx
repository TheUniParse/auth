import Authorization from './authorization'
import Leave from './leave'
import Login from './login'

export default function Authentication({
  updateUsers,
  setMessage,
}: any) {
  return (
    <fieldset className='m-0 rounded-xl p-0 pb-3 text-center'>
      <legend>
        <h2>Authentication</h2>
      </legend>

      <Login setMessage={setMessage} />
      <Authorization setMessage={setMessage} />
      <Leave
        updateUsers={updateUsers}
        setMessage={setMessage}
      />
    </fieldset>
  )
}
