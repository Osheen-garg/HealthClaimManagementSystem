const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendCredentialsEmail = async (
  email,
  name,
  password,
  role
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Health Insurance Portal Account",
    html: `
      <h2>Welcome ${name}</h2>

      <p>Your account has been created successfully.</p>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <td><b>Role</b></td>
          <td>${role}</td>
        </tr>

        <tr>
          <td><b>Email</b></td>
          <td>${email}</td>
        </tr>

        <tr>
          <td><b>Password</b></td>
          <td>${password}</td>
        </tr>
      </table>

      <br>

      <p>
      Please login on Health Claim Management System portal.
      </p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendCredentialsEmail,
};