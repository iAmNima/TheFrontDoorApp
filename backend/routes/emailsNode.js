const nodemailer = require("nodemailer");
const route = require("express").Router();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
        user: 'frontdoor.inno@gmail.com',
        pass: 'Pa$$word',
    },
    secure: true,
});

route.post('/send-email', (req, res) => {
    const to = req.body.to;
    const roomNr = req.body.roomNr;
    const mailData = {
        from: 'frontdoor.inno@gmail.com',
        to: to,
        subject: 'Notification for room: ' + roomNr?.toString(),
        text: 'Front Door Notification',
        html: '<b>Hey there! </b> <br> A participant wants to notify you. The participant is by the Front Door screen<br/><b>Front Door Team </b> ',
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({message: "Mail Sent", message_id: info.message_id});
    });
});

module.exports = route;