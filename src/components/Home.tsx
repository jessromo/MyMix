//import Login from "./Login";
//import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const Home = () => {
  let handleClick = () => {
    window.location.href =
      "https://accounts.spotify.com/authorize?client_id=9d34b1f66cb14b4cbdf6f6ee27a35f12&response_type=code&redirect_uri=http://localhost:5173/callback&scope=user-read-private%20user-read-email";
  };

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mixify</title>

        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div className="container">
          <div id="login">
            <h1>Mixify</h1>
            <h2>Top Track Mixtape Generator</h2>
           
            
            <button onClick={handleClick}> Login with Spotify</button>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Home;
