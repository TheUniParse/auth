const loginBtn = document.getElementById('login')
const getAdminDataBtn = document.getElementById('getAdminData')
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const output = document.getElementById('output')


let username = usernameInput.value
let password = passwordInput.value


usernameInput.addEventListener('change', e =>
  username = e.target.value
)

passwordInput.addEventListener('change', e =>
  password = e.target.value
)

loginBtn.addEventListener('click', async () => {
  const user = { username, password }

  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    credentials: 'include', // allow cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })

  if (res.status !== 200) return output.textContent =
    `failed with status code ${res.status}\n${res.statusText}`

  // loginBtn.disabled = true
  getAdminDataBtn.disabled = false

  output.textContent = await res.text()
}, { once: false })

getAdminDataBtn.addEventListener('click', async () => {
  const res = await fetch(
    'http://localhost:3000/adminData',
    {
      credentials: 'include',
      headers: { 'Content-Text': 'application/json' }
    }
  )

  output.textContent = await res.text()
}, { once: false })