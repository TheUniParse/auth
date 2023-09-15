# authentication

<details>
  <summary>
    <h2>intro</h2>
  </summary>

I built 2 express servers to authenticate users by cookies.
- the first server based on the __statefull__ session's.
  1. the server generate sessionId.
  2. then store it in memory/database.
  3. then send it to the client User-Agent as cookie.
- the secound server based on the __stateless__ JsonWebToken'e.
  1. the server generate jwtToken.
  2. then send it to the client User-Agent as cookie.
</details>

<details>
  <summary>
    <h2>authentication process</h2>
  </summary>

- Register/SignUp: create new account
  - client submit Form [ email, username, password, ... ]
  - server add user to database

- LogIn/SignIn: (lets say we have multiple devices)
  - First login:
    - client submit form [ username, password ]
    - server send cookie to user-agent
  - Subsequent login's:
    - client user-agent send just cookie

- LogOut/SignOut:
  - client send request (including cookie in requset)
  - server responds with clearCookie()
    - client user-agent remove the cookie
    - server-1 remove sessionId from memory/database
    - server-2 add jwtToken to blacklist

- delete account:
  - same process as LogOut/SignOut
  - and server remove user from database
</details>

<details>
  <summary>
    <h2>⚠️ security notes</h2>
  </summary>

even that the cookie are stored as: __secure__ (https) and __httpOnly__ (no client javascript access)  
__hackers__ still can be manual access it, thought devTools / application / cookies
</details>

## Usage
- clone my repository <code>git clone "https://github.com/TheUniParse/auth"</code>
- install the dependencies <code>pnpm i</code>
- run the front-end server (react & vite) <code>pnpm dev</code>
- run the back-end server (express) <code>pnpm session</code> or <code>pnpm jwt</code>
