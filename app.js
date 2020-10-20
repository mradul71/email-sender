const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const app = express();

app.set("view engine", "ejs");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res)=>{
    res.render("form");
})

app.get("/success/:name", (req, res)=>{
    res.render("success", {name: req.params.name});
})

app.post("/send", (req, res) => {

    let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.HOST_POST,
        secure: false,
        auth: {
            user: process.env.USER, // generated ethereal user
            pass: process.env.PASS  // generated ethereal password
        },
        tls:{
          rejectUnauthorized:false
        }
      });

      const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
            <li>Name: ${req.body.name}</li>
            <li>My Email: ${req.body.sen_email}</li>
            <li>Subject: ${req.body.subject}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
        `;
      // setup email data with unicode symbols
      let mailOptions = {
          name: req.body.name,
          from: req.body.sen_email, // sender address
          to: req.body.rec_email, // list of receivers
          subject:"new connection request", // Subject line
          text: 'Hello world', // plain text body
          html: output // html body
      };
    
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);   
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

          const client = mailOptions.name;

          res.redirect("/success/"+client);
      });
});

app.listen(3000, console.log("server has started"));