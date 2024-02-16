import queryString from "query-string";

const CLIENT_ID = "9d34b1f66cb14b4cbdf6f6ee27a35f1";
const REDIRECT_URI = "http://localhost:5173/callback";

const Logout = () => {
  const handleLogout = () => {
    // Redirect to the Spotify logout endpoint
    const queryParams = queryString.stringify({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
    });
    const logoutUrl = `https://accounts.spotify.com/logout?${queryParams}`;
    window.location.href = logoutUrl;
  };

  return (
    <div>
 
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Logout;
