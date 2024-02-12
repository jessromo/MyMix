// Callback.js

import React, { useEffect } from "react";
import queryString from "query-string";

const REDIRECT_URI = "http://localhost:5173/callback";

const Callback = () => {
  useEffect(() => {
    const { code } = queryString.parse(window.location.search);
    if (code) {
      // You can now use the authorization code to exchange for an access token
      // Send a request to your server to exchange the code for an access token
      // For simplicity, we'll log the code to the console
      console.log("Authorization code:", code);
    }
  }, []);

  return (
    <div>
      <h2>Callback</h2>
      <p>Processing...</p>
    </div>
  );
};

export default Callback;
