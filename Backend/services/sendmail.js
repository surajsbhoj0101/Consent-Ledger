import nodemailer from "nodemailer";
import "dotenv/config";

export const sendMail = async (mailDetails) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const res = await transporter.sendMail(mailDetails);
    console.log(res);
    return true;
  } catch (error) {
    console.error("Email send failed:", error.message);
    return false;
  }
};
