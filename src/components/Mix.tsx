import { useEffect, useState } from "react";
import "../App.css";
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

const getUserProfile = async () => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + currentToken.access_token,
    },
  });

  return await response.json();
};

function Mix() {
  const [topTracks, setTopTracks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10",
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
  }, [currentToken.access_token]);

  //// Pulls users profile information,, use this to display "user's mix"

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        currentToken.saveUserProfile(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (currentToken.access_token) {
      fetchUserProfile();
    }
  }, [currentToken.access_token]);

  return (
    <>
      {currentToken.access_token && (
        <div>
          <h1 id="loggedIn">
            Logged in as {currentToken.userProfile?.display_name}
          </h1>

          <h2 id="trackFrom">Top 10 Tracks from the Last Months</h2>
          <ul className="topTracks">
            {topTracks.map((track: any, index: number) => (
              <li key={index}>
                {index + 1}. {track.name} - {track.artists[0].name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default Mix;
