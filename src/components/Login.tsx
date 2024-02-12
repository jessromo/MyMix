import queryString from "query-string";

const CLIENT_ID = "9d34b1f66cb14b4cbdf6f6ee27a35f1";
const REDIRECT_URI = "http://localhost:5173/callback";

const Login = () => {
  const handleLogin = () => {
    const queryParams = queryString.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: "user-read-private user-read-email",
    });
    const authUrl = `https://accounts.spotify.com/authorize?${queryParams}`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <h2>Login with Spotify</h2>
      <button onClick={handleLogin}>Log in</button>
    </div>
  );
};

export default Login;
