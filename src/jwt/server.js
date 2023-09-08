
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

import express from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

dotenv.config()

// simulate database
const USERS = []

const app = express()

app.use(express.json())
app.use(cors({
  origin: 'http://192.168.1.3:5500', // for test purpose
  credentials: true
}))
app.use(cookieParser())

// get users ...........................................
app.get('/users', (req, res) => res.json(USERS))

// register / signup ...................................
app.post('/signup', async (req, res) => {
  const { email, username, password, role } = req.body
  const hachedPw = await bcrypt.hash(password, 10)
  // hachedPw will be prefixed with salt with length of 10

  const user = { email, username, hachedPw, role }

  // check if user exist
  const userExist = USERS.some(u => u.usename === username)
  if (userExist)
    return res.send(`sorry, the username ${username} already taken`)

  USERS.push(user)
  res.status(200).send(`${username} registered as ${role} !`)

  const time = new Date().toLocaleString()
  console.log(`${username} registered as ${role} at ${time}`)
  console.log(`hached password: ${hachedPw}`)
})

// login / signin ......................................
app.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = USERS.find(u => u.username === username)
  if (!user)
    return res.status(401)
      .send(`Cannot login, ${username} are not registered !`)

  const validPw = await bcrypt.compare(password, user.hachedPw)
  if (!validPw)
    return res.status(401)
      .send(`Cannot login, Invalid password !`)

  // generate jwt token
  const { JWT_KEY } = process.env
  const payload = { username }
  const signOptions = {
    notBefore: 20,
    expiresIn: '30s',
  }
  const jwtToken = jwt.sign(payload, JWT_KEY, signOptions)

  res.cookie('jwtToken', jwtToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'none', // for test purposes
  }).send(`${username} logged-in successfully`)

  const time = new Date().toLocaleString()
  console.log(`${username} logged-in at ${time}`)
  console.log(`jwt token: ${jwtToken}`)
})

// logout / signout
app.post('/logout', jwtAuthentication, (req, res) => {
  const { username } = req.user

  res.clearCookie('jwtToken')
  res.send(`${username} logged out seccessfully`)

  console.log(`${username} logged out seccessfully`)
})

// delete account
app.delete('/deleteAccount', jwtAuthentication, (req, res) => {
  const { username } = req.user

  // delete user from USERS
  const index = USERS.findIndex(u => u.username === username)
  if (index !== -1) USERS.splice(index, 1)

  res.clearCookie('jwtToken')
  res.send(`${username} deleted account seccessfully`)

  console.log(`${username} deleted account seccessfully`)
})

// authorization
app.get('/admin', jwtAuthentication, (req, res) => {
  const { username } = req.user
  const user = USERS.find(u => u.username === username)

  if (user.role !== 'admin')
    return res.sendStatus(403) // Forbidden

  res.send(`${username} grents access to admin data`)
  console.log(`${username} grents access to admin data`)
})

// authentication middleware
function jwtAuthentication(req, res, next) {
  const { jwtToken } = req.cookies
  if (!jwtToken) return res.sendStatus(401) // Unauthorized

  try {
    const { JWT_KEY } = process.env
    const decoded = jwt.verify(jwtToken, JWT_KEY)
    const { username, iat } = decoded

    req.user = { username }

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