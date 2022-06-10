const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const https = require("https");
const { response } = require("express");
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.FirstName;
  const lastName = req.body.LastName;
  const email = req.body.Email;
  const data = {
    members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]
  }
  const jsonData = JSON.stringify(data);
  const url = "https://us13.api.mailchimp.com/3.0/lists/33736af6bc";
  const options = {
      method: "POST",
      auth: "tejaswi:7c55b692d09e21cfc04e3b60d29ee954-us13"
                      
  }

  const request = https.request(url, options, function(response){
      if(response.statusCode === 200){
          res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html");
    }

   response.on("data", function(data){
     console.log(JSON.parse(data));
   })
  })
  request.write(jsonData);
  
  request.end();
});

app.post("/failure", function(req, res){

    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});


//API Key
// 7c55b692d09e21cfc04e3b60d29ee954-us13

// List Id
// 33736af6bc

// https://<dc>.api.mailchimp.com/3.0/ -- dc means datacenter corresponds to my account, In my case it is us13