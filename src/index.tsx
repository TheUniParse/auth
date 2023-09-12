import ReactDOM from 'react-dom/client'
import './sass/main.scss'
import Register from './register'

const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(
  <form
    className='m-1 rounded-xl border-solid border-red-300 p-2
      text-center'>
    <Register />
  </form>
)
