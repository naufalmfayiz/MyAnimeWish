const createMailTransporter = require("./createMailTransporter");

const sendGreetingMail = (user) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"MyAnimeWish" <myanimewish23@outlook.com>',
    to: user.email,
    subject: "Greeting...",
    html: `<P> Hello, thanks for joining and welcome to MyAnimeWish <P>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Greeting email sent");
    }
  });
};

module.exports = sendGreetingMail;
