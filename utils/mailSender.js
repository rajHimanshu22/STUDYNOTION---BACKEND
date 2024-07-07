const nodemailer = require("nodemailer");//mail  bhejne  ke liye ye package

const mailSender = async(email, title, body) =>{ //kya aa rha hai input me function ke
    try{
        let transporter = nodemailer.createTransport({ //sbse phle transporter bnao
            host: process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({//to send mail
            from: 'StudyNotion || CodeStudy - by Himanshu',
            to:`${email}`,
            subject:`${title}`,
            html: `${body}`,
        })
        console.log(info);
        return info;
    }
    catch(error) {
        console.log(error.message);
    }
}

module.exports = mailSender;