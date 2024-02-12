const Spotify = () => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mixify</title>
        <link rel="stylesheet" href="styles.css" />
      </head>
      <body>
        <div className="container">
          <h1>Receiptify</h1>
          <h2>Top Track Generator</h2>
          <div id="options">
            <button className="btn time-btn" id="short_term">
              Last Month
            </button>
            <button className="btn time-btn" id="medium_term">
              Last 6 Months
            </button>
            <button className="btn time-btn" id="long_term">
              All Time
            </button>
          </div>
          <div id="receipt">
            <div className="receiptContainer" id="shortTermReceipt">
              <h2 className="logo">RECEIPTIFY</h2>
              <p className="period">Short Term Period</p>
              <p className="date">ORDER #000123 FOR User Name</p>
              <p className="date">Short Term Time</p>
              <table className="tracks">
                <thead>
                  <tr>
                    <td className="begin">QTY</td>
                    <td>ITEM</td>
                    <td className="length">AMT</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="begin">1</td>
                    <td className="name">
                      Track Name - <span>Artist Name</span>
                    </td>
                    <td className="length">Duration</td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
                <tfoot>
                  <tr className="total-counts">
                    <td >
                      ITEM COUNT:
                    </td>
                    <td className="length">10</td>
                  </tr>
                  <tr className="total-counts-end">
                    <td >
                      TOTAL:
                    </td>
                    <td className="length">Total Amount</td>
                  </tr>
                </tfoot>
              </table>
              <p className="date">CARD #: **** **** **** 2023</p>
              <p className="date">AUTH CODE: 123421</p>
              <p className="date">CARDHOLDER: User Name</p>
              <div className="thanks">
                <p>THANK YOU FOR VISITING!</p>
                <img src="barcode.png" alt="barcode" />
                <p className="website">receiptify.herokuapp.com</p>
              </div>
            </div>
            {/* Repeat similar structure for mediumTermReceipt and longTermReceipt */}
          </div>
          <button className="btn time-btn" id="download">
            Download Image
          </button>
        </div>
        <script src="server.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.1/handlebars.min.js"></script>
        <script src="https://code.jquery.com/jquery-1.10.1.min.js"></script>
        <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
        <script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"></script>
        <script src="dom-to-image.min.js"></script>
      </body>
    </html>
  );
};

export default Spotify;
