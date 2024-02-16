/*import { useState, useEffect } from "react";
import { redirectToAuthCodeFlow, getAccessToken } from "./spotifyAuth";
import Logout from "./Logout";

interface Track {
  name: string;
  artists: Artist[];
  preview_url: string;
}

interface Artist {
  name: string;
}

const clientId = "9d34b1f66cb14b4cbdf6f6ee27a35f12";
const clientSecret = "477ae9886eb54377a797884030593168";
function Mix() {
 

  return (
    <div>
      <h1>Top 10 Tracks of Last Month</h1>
      <Logout />
    </div>
  );
}

export default Mix;*/
/*
import { useEffect, useState } from "react";
import { getAccessToken, redirectToAuthCodeFlow } from "./spotifyAuth";
import Logout from "./Logout";

interface Track {
  name: string;
  artists: Artist[];
  preview_url: string;
}

interface Artist {
  name: string;
}

const clientId = "9d34b1f66cb14b4cbdf6f6ee27a35f12";
const clientSecret = "477ae9886eb54377a797884030593168";

function Mix() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      redirectToAuthCodeFlow(clientId, clientSecret);
    } else {
      const fetchToken = async () => {
        try {
          const token = await getAccessToken(clientId, code, clientSecret);
          setAccessToken(token);
        } catch (error) {
          console.error("Error fetching access token:", error);
        }
      };
      fetchToken();
    }
  }, []);

  useEffect(() => {
    const fetchTopTracks = async () => {
      if (accessToken) {
        const currentDate = new Date();
        const lastMonthDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          currentDate.getDate()
        );
        const formattedLastMonthDate = lastMonthDate
          .toISOString()
          .split("T")[0];

        const result = await fetch(`https://api.spotify.com/v1/me/top/tracks`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await result.json();
        setTopTracks(data.items);
      }
    };

    fetchTopTracks();
  }, [accessToken]);

  return (
    <div>
      <h1>Top 10 Tracks of Last Month</h1>
      <div id="tracksContainer">
        {topTracks.map((track, index) => (
          <div key={index}>
            <h3>Track {index + 1}</h3>
            <p>Name: {track.name}</p>
            <p>
              Artist(s): {track.artists.map((artist) => artist.name).join(", ")}
            </p>
            <p>
              Preview URL: <a href={track.preview_url}>{track.preview_url}</a>
            </p>
            <hr />
          </div>
        ))}
        <Logout/>
      </div>
    </div>
  );
}*/

////use code below!!!!!!//

/*
import { useEffect } from "react";
const clientSecret = "477ae9886eb54377a797884030593168";
const clientId = "9d34b1f66cb14b4cbdf6f6ee27a35f12";
const redirectUrl = "http://localhost:5173/callback";
const authorizationEndpoint = "https://accounts.spotify.api/authorize";
const scope = "user-read-private user-read-email";
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
function Mix() {
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
      {!currentToken.access_token && (
        <div>
          <h1>Welcome Sillies</h1>
          <button onClick={loginWithSpotifyClick}>login</button>
        </div>
      )}
      {currentToken.access_token && (
        <div>
          <h1>Logged in as {currentToken.userProfile?.display_name}</h1>
          <button onClick={refreshTokenClick}>Refresh Token</button>
          <button onClick={logoutClick}>Log out</button>
        </div>
      )}
    </>
  );
}

export default Mix;
*/

import { useEffect, useState } from "react";
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
      scope:
        "user-read-private user-read-email user-top-read user-follow-read user-library-read",
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
      scope:
        "user-read-private user-read-email user-top-read user-follow-read user-library-read",
      refresh_token: currentToken.refresh_token!,
    }),
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
function Mix() {
  const [topTracks, setTopTracks] = useState<any[]>([]);

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
        const params = new URLSearchParams({
          time_range: "long_term",
          limit: "10",
        });
        const response = await fetch(
          //  "https://api.spotify.com/v1/me/top/tracks",
          "https://api.spotify.com/v1/me/top/tracks?time_range=short_term",
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
    console.log(fetchTopTracks());
  }, [currentToken.access_token]);

  /*const accessToken = currentToken.access_token; 

  const fetchTopTracks = async () => {
    try {
      const response = await fetch(
        'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10&offset=0',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
  
     // if (!response.ok) {
       // throw new Error('Failed to fetch top tracks');
      //}
  
      const data = await response.json();
      console.log(data); 
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
  };
  console.log(fetchTopTracks())
  //fetchTopTracks();
  
*/

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
      code_challenge_method: "S256",
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
      {/* {!currentToken.access_token && (
        <div>
          <h1>Welcome Sillies</h1>
          <Login />
        </div>
     )}*/}
      {currentToken.access_token && (
        <div>
          <h1>Logged in as {currentToken.userProfile?.display_name}</h1>
          <button onClick={refreshTokenClick}>Refresh Token</button>
          <button onClick={logoutClick}>Log out</button>
          <h2>Top 10 Tracks from the Last 10 Months</h2>
          <ul></ul>
          <ul>
            {topTracks.map((track: any, index: number) => (
              <li key={index}>
                {index + 1}. {track.name} by {track.artists[0].name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default Mix;
