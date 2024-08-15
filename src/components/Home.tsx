import queryString from "query-string";
import "../App.css";
const CLIENT_ID = "9d34b1f66cb14b4cbdf6f6ee27a35f12";
/*const REDIRECT_URI = "http://localhost:5176/callback";*/
const REDIRECT_URI = "https://mymix.netlify.app/callback";
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
    <>
      <div className="login">
        <div className="login-title">
          <h1 > MyMix</h1>
        </div>
        <h2 className="quickdesc">A mixtape of your top tracks!</h2>
        <div className="btn">
        <button onClick={handleLogin} className="login-btn">Log in with Spotify</button>
      </div></div>
    </>
  );
};

export default Home;
