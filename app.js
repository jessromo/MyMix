const express = require("express");
const request = require("request");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const client_id = process.env.clientID;
const client_secret = "477ae9886eb54377a797884030593168";
const privateKey = fs.readFileSync("AuthKey_A8FKGGUQP3.p8").toString();
const teamId = process.env.teamId;
const keyId = process.env.keyId;

let redirect_uri = process.env.redirect_uri || "http://localhost:5173/callback";
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated stringh
 */
let generateRandomString = function (length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

let stateKey = "spotify_auth_state";

let app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.get("/login", function (req, res) {
  let state = generateRandomString(16);
  res.cookie(stateKey, state);

  let scope =
    "user-read-private user-read-email user-top-read playlist-modify-public";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        let access_token = body.access_token,
          refresh_token = body.refresh_token;

        res.redirect(
          "/#" +
            querystring.stringify({
              client: "spotify",
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.send("There was an error during authentication.");
      }
    });
  }
});

app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

app.listen(process.env.PORT || 5173, function () {
  console.log("Server is running on port 5173");
});

{
  /*
import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to ensure useEffect runs only once on component mount

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>React App with Data Fetching</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Data:</h2>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;*/
}
