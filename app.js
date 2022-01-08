const express = require("express");
const app = express();
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

//setting up mailchimp
mailchimp.setConfig({
  apiKey: "08327e2bfe91425be1d21f34ef603bc7-us20",
  server: "us20"
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const listId = "03ef543666";

  const data = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: data.email,
      status: "subscribed",
      merge_fields: {
        FNAME: data.firstName,
        LNAME: data.lastName
      }
    });

    res.sendFile(__dirname + "/success.html");

    console.log(
      `Successfully added contact as an audience member. The contact's id is ${
     response.id
   }.`
    );
  }
  run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res) {
  res.redirect("/")
})



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
})
