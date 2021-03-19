import nodemailer from 'nodemailer';
import {
  GMAIL_ACCESS_TOKEN,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  GMAIL_USER,
} from '../configs/gmailConfig';
import { CLIENT_URL, SERVER_URL } from '../configs/baseConfig';

export default class MailService {
  /**
   * Send verification email for signup user
   * @param email
   * @param token
   */
  static async sendVerificationEmail(email: string, token: string): Promise<void> {
    const mailTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken: GMAIL_ACCESS_TOKEN,
      },
    });

    const mailDetails = {
      from: 'teamhub@contact.com',
      to: email,
      subject: 'Verify Account Registration on TeamHUB',
      html: `
<table cellspacing="0" cellpadding="0" border="0" style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <tbody><tr width="100%"> <td valign="top" align="left" style="background:#eef0f1;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <table style="border:none;padding:0 18px;margin:50px auto;width:500px"> <tbody> <tr width="100%" height="60"> <td valign="top" align="left" style="border-top-left-radius:4px;border-top-right-radius:4px;background:#1c41a8 url(https://ci5.googleusercontent.com/proxy/EX6LlCnBPhQ65bTTC5U1NL6rTNHBCnZ9p-zGZG5JBvcmB5SubDn_4qMuoJ-shd76zpYkmhtdzDgcSArG=s0-d-e1-ft#https://trello.com/images/gradient.png) bottom left repeat-x;padding:10px 18px;text-align:center"> <img height="40" width="125" src="" title="TeamHub" style="font-weight:bold;font-size:18px;color:#fff;vertical-align:top" class="CToWUd"> </td> </tr> <tr width="100%"> <td valign="top" align="left" style="background:#fff;padding:18px">
 <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center"> Let's collaborate! </h1>
 <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:center"> You have registered for the application </p>
 <div style="background:#f6f7f8;border-radius:3px"> <br>
 <p style="text-align:center"> <a href="#" style="color:#1c41a8;font:26px/1.25em 'Helvetica Neue',Arial,Helvetica;text-decoration:none;font-weight:bold" target="_blank">TeamHub</a> </p>
 <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;margin-bottom:0;text-align:center"> <a href="${SERVER_URL}/api/auth/signup/verify/${token}" style="border-radius:3px;background:#3aa54c;color:#fff;display:block;font-weight:700;font-size:16px;line-height:1.25em;margin:24px auto 6px;padding:10px 18px;text-decoration:none;width:180px" target="_blank"> Join us</a> </p>
 <br><br> </div>
 <p style="font:14px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333"> <strong>What's TeamHub?</strong> It's the easiest way to organize anything, like having virtual whiteboards with superpowers. <a href="${CLIENT_URL}" style="color:#1c41a8;text-decoration:none;font-weight:bold" target="_blank">Learn more »</a> </p>
 </td>
 </tr>
 </tbody> </table> </td> </tr></tbody> </table>
`,
    };

    try {
      await mailTransporter.sendMail(mailDetails);
      console.log('Email sent successfully');
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Send to member of the app the verification email to join the project
   * @param email
   * @param projectId
   * @param memberId
   * @param token
   */
  static async sendVerificationEmailToAddMemberToProject(
    email: string,
    projectId: string,
    memberId: string,
    token: string
  ): Promise<void> {
    const mailTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken: GMAIL_ACCESS_TOKEN,
      },
    });

    const mailDetails = {
      from: 'teamhub@contact.com',
      to: email,
      subject: 'Someone invited you to a project on TeamHUB',
      html: `
<table cellspacing="0" cellpadding="0" border="0" style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <tbody><tr width="100%"> <td valign="top" align="left" style="background:#eef0f1;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <table style="border:none;padding:0 18px;margin:50px auto;width:500px"> <tbody> <tr width="100%" height="60"> <td valign="top" align="left" style="border-top-left-radius:4px;border-top-right-radius:4px;background:#1c41a8 url(https://ci5.googleusercontent.com/proxy/EX6LlCnBPhQ65bTTC5U1NL6rTNHBCnZ9p-zGZG5JBvcmB5SubDn_4qMuoJ-shd76zpYkmhtdzDgcSArG=s0-d-e1-ft#https://trello.com/images/gradient.png) bottom left repeat-x;padding:10px 18px;text-align:center"> <img height="40" width="125" src="" title="TeamHub" style="font-weight:bold;font-size:18px;color:#fff;vertical-align:top" class="CToWUd"> </td> </tr> <tr width="100%"> <td valign="top" align="left" style="background:#fff;padding:18px">

 <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center"> Let's collaborate! </h1>
 <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:center"> Someone invites you to join the organization: </p>
 <div style="background:#f6f7f8;border-radius:3px"> <br>
 <p style="text-align:center"> <a href="#" style="color:#1c41a8;font:26px/1.25em 'Helvetica Neue',Arial,Helvetica;text-decoration:none;font-weight:bold" target="_blank">TeamHub</a> </p>
 <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;margin-bottom:0;text-align:center"> <a href="${SERVER_URL}/api/team/projects/${projectId}/addMember/members/${memberId}?verificationToken=${token}" style="border-radius:3px;background:#3aa54c;color:#fff;display:block;font-weight:700;font-size:16px;line-height:1.25em;margin:24px auto 6px;padding:10px 18px;text-decoration:none;width:180px" target="_blank"> Join the project</a> </p>
 <br><br> </div>
 <p style="font:14px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333"> <strong>What's TeamHub?</strong> It's the easiest way to organize anything, like having virtual whiteboards with superpowers. <a href=href="${CLIENT_URL}" style="color:#1c41a8;text-decoration:none;font-weight:bold" target="_blank">Learn more »</a> </p>
 </td>
 </tr>
 </tbody> </table> </td> </tr></tbody> </table>
`,
    };

    try {
      await mailTransporter.sendMail(mailDetails);
      console.log('Email sent successfully');
    } catch (e) {
      console.log(e);
    }
  }
}
