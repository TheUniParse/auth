
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
  hasUser,
  deleteUser
} from '../users.js'

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
  const { username, password, email, role } = req.body

  const unAvailable = hasUser({ username })
  if (unAvailable)
    return res.status(409) // Conflict
      .send(`sorry, the username ${username} already taken`)

  // hachedPw will be prefixed with salt with length of 10
  const hachedPw = await bcrypt.hash(password, 10)
  const id = crypto.randomUUID()

  const newUser = { id, username, hachedPw, email, role }
  addUser(newUser)

  res.send(`${username} registered as ${role} !`)

  const time = new Date().toLocaleString()
  console.log(`${username} registered as ${role} at ${time}`)
  console.log(`hached password: ${hachedPw}`)
})

// logIn / signIn ......................................
app.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = getUsers({ username })
  if (!user)
    return res.status(401)
      .send(`Cannot login, ${username} are not registered !`)

  const { hachedPw } = user
  const validPw = await bcrypt.compare(password, hachedPw)
  if (!validPw)
    return res.status(401)
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
  }).send(`${username} logged-in successfully`)

  const time = new Date().toLocaleString()
  console.log(`${username} logged-in at ${time}`)
  console.log(`jwt token: ${jwtToken}`)
})

// logOut / signOut ....................................
app.delete('/logout', jwtAuthentication, (req, res) => {
  res.clearCookie('jwtToken')

  const { id } = req.user
  const user = getUsers({ id })
  const { username } = user
  res.send(`${username} logged out seccessfully`)
  console.log(`${username} logged out seccessfully`)
})

// delete account ......................................
app.delete('/deleteAccount', jwtAuthentication, (req, res) => {
  res.clearCookie('jwtToken')

  const { id } = req.user
  const user = getUsers({ id })
  deleteUser({ id })

  const { username } = user
  res.send(`${username} deleted account seccessfully`)
  console.log(`${username} deleted account seccessfully`)
})

// authorization .......................................
app.get('/admin', jwtAuthentication, (req, res) => {
  const { id } = req.user
  const user = getUsers({ id })

  if (user.role !== 'admin')
    return res.status(403) // Forbidden
      .send('sorry, only admin have access')

  const { username } = user
  res.send(`${username} grents admin access`)
  console.log(`${username} grents admin access`)
})

// authentication middleware
function jwtAuthentication(req, res, next) {
  const { jwtToken } = req.cookies
  if (!jwtToken) return res.sendStatus(401) // Unauthorized

  try {
    const { JWT_KEY } = process.env
    const decoded = jwt.verify(jwtToken, JWT_KEY)
    const { id, iat } = decoded

    req.user = { id }

    const user = getUsers({ id })
    const { username } = user
    console.log(`${username} authenticated !`)
    const formatedIatTime = new Date(iat).toLocaleString()
    console.log(`jwtToken issued at ${formatedIatTime}`)

    next()
  }
  catch (err) {
    res.status(401).send(`Unauthorized, ${err.message}`)
  }
}

app.listen(3000)