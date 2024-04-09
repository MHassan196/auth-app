import nodeMailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';

let nodeConfig = {
    service: 'gmail',
    auth : {
        user : ENV.EMAIL,
        pass : ENV.PASSWORD
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
}

let transporter = nodeMailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js"
    }
})

/** POST: http://localhost:8080/api/registerMail 
 * @ param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/

export const registerMail = async (req, res) => {
    const {username, userEmail, text, subject} = req.body;

    var email = {
        body : {
            name : username,
            intro : text || "Welcome To MERN Auth APP. We are very excited to have you on board",
            outro : "Note: This is an auto generated email. Don't reply on this."
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from : ENV.EMAIL,
        to : userEmail,
        subject : subject || "Registration Successfull",
        html : emailBody
    }

    // send mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(201).json({msg : "You should recieve an email from us"})
        }).catch(error => {
            return res.status(500).json({error})
        })
}