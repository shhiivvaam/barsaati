const { Builder,By, until, Browser } = require('selenium-webdriver');
const axios=require("axios");
const { v4: uuidv4 } = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

async function scrapeTwitterTrends() {
  const uniqueId = uuidv4();
  const currentDate = new Date();
  const dateString = currentDate.toISOString();
  let ipAddress = '';

  // Set up proxy with ProxyMesh
  const proxyAddress = 'http://scchauhan:scrapingtwiter2001@@us-wa.proxymesh.com:31280';

    let driver = await new Builder().forBrowser(Browser.CHROME).setProxy({
      proxyType:'manual',
      httpProxy:proxyAddress,
      sslProxy:proxyAddress
    }).build()
  
  try {
    await driver.get('https://x.com/i/flow/login');


    await driver.sleep(5000);
    
    // Log in to Twitter
    await driver.findElement(By.name('text')).sendKeys(config.twitter.username);
    await driver.findElement(By.xpath('/html/body/div/div/div/div[1]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/button[2]')).click();

    await driver.sleep(4000);
    await driver.findElement(By.name('password')).sendKeys(config.twitter.password);
    await driver.findElement(By.css('[data-testid="LoginForm_Login_Button"]')).click();


    await driver.sleep(9000);
    await driver.wait(until.urlContains('/home'), 10000);

    const trends = await driver.findElements(By.css('[class="r-18u37iz"]'));
    const trendNames = [];

    for (let i = 0; i < 5; i++) {
      trendNames.push(await trends[i].getText());
    }

    // Fetch IP address used
    ipAddress=await axios.get("https://api.ipify.org?format=json");
    ipAddress = ipAddress.data.ip;

    // Store in MongoDB
    const client = new MongoClient(config.mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(config.mongodb.dbName);
    const collection = db.collection('twitterTrends');

    await collection.insertOne({
      _id: uniqueId,
      trend1: trendNames[0],
      trend2: trendNames[1],
      trend3: trendNames[2],
      trend4: trendNames[3],
      trend5: trendNames[4],
      date: dateString,
      ipAddress: ipAddress
    });

    await client.close();

    return {
      id: uniqueId,
      trends: trendNames,
      date: dateString,
      ipAddress: ipAddress
    };
  } 
  finally {
    await driver.quit();
  }
}

module.exports = scrapeTwitterTrends;
