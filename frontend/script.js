document.getElementById('scrape-button').addEventListener('click', async () => {
  const response = await fetch('http://localhost:3000/run-scrape');
  const data = await response.json();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `
    These are the most happening topics as on ${data.date} - - - - - <br>
    Name of trend1: ${data.trends[0]} <br>
    Name of trend2: ${data.trends[1]} <br>
    Name of trend3: ${data.trends[2]} <br>
    Name of trend4: ${data.trends[3]} <br>
    Name of trend5: ${data.trends[4]} <br>
    The IP address used for this query was : ${data.ipAddress}. <br>
    Here’s a JSON extract of this record from the MongoDB: <br>
    <pre>${JSON.stringify(data, null, 2)}</pre>
    <button id="scrape-again-button">Click here to run the query again</button>
  `;

  document.getElementById('scrape-again-button').addEventListener('click', () => {
    location.reload();
  });
});
