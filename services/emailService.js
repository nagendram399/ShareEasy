
require('dotenv').config()
const nodemailer=require('nodemailer');

async function sendMail({from,to,subject,text,html}){
   let transport=nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
      },
   });
   let info =await transport.sendMail({
       from:`ShareEasy <${from}>`,
       to:to,
       subject:subject,
       text:text,
       html:html
   });
   console.log("hello"+info);
}

module.exports=sendMail;