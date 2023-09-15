
/** authentication process
 * signUp/register: create new account (add user to database)
 *   (email, new username, new password)
 * 
 * signIn/logIn: lets say we have multipli devices
 *   first login: (email / username, password)
 *   subsequent login's: cookie (session based / jsonWebToken)
 * 
 * signOut/logOut: remove cookie (session based / jsonWebToken)
 * 
 * delete account: remove user from database
 */

/** security notes
 * JWT are stateless (server don't store it)
 * stored in secure httpOnlyt cookie (no access to client js)
 * ⚠️ cookie can manual accessed (devTools/application/cookies)
 */

import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import {
  addUser,
  getUsers,
  getUser,
  hasUser,
  deleteUser
} from '../users.js'
import { log } from '../utilities.js'

const app = express()

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173', // for test purpose
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

  // generate jwt token
  const { JWT_KEY } = process.env
  const payload = { id: user.id }
  const options = {
    notBefore: 2, // 2s
    expiresIn: '2m', // 14d
  }
  const jwtToken = jwt.sign(payload, JWT_KEY, options)

  res.cookie('jwtToken', jwtToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'none', // for test purposes
  }).send(`${username} logIn seccessfully`)

  const time = new Date().toLocaleString()
  log(`${username} logIn at ${time}\nJWT token: ${jwtToken}`)
})

// logOut / signOut ....................................
app.delete('/logout', auth, (req, res) => {
  res.clearCookie('jwtToken')

  const { id } = req.user
  const user = getUser({ id })
  const { username } = user
  res.send(`${username} logOut seccessfully`)
  log(`${username} logOut`)
})

// delete account ......................................
app.delete('/deleteAccount', auth, (req, res) => {
  res.clearCookie('jwtToken')

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
  const { jwtToken } = req.cookies
  if (!jwtToken) return res.status(401) // Unauthorized
    .send('please login first !!')

  try {
    const { JWT_KEY } = process.env
    const decoded = jwt.verify(jwtToken, JWT_KEY)
    const { id, iat } = decoded

    req.user = { id }

    const user = getUser({ id })
    const { username } = user
    const time = new Date(iat).toLocaleString()
    log(`${username} authenticated\nJWT issued at ${time}`)

    next()
  }
  catch (err) {
    res.status(401).send(`please re-login first, ${err.message}`)
  }
}

app.listen(3000)