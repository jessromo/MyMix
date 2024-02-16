import { useEffect, useState } from "react";
import Logout from "./Logout";
import Login from "./Login";
const clientSecret = "477ae9886eb54377a797884030593168";
const clientId = "9d34b1f66cb14b4cbdf6f6ee27a35f12";
const redirectUrl = "http://localhost:5173/callback";
const authorizationEndpoint = "https://accounts.spotify.api/authorize";
const scope =
  "user-read-private user-read-email user-top-read user-follow-read user-library-read";
const tokenEndpoint = "https://accounts.spotify.com/api/token";

const currentToken = {
  get access_token() {
    return localStorage.getItem("access_token") || null;
  },
  get refresh_token() {
    return localStorage.getItem("refresh_token") || null;
  },
  get expires_in() {
    return localStorage.getItem("refresh_in") || null;
  },
  get expires() {
    return localStorage.getItem("expires") || null;
  },
  get userProfile() {
    const userProfileString = localStorage.getItem("user_profile");
    return userProfileString ? JSON.parse(userProfileString) : null;
  },
  save: function (response: any) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("expires_in", expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + expires_in * 1000);
    localStorage.setItem("expires", expiry.toString());
  },
  saveUserProfile: function (userProfile: any) {
    localStorage.setItem("user_profile", JSON.stringify(userProfile));
  },
};

const getToken = async (code: string) => {
  const code_verifier = localStorage.getItem("code_verifier");
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_secret: clientSecret,
      client_id: clientId,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUrl,
      code_verifier: code_verifier!,
    }),
  });

  return await response.json();
};

const refreshToken = async () => {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_secret: clientSecret,
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: currentToken.refresh_token!,
    }),
  });

  return await response.json();
};

const getUserData = async () => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: "Bearer " + currentToken.access_token },
  });

  return await response.json();
};

const getUserTop = async () => {
  const response = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?time_range=short_term",
    {
      method: "GET",
      headers: { Authorization: "Bearer " + currentToken.access_token },
    }
  );

  return await response.json();
};

function Plop() {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [searchKey, setSearchKey] = useState("");

  ////
  const [artists, setArtists] = useState<any[]>([]);

  const searchArtists = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = currentToken.access_token; // Make sure to get the token from your currentToken object

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchKey}&type=artist`, // Use searchKey state variable
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search for artists");
      }

      const data = await response.json();
      setArtists(data.artists.items);
    } catch (error) {
      console.error("Error searching for artists:", error);
    }
  };

  const renderArtists = () => {
    if (!artists) return null; // Handle case when artists is null or undefined

    return artists.map((artist: any) => (
      <div key={artist.id}>
        {artist.images.length ? (
          <img width={"100%"} src={artist.images[0].url} alt="" />
        ) : (
          <div>No Image</div>
        )}
        {artist.name}
      </div>
    ));
  };
  ////

  const fetchTopTracks = async () => {
    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${currentToken.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch top tracks");
      }

      const data = await response.json();
      setTopTracks(data.items);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  useEffect(() => {
    if (currentToken.access_token) {
      fetchTopTracks();
    }
  }, [currentToken.access_token]);

  const renderTopTracks = () => {
    return topTracks.map((track: any, index: number) => (
      <div key={index}>
        {index + 1}. {track.name} by {track.artists[0].name}
      </div>
    ));
  };

  ////

  useEffect(() => {
    const getCode = async () => {
      const args = new URLSearchParams(window.location.search);
      const code = args.get("code");
      if (code) {
        const token = await getToken(code);
        currentToken.save(token);

        const url = new URL(window.location.href);
        url.searchParams.delete("code");

        const updatedUrl = url.search ? url.href : url.href.replace("?", "");
        window.history.replaceState({}, document.title, updatedUrl);
      }
    };
    getCode();
  }, []);
  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const data = await getUserTop(); // Retrieve top tracks using the getUserTop function
        setTopTracks(data.items); // Set the retrieved top tracks in the state
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };
    if (currentToken.access_token) {
      fetchTopTracks();
    }
  }, [currentToken.access_token]); /*
    const fetchTopTracks = async () => {
      try {
        const params = new URLSearchParams({
          time_range: "long_term",
          limit: "10",
        });
        const response = await fetch(
          "https://api.spotify.com/v1/me/tracks?offset=0&limit=10",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + currentToken.access_token,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch top tracks");
        }
        const data = await response.json();
        setTopTracks(data.items);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };
    if (currentToken.access_token) {
      fetchTopTracks();
    }
  }, [currentToken.access_token]);*/

  const loginWithSpotifyClick = async () => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = Array.from(randomValues)
      .map((x) => possible[x % possible.length])
      .join("");

    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest("SHA-256", data);
    const code_challenge_base64 = btoa(
      String.fromCharCode(...new Uint8Array(hashed))
    )
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    window.localStorage.setItem("code_verifier", code_verifier);

    const authUrl = new URL(authorizationEndpoint);
    const params = {
      client_secret: clientSecret,
      response_type: "code",
      client_id: clientId,
      scope: scope,
      code_challenge_method: "S265",
      code_challenge: code_challenge_base64,
      redirect_uri: redirectUrl,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };
  const logoutClick = async () => {
    localStorage.clear();
    window.location.href = redirectUrl;
  };
  const refreshTokenClick = async () => {
    const token = await refreshToken();
    currentToken.save(token);
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Spotify React</h1>
          {!currentToken.access_token ? (
            <a
              href={`${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code`}
            >
              Login to Spotify
            </a>
          ) : (
            <>
              <h1>Logged in as {currentToken.userProfile?.display_name}</h1>
              <button onClick={refreshTokenClick}>Refresh Token</button>
              <Logout />
              <h2>Top 10 Tracks from the Last Month</h2>
              <ul>
                {topTracks.map((track: any, index: number) => (
                  <li key={index}>
                    {index + 1}. {track.name} by {track.artists[0].name}
                  </li>
                ))}
              </ul>
              <form onSubmit={searchArtists}>
                <input
                  type="text"
                  onChange={(e) => setSearchKey(e.target.value)}
                />
                <button type="submit">Search</button>
              </form>{" "}
              {renderTopTracks()}
              {renderArtists()}
            </>
          )}
        </header>
      </div>
    </>
  );
}

export default Plop;
