import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {
  addUser,
  getUsers,
  getUser,
  hasUser,
  deleteUser
} from '../users.js'
import { log } from '../utilities.js'

// can be stored in database, but in memory faster !!
const SESSIONS = new Map()

const app = express()

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(cookieParser())

// get users ...........................................
app.get('/users', (req, res) => res.json(getUsers()))

// register / signUp ...................................
app.post('/register', async (req, res) => {
  const { username, password, email, role: rawRole } = req.body

  const unAvailable = hasUser({ username })
  if (unAvailable) return res.status(409) // Conflict
    .send(`sorry, the username ${username} already taken`)

  // passwordHash will be prefixed with salt with length of 10
  // so even if two passwords are the same, its hashes are not
  const passwordHash = await bcrypt.hash(password, 10)
  const id = crypto.randomUUID()

  const role = rawRole.toLowerCase()

  const newUser = { id, username, passwordHash, email, role }
  addUser(newUser)

  res.send(`${username} registered as ${role} !`)

  const time = new Date().toLocaleString()
  log(`${username} registered as ${role} at ${time}`)
})

// logIn / signIn ......................................
app.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = getUser({ username })
  if (!user) return res.status(401) // Unauthorized
    .send(`Cannot login, ${username} are not registered !`)

  const { passwordHash } = user
  const validPw = await bcrypt.compare(password, passwordHash)
  if (!validPw) return res.status(401) // Unauthorized
    .send(`Cannot login, Invalid password !`)

  // generate session
  const sessionId = crypto.randomUUID()
  SESSIONS.set(sessionId, user.id)

  res.cookie('sessionId', sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: 'none', // for test purposes
  }).send(`${username} logIn seccessfully`)

  const time = new Date().toLocaleString()
  log(`${username} logIn at ${time}\nsessionId: ${sessionId}`)
})

// logOut / signOut ....................................
app.delete('/logout', auth, (req, res) => {
  const { sessionId } = req.cookies
  SESSIONS.delete(sessionId)
  res.clearCookie('sessionId')

  const { id } = req.user
  const user = getUser({ id })
  const { username } = user
  res.send(`${username} logOut seccessfully`)
  log(`${username} logOut`)
})

// delete account ......................................
app.delete('/deleteAccount', auth, (req, res) => {
  const { sessionId } = req.cookies
  SESSIONS.delete(sessionId)
  res.clearCookie('sessionId')

  const { id } = req.user
  const user = getUser({ id })
  deleteUser({ id })

  const { username } = user
  res.send(`${username} deleted account seccessfully`)
  log(`${username} deleted account`)
})

// authorization .......................................
app.get('/admin', auth, (req, res) => {
  const { id } = req.user
  const user = getUser({ id })

  const { role } = user
  if (role !== 'admin') return res.status(403) // Forbidden
    .send(`sorry "${role}", only "admin" have access`)

  const { username } = user
  res.send(`${username} grents admin access`)
  log(`${username} grents admin access`)
})

// authentication middleware
function auth(req, res, next) {
  const { sessionId } = req.cookies
  if (!sessionId) return res.status(401) // Unauthorized
    .send('please login first !!')

  const id = SESSIONS.get(sessionId)
  if (!id) return res.status(401) // Unauthorized
    .send('please re-login first !!')

  req.user = { id }

  const user = getUser({ id })
  const { username } = user
  log(`${username} authenticated`)

  next()
}

app.listen(3000)