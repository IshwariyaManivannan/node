const express = require("express");
const app = express();
const otp = require("./otp.js");
var cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
app.use(cors());
const port = 3000;
app.use(express.json());
app.use(bodyParser.json())
const accessTokenSecret = 'youraccesstokensecret';

let mysql = require("mysql");


let connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "empdb",
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/create", (req, res) => {
  // console.log(req.body)
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const city = req.body.city;
  const phonenumber = req.body.phonenumber;
  var sql =
    "INSERT INTO employee(firstname,lastname,city, phonenumber) VALUES(?,?,?,?)";
  connect.query(
    sql,
    [firstname, lastname, city, phonenumber],
    function (err, result) {
      res.send({ message: "ok", data: result });
    }
  );
});
app.get("/get", (req, res) => {
  var sql = "SELECT * FROM employee";
  connect.query(sql, function (err, result) {
    res.send({ message: "ok", data: result });
  });
});
app.post("/deleteData", (req, res) => {
  // console.log(req.body.ID)
  const ID = req.body.ID;
  var sql = "DELETE FROM employee WHERE ID=?";
  connect.query(sql, [ID], function (err, result) {
    res.send({ message: "ok", data: result });
  });
});
app.put("/update", (req, res) => {
  const firstname = req.body.body.firstname;
  const lastname = req.body.body.lastname;
  const city = req.body.body.city;
  const phonenumber = req.body.body.phonenumber;
  const ID = req.body.id;
  var sql =
    "UPDATE employee SET firstname=?,lastname=?,city=?,phonenumber=? WHERE ID=?";
  connect.query(
    sql,
    [firstname, lastname, city, phonenumber, ID],
    function (err, result) {
      res.send({ message: "ok", data: result });
    }
  );
});

app.post("/saveData", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  var sql1 = "SELECT otp FROM signup WHERE email=?";
  connect.query(sql1, [email], function (err, result) {
   
    if (result[0] !== undefined) {
      console.log("invalid");
      res.send({ message: "invalid" });
    } else {
      const generatedOtp = otp.generateOTP();
      var sql = "INSERT INTO signup(email,password,otp) VALUES(?,?,?)";
      connect.query(
        sql,
        [email, password, generatedOtp],
        function (err, result) {
          // console.log(result)
          res.send({ message: "ok", data: result });
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "ishwariyamanivannan@gmail.com",
              pass: "frwncxbrpsdseslx",
            },
          });

          var mailOptions = {
            from: "ishwariyamanivannan@gmail.com",
            to: email,
            subject: "Sending Email",
            text: "Hi",
            html: `<div>
                  <p style="margin-bottom: 30px;">Please enter the sign up OTP to get started</p>
                      <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${generatedOtp}</h1>
                </div>`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }
      );
    }
  });
});

app.post("/sendOtp", (req, res) => {
  const otp = req.body.value;
  const mail = req.body.mail;
  // console.log(otp)
  // console.log(mail)
  var sql = "SELECT otp FROM signup WHERE email=?";
  connect.query(sql, [mail], function (err, result) {
    if (result[0].otp != otp) {
      console.log("error");
      res.send({ message: "invalid" });
    } else {
      console.log("verified");
      res.send({ message: "verified" });
    }
  });
});
app.post("/login", (req, res) => {
  const mail = req.body.mail;
  const password = req.body.password;

  var sql = "SELECT password FROM signup WHERE email=?";
  connect.query(sql, [mail], function (err, result) {
    // console.log(result);
    if (result[0] === undefined) {
      // console.log('invalid')
      res.send({ message: "invalidUser" });
    } else if (result[0].password != password) {
      // console.log("error")
      res.send({ message: "invalid" });
    } else {
      const accessToken=jwt.sign({email:mail},accessTokenSecret)
      console.log(accessToken)
      res.send({ message: "Logged in",token:accessToken }); 
      // res.json({token:accessToken})
    }
  });
});
