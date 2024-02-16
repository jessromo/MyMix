
import React, { useState, useEffect } from 'react';


interface Track {
  id: string;
  name: string;
  artist: string;
}

const TopTracks: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [timeRange, setTimeRange] = useState<string>('short_term');

  useEffect(() => {
    // Function to retrieve user's information and access token
    const authenticateUser = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDisplayName(response.data.display_name);
      } catch (error) {
        console.error('Error authenticating user:', error);
      }
    };

    // Call the authentication function
    authenticateUser();
  }, [accessToken]);

  useEffect(() => {
    // Function to retrieve user's top tracks
    const retrieveTopTracks = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const tracksData = response.data.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          artist: item.artists.map((artist: any) => artist.name).join(', '),
        }));
        setTopTracks(tracksData);
      } catch (error) {
        console.error('Error retrieving top tracks:', error);
      }
    };

    // Call the function to retrieve top tracks
    if (accessToken) {
      retrieveTopTracks();
    }
  }, [accessToken, timeRange]);

  const handleLogin = () => {
    // Simulated login function, sets the access token
    const token = 'YOUR_ACCESS_TOKEN_FROM_SPOTIFY';
    setAccessToken(token);
  };

  return (
    <div>
      {accessToken ? (
        <div>
          <h2>{`Welcome, ${displayName}!`}</h2>
          <div>
            <button onClick={() => setTimeRange('short_term')}>
              Short Term
            </button>
            <button onClick={() => setTimeRange('medium_term')}>
              Medium Term
            </button>
            <button onClick={() => setTimeRange('long_term')}>
              Long Term
            </button>
          </div>
          <h3>Top Tracks ({timeRange})</h3>
          <ul>
            {topTracks.map((track) => (
              <li key={track.id}>{`${track.name} - ${track.artist}`}</li>
            ))}
          </ul>
        </div>
      ) : (
        <button onClick={handleLogin}>Log in with Spotify</button>
      )}
    </div>
  );
};

export default TopTracks;
