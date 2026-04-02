import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = process.env.API_USERNAME;
const yourPassword = process.env.API_PASSWORD;
const yourAPIKey = process.env.API_KEY;
const yourBearerToken = process.env.BEARER_TOKEN;
console.log(process.env.API_USERNAME);
console.log(process.env.API_PASSWORD);

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async(req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  try{
      const result = await axios.get(API_URL + "/random");

      //console.log(result.data);
      // const content = JSON.stringify(result.data);
      res.render("index.ejs", {content: JSON.stringify(result.data) });
      //The data you get back should be sent to the ejs file as "content"
      //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
    }
    catch(error){
      console.log("Failed to make the request: ", error.message);
      res.status(400).send(error.message);
    }
  
});

app.get("/basicAuth", async(req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  try{
    const result = await axios.get(API_URL + "/all", {  //"/all?page=2"
      auth: {
        username: yourUsername,
        password: yourPassword,
      },
      params: {
        page: "2"
      }
    });
    res.render("index.ejs", { content: JSON.stringify(result.data)} );
  }
  catch(error){
    console.log("Failed to make the request: ", error.message);
    res.status(404).send(error.message);
  }

  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
});

app.get("/apiKey", async(req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
  try{
    const result = await axios.get(API_URL + "/filter", {
      params: {
        score: 5,
        apiKey: yourAPIKey
      }
    });
    res.render("index.ejs", { content: JSON.stringify(result.data)} );
  }
  catch(error){
    console.log("Failed to make the request: ", error.message);
    res.status(404).send(error.message);
  }
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
});

app.get("/bearerToken", async(req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */

  try{
    const result = await axios.get(API_URL + "/secrets/2", {    //  "/secrets/42"
      // params: {
      //   id: "42"
      // },
      headers: {
        Authorization: `Bearer ${yourBearerToken}`
      }
    });
    res.render("index.ejs", { content: JSON.stringify(result.data)} );
  }
  catch(error){
    console.log("Failed to make the request: ", error.message);
    res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
