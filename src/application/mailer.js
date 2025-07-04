import nodemailer from "nodemailer";

async function mailer(message, gmail) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kamuyazidkan@gmail.com',
            pass: 'hrcs vtjk oqzl ykmz'
        }
    });

    const mailOptions = {
        from: "M. Yazid Arsy",
        to: gmail,
        subject: `Kode Verifikasi`,
        text: message,
    }

    try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email terkirim:", info.response);
    return info.response;
  } catch (err) {
    console.error("Gagal kirim email:", err.message);
    throw new Error(`Email gagal terkirim: ${err.message}`);
  }
}

export { mailer };