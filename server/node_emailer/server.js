const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const PDFDocument = require("pdfkit");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();
// create reusable transporter object using the default SMTP transport

const path = require('path'); // Add at the top with other requires

// ...existing code...

// Serve static files from ../static
app.use('/static', express.static(path.join(__dirname, '../../static')));

// Serve index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

// ...existing code...

const transporter = nodemailer.createTransport({
jjport: 465,               // true for 465, false for other ports
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
    const PDFDocument = require('pdfkit');
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




