import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

async function mailer(message, gmail) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS
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