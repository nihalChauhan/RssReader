const nodemailer = require('nodemailer');

const sendmail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: '', //Enter username here
        pass: ''  //Enter Password here
    }
});

function createShare(shareEmail, link) {
    return {
        from: 'a@cb.lk',
        to: (typeof shareEmail == 'string') ? shareEmail : shareEmail.join(','),
        subject: 'RSS share',
        html: "<h3> Check out Feed : " + link + " using the RSS reader <a href=''>app</a></h3>"
    }
}

function sendShare(shareEmail, link, done) {
    sendmail.sendMail(createShare(shareEmail, link), (err, info) => {
        if (err) {
            throw err
        }
        if (done) {
            done(info);
        }
    })
}

module.exports = {
    sendShare
};