import queryString from "query-string";

const CLIENT_ID = "9d34b1f66cb14b4cbdf6f6ee27a35f12";
const REDIRECT_URI = "http://localhost:5173/callback";
//const REDIRECT_URI = "https://mixerfy.vercel.app/callback";

const Home = () => {
  const handleLogin = () => {
    const queryParams = queryString.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope:
        "user-read-private user-read-email user-top-read user-follow-read user-library-read",
    });
    const authUrl = `https://accounts.spotify.com/authorize?${queryParams}`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <h1>Mixify</h1>
      <h2>A mixtape of your top tracks</h2>
      <button onClick={handleLogin}>Log in with Spotify</button>
    </div>
  );
};

export default Home;
