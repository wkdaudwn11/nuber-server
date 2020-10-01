// import Mailgun from "mailgun-js";

// const mailGunClient = new Mailgun({
//   apiKey: process.env.MAILGUN_API_KEY || "",
//   domain: "sandbox6dc95a40763144f59f34911bf0fb8eaf.mailgun.org"
// });

const sendEmail = (subject: string, html: string) => {
  const emailData = {
    from: "wkdaudwn11@naver.com",
    to: "wkdaudwn11@naver.com",
    subject,
    html,
  };
  // return mailGunClient.messages().send(emailData);
  console.log(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `${fullName}님 안녕하세요.<br />`;
  const emailBody = `<a href="http://nuber.com/verification/${key}/">여기</a>를 클릭하여 이메일 인증을 진행해주세요.`;
  console.log(`key > ${key}`);
  return sendEmail(emailSubject, emailBody);
};
