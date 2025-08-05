const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const PDFDocument = require("pdfkit");
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
port: 465,               // true for 465, false for other ports
host: "smtp.gmail.com",
   auth: {
        user: 'jk1871881@gmail.com',
        pass: 'bofi pxiz spap bcgj',
     },
secure: true,
});


const { Readable } = require('stream');
route.post("/text-mail", async function(req, res) {
    const { subject, text } = req.body;

    // Generate PDF in memory
   
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);
        const mailData = {
            from: "jk1871881@gmail.com",
            to: "kamiku851@gmail.com",
            subject: subject,
            text: text,
            html: "<p>first message send by nodemailer</p>",
            attachments: [
                {
                    filename: 'data.pdf',
                    content: pdfData,
                    contentType: 'application/pdf'
                }
            ]
        };
        transporter.sendMail(mailData, function(err, info) {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err.message,
                });
            } else {
                res.status(200).json({
                    status: "success",
                    message: "Email with PDF sent successfully",
                    message_id: info.messageId,
                });
            }
        });
    });
    doc.font('Times-Roman').fontSize(12).text(`Subject: ${subject}\nText: ${text}`);
    doc.end();
});
 const port = process.env.PORT || 5000;
 app.use('/v1', route);
 app.listen(port, () => {
     console.log(`Server listening on port ${port}`);
 });




