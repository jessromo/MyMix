import { useEffect, useState } from "react";
import "../App.css";
import Nav from "./Nav";

const clientSecret = "477ae9886eb54377a797884030593168";
const clientId = "9d34b1f66cb14b4cbdf6f6ee27a35f12";
/*const redirectUrl = "http://localhost:5176/callback";*/
const redirectUrl = "https://mymix.netlify.app/callback";

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
    const expiry = new Date(now.getTime() + expires_in * 1000000);
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
      scope: scope,
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

const getUserProfile = async () => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + currentToken.access_token,
    },
  });

  return await response.json();
};

function getDate() {
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });

  return `${month}`;
}

function Mix() {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [currentDate] = useState(getDate());
  const [timeRange, setTimeRange] = useState("short_term");

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

        window.location.reload();
      }
    };
    getCode();
  }, []);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=10`,
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
    } else if (currentToken.refresh_token) {
      refreshToken()
        .then((token) => {
          currentToken.save(token);
          fetchTopTracks();
        })
        .catch((error) => {
          console.error("Error refreshing token:", error);
        });
    }
  }, [currentToken.access_token, timeRange]);

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
      <Nav />
      {currentToken.access_token && (
        <div>
          <div className="container">
            <div className="time-range-selector">
              <button onClick={() => setTimeRange("short_term")}>
                Last Month
              </button>
              <button onClick={() => setTimeRange("medium_term")}>
                Last 6 Months
              </button>
              <button onClick={() => setTimeRange("long_term")}>
                Last Year
              </button>
            </div>
            <div className="title">
              <h2>
                Top 10 tracks from the last{" "}
                {timeRange === "short_term"
                  ? "month"
                  : timeRange === "medium_term"
                  ? "6 months"
                  : "year"}
              </h2>
            </div>
            <div className="mixtape">
              <div className="case">
                <h2 id="title">
                  {currentToken.userProfile?.display_name}'s {currentDate} mix
                  tape
                </h2>
                <div className="tracklist">
                  <ul id="track-list">
                    {topTracks.map((track, index) => (
                      <li key={index} id={`track-${index}`}>
                        {index + 1}. {track.name} - {track.artists[0].name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="cd">
                <img src="cd.png" id="cdpic" alt="CD" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Mix;
