import fs from 'fs'
import path from 'path'

const usersPath = path.join(process.cwd(), 'db', 'users.json')

export function getUsers({ username, id } = {}) {
  const usersJson = fs.readFileSync(usersPath, 'utf8')
  const users = JSON.parse(usersJson)

  if (!username && !id) return users

  const user = users.find(u => username
    ? u.username === username
    : u.id === id
  )

  return user
}

export function hasUser({ username, id }) {
  const users = getUsers()
  return users.some(u => username
    ? u.username === username
    : u.id === id
  )
}

export function addUser(user) {
  const users = getUsers()
  users.push(user)

  const usersJson = JSON.stringify(users, null, 2)
  fs.writeFileSync(usersPath, usersJson)
}

export function deleteUser({ username, id }) {
  const users = getUsers()

  const userIndex = users.findIndex(u => username
    ? u.username === username
    : u.id === id
  )
  if (userIndex !== -1) users.splice(userIndex, 1)

  const usersJson = JSON.stringify(users, null, 2)
  fs.writeFileSync(usersPath, usersJson)
}