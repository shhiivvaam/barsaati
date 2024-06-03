const express = require('express');
const scrapeTwitterTrends = require('./selenium-script');
const cors=require("cors");
const app = express();
const port = 3000;

app.use(express.static('../frontend'));
app.use(cors());

app.get('/',(req,res)=>{

    return res.send("<h1>Backend.</h1>");
})
app.get('/run-scrape', async (req, res) => {
  try {
    const result = await scrapeTwitterTrends();
    res.json(result);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
