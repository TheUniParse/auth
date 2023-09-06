import express from 'express'
import bcrypt from 'bcrypt'

// simulate database
const users = []

const app = express()

app.use(express.json())

app.get('/users', (req, res) => res.json(users))

// register / signup
app.post('/users/signup', async (req, res) => {
  const { name, password } = req.body
  const hachedPw = await bcrypt.hash(password, 10)
  // hachedPw will be prefixed with salt with length of 10

  const user = { name, hachedPw }
  users.push(user)
  res.status(200).send(`${name} registered!`)

  console.log(`registered ${name} ${hachedPw}`)
})

// login / signin
app.post('/users/login', async (req, res) => {
  const { name, password } = req.body

  const user = users.find(user => user.name === name)
  if (!user) return res
    .status(400)
    .send(`Cannot login\nUnRegistered ${name}`)

  const samePw = await bcrypt.compare(password, user.hachedPw)
  // extract salt from user.hachedPw
  // hach password with that solt
  // compare the new hached-passsword with user.hachedPw

  if (!samePw) res.send(`Cannot login\nIncorrect password`)

  res.send(`${name} logged-in successfully`)
  console.log(`${name} logged-in successfully`)
})

app.listen(3000)