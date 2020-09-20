// import Twilio from "twilio";

// const twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const sendSMS = (to: string, message: string) => {
  console.log("to >", to);
  console.log("message >", message);
};

export const sendVerificationSMS = (to: string, key: string) =>
  sendSMS(to, `인증번호: ${key}`);
