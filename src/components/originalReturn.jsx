return (
    <>
      {currentToken.access_token && (
        <div className="everything">
          <h2 id="tts">Top 10 tracks from the last month</h2>
          <div className="mixtape">
            <div id="bar"></div>
            <div className="case">
              <h2 id="title">
                {currentToken.userProfile?.display_name}'s {currentDate} mix
                tape
              </h2>
              <ul id="listy">
                {topTracks.map((track, index) => (
                  <li key={index} id={`track-${index}`}>
                    {index + 1}. {track.name} - {track.artists[0].name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="cd">
              <img src="cd.png" id="cdpic" alt="CD" />
            </div>
          </div>
          <div className="logout">
            <button id="logoutbutton" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      )}
    </>
  );