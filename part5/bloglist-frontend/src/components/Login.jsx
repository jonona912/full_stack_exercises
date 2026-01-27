const Login = ({ handleLogin, username, setUsername, password, setPassword }) => (
  <form onSubmit={(event) => {
    event.preventDefault()
    handleLogin({ username, password })
  }}>
    <div>
      <label>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </label>
    </div>
    <div>
      <label>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </label>
    </div>
    <button id="login-button" type="submit">
      Login
    </button>
  </form>
)

export default Login
