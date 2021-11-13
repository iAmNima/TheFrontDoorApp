const nodemailer = require("nodemailer");
const route = require("express").Router();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    port: process.env.MAILPORT,
    host: process.env.HOST,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    secure: true,
});

route.post('/send-email', (req, res) => {
    const to = req.body.to;
    const mailData = {
        from: process.env.EMAIL,
        to: to,
        subject: process.env.Subject,
        text: process.env.Text,
        html: process.env.Html,
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({message: "Mail Sent", message_id: info.message_id});
    });
});

module.exports = route;