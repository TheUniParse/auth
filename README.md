# authentication

## Usage
- clone my repository <code>git clone "https://github.com/TheUniParse/auth"</code>
- install the dependencies <code>pnpm i</code>
- run the front-end server (react & vite) <code>pnpm dev</code>
- run the back-end server (express) <code>pnpm session</code> or <code>pnpm jwt</code>


## authentication process
- Register/SignUp: create new account
  - client submit Form [ email, username, password, ... ]
  - server add user to database

- LogIn/SignIn: (lets say we have multiple devices)
  - First login:
    - client submit form [ username, password ]
    - server responds with cookie (sessionId / jsonWebToken)
  - Subsequent login's:
    - client send just cookie (sessionId / jsonWebToken)

- LogOut/SignOut:
  - client send request, including cookie (sessionId / jsonWebToken)
  - server responds with clearCookie (sessionId / jsonWebToken)
    - client remove cookie (sessionId / jsonWebToken)
    - server remove sessionId from memory/database
    - or server add jsonWebToken to blacklist

- delete account:  
  - same process as LogOut/SignOut
  - and server remove user from database


## security notes
 - JWT are stateless (server don't store it)
 - sessions are statefull (server store it)
 - stored in secure httpOnly cookie (no access to client js)
 - ⚠️ cookie can be manual accessed (devTools/application/cookies)