import ReactDOM from 'react-dom/client'
import './sass/main.scss'
import App from './app'

const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement as HTMLElement)
root.render(<App />)
