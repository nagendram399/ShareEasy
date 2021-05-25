const router = require('express').Router();
const multer = require('multer')
const path = require("path")
const File = require("../Models/file");
const { v4: uuid4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage: storage,
    limit: { fileSize: 1000000 * 100 }
}).single('myfile');

router.post('/', (req, res) => {
    //uploading 

    upload(req, res, async (err) => {
        //validating
        if (!req.file) {
            return req.json({ error: "All fields are required" })
        }
        if (err) {
            return res.status(500).send({ error: err.message })

        }

        //creating the schema and uploading 
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();

        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })
    })
})

router.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;
    // console.log(req.body);
    if (!uuid || !emailTo || !emailFrom)
        return res.status(422).send({ error: 'All fields are required' });

    try {
        const file = await File.findOne({ uuid: uuid });
        // if (file.sender) {
        //     return res.status(422).send({ error: 'Email already sent.' });
        // }

        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();

        //sending email

        const sendMail = require("../services/emailService");

        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: 'ShareEasy file sharing made easy ',
            text: `${emailFrom} shared a file with you.`,
            html: require('../services/emailtemplate')({
                emailFrom: emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
                size: parseInt(file.size / 1000) + " KB",
                expires: '24 hours'
            })
        }).then(() => {
            return res.send({ success: true });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ error: 'Error in sending mail' });
        })

    } catch (err) {
        return res.status(500).send({ error: "Something went Wrong" })
    }


});

module.exports = router;