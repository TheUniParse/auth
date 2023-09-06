
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

import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// simulate database
const USERS = []

// can be stored in database, but in memory faster !!
const SESSIONS = new Map()

const app = express()

app.use(express.json())
app.use(cors({
  origin: 'http://192.168.1.3:5500',
  credentials: true
}))
app.use(cookieParser())

// get users ...........................................
app.get('/users', (req, res) => res.json(USERS))

// register / signup ...................................
app.post('/signup', async (req, res) => {
  const { name, password } = req.body
  const hachedPw = await bcrypt.hash(password, 10)
  // hachedPw will be prefixed with salt with length of 10

  const user = { name, hachedPw }
  USERS.push(user)
  res.status(200).send(`${name} registered!`)

  console.log(`registered ${name} ${hachedPw}`)
})

// login / signin ......................................
app.post('/login', async (req, res) => {
  const { name, password } = req.body

  const user = USERS.find(user => user.name === name)

  if (!user) return res
    .status(400)
    .send(`Cannot login\nUnRegistered ${name}`)

  const samePw = await bcrypt.compare(password, user.hachedPw)
  // extract salt from user.hachedPw
  // hach password with that solt
  // compare the new hached-passsword with user.hachedPw

  if (!samePw) res.send(`Cannot login\nIncorrect password`)

  const sessionId = crypto.randomUUID()
  SESSIONS.set(sessionId, user)

  res.cookie('sessionId', sessionId, {
    secure: true, // https
    httpOnly: true, // no client javascript access
    sameSite: 'none',
  }).send(`${name} logged-in successfully`)

  console.log(`${name} logged-in successfully\n${sessionId}`)
})

app.get('/adminData', (req, res) => {
  const { sessionId } = req.cookies

  const user = SESSIONS.get(sessionId)

  // unAuthorized
  if (!user)
    return res.sendStatus(401)

  res.send('admin data')

})

app.listen(3000)