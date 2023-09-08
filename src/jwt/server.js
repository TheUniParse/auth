
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
import bcrypt from 'bcrypt'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
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
  const { name, password, role } = req.body
  const hachedPw = await bcrypt.hash(password, 10)
  // hachedPw will be prefixed with salt with length of 10

  const user = { name, hachedPw, role }

  // check if user exist
  const userExist = USERS.some(user => user.name === name)
  if (userExist)
    return res.send(`sorry, the username ${name} already taken`)

  USERS.push(user)
  res.status(200).send(`${name} registered as ${role} !`)

  const time = new Date().toLocaleString()
  console.log(`registered ${name} as ${role} at ${time}`)
  console.log(`hached password: ${hachedPw}`)
})

// login / signin ......................................
app.post('/login', async (req, res) => {
  const { name, password } = req.body

  const user = USERS.find(user => user.name === name)
  if (!user)
    return res.status(401).send(`Cannot login, UnRegistered ${name}`)

  const validPw = await bcrypt.compare(password, user.hachedPw)
  if (!validPw)
    return res.status(401).send(`Cannot login, Invalid password`)

  // generate jwt token
  const { JWT_KEY } = process.env
  const payload = { name }
  const signOptions = {
    notBefore: 20,
    expiresIn: '30s',
  }
  const jwtToken = jwt.sign(payload, JWT_KEY, signOptions)

  res.cookie('jwtToken', jwtToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'none', // for test purposes
  }).send(`${name} logged-in successfully`)

  const time = new Date().toLocaleString()
  console.log(`${name} logged-in at ${time}`)
  console.log(`jwt token: ${jwtToken}`)
})

// logout / signout
app.post('/logout', (req, res) => {
  const { jwtToken } = req.cookies

  if (!jwtToken)
    return res.sendStatus(401) // Unauthorized

  const { JWT_KEY } = process.env
  let decoded
  try {
    decoded = jwt.verify(jwtToken, JWT_KEY)
  } catch (err) {
    return res.status(401).send(`Unauthorized, ${err.message}`)
  }

  const { name, iat } = decoded
  res.clearCookie('jwtToken')
  res.send(`${name} logged out seccessfully`)

  console.log(`${name} logged out seccessfully`)
  const formatedIatTime = new Date(iat).toLocaleString()
  console.log(`jwtToken issued at ${formatedIatTime}`)
})

// delete account
app.delete('/deleteAccount', (req, res) => {
  const { jwtToken } = req.cookies

  if (!jwtToken)
    return res.sendStatus(401) // Unauthorized

  const { JWT_KEY } = process.env
  let decoded
  try {
    decoded = jwt.verify(jwtToken, JWT_KEY)
  } catch (err) {
    return res.status(401).send(`Unauthorized, ${err.message}`)
  }

  const { name, iat } = decoded

  // delete user from USERS
  const userIndex = USERS.findIndex(u => u.name === name)
  if (userIndex !== -1) USERS.splice(userIndex, 1)

  res.clearCookie('jwtToken')
  res.send(`${name} deleted account seccessfully`)

  console.log(`${name} deleted account seccessfully`)
  const formatedIatTime = new Date(iat).toLocaleString()
  console.log(`jwtToken issued at ${formatedIatTime}`)
})

// authorization
app.get('/admin', (req, res) => {
  const { jwtToken } = req.cookies

  if (!jwtToken)
    return res.sendStatus(401) // Unauthorized

  const { JWT_KEY } = process.env
  let decoded
  try {
    decoded = jwt.verify(jwtToken, JWT_KEY)
  } catch (err) {
    return res.status(401).send(`Unauthorized, ${err.message}`)
  }

  const { name, iat } = decoded
  const user = USERS.find(user => user.name === name)

  if (user.role !== 'admin')
    return res.sendStatus(403) // Forbidden

  res.send(`${name} grents access to admin data`)

  console.log(`${name} grents access to admin data`)
  const formatedIatTime = new Date(iat).toLocaleString()
  console.log(`jwtToken issued at ${formatedIatTime}`)
})

app.listen(3000)