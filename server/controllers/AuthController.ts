import { Request, Response } from 'express';
import { getRepository, MoreThan } from 'typeorm';
import User from '../models/User';
import { comparePassword, hashPassword } from '../helpers/bcrypt';
import { signToken } from '../helpers/jwt';
import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken';
import SignupVerificationToken from '../models/SignupVerificationToken';
import { TokenGenerator } from 'ts-token-generator';
import MailService from '../services/MailService';
import { CLIENT_URL } from '../configs/baseConfig';

export default class AuthController {
  /**
   * User sign up
   * @param req
   * @param res
   */
  static signUp = async (req: Request, res: Response): Promise<Response> => {
    //Get name, email, password
    const { firstname = '', lastname = '', username = '', email, password } = req.body;
    //Verify if user enter
    ///\b\w+\@\w+\.\w+(?:\.\w+)?\b/
    if (!/\b\w+@\w+\.\w+(?:\.\w+)?\b/.test(email)) {
      return res.status(500).json({ success: false, data: 'Enter a valid email address.' });
    } else if (password.length < 5 || password.length > 20) {
      return res.status(500).json({
        success: false,
        data: 'Password must be between 5 and 20 characters.',
      });
    }
    //Insert the user
    const userRepository = getRepository(User);

    // Insert Verification token
    const verificationRepository = getRepository(SignupVerificationToken);

    try {
      //Hash password before inserting to database
      const hashedPassword = await hashPassword(password);

      const user = new User(email, hashedPassword, firstname, lastname, username, null, null, null);

      user.isAccountExpired = false;
      user.isBanned = false;
      user.isEnabled = false;
      await userRepository.save(user);

      // initialize the token generator
      const tokenGenerator = new TokenGenerator();
      // generate a unique token
      const token = tokenGenerator.generate();
      // create a new instance of nodemailer class
      // call the sendVerificationEmail function and pass email and the token
      await MailService.sendVerificationEmail(email, token);

      const verification = new SignupVerificationToken();
      verification.token = token;
      verification.user = user;
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 3);
      verification.expiredDate = currentDate;
      await verificationRepository.save(verification);

      res.status(201).json({
        message: 'Account created',
      });
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  };

  /**
   *
   * @param req
   * @param res
   */
  static verifySignupToken = async (req: Request, res: Response): Promise<Response | void> => {
    const { token } = req.params;
    try {
      //Get signup verification token which is current in expiration ( with user )
      const verificationToken = await getRepository(SignupVerificationToken).findOne({
        relations: ['user'],
        where: {
          token: token,
          expiredDate: MoreThan(new Date()),
        },
      });

      if (!verificationToken) {
        return res.status(401).json({ message: 'Verification code expired' });
      }

      const user = verificationToken.user;

      user.isEnabled = true;

      await getRepository(User).save(user);

      await getRepository(SignupVerificationToken).delete(verificationToken);

      return res.redirect(`${CLIENT_URL}/signup/verify`);
      //return res.redirect('http://localhost:3000/signup/verify');
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  };

  /**
   * Log in for the user
   * @param req
   * @param res
   */
  static login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    // usually this would be a database call:
    const user = await getRepository(User).findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'no such user found' });
    }

    try {
      const isPasswordMatched = await comparePassword(password, user.password);
      if (isPasswordMatched) {
        if (!user.isEnabled || user.isBanned || user.isAccountExpired) {
          return res.status(401).json({
            message: 'Account is not enabled or is banned or expired',
          });
        }
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        //const payload = {id: user.id};
        const token = signToken(user);
        delete user.password;
        const refreshTokenModel = new RefreshToken();
        crypto.randomBytes(48, async function (err, buffer) {
          const refreshToken = buffer.toString('hex');
          refreshTokenModel.refreshToken = refreshToken;
          refreshTokenModel.user = user;
          await getRepository(RefreshToken).save(refreshTokenModel);
          return res
            .cookie('refreshToken', refreshToken, {
              httpOnly: true,
            })
            .json({ user, accessToken: token });
        });
      } else {
        return res.status(401).json({ message: 'passwords did not match' });
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  };

  static refresh = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies.refreshToken;
    try {
      const refreshTokenModel = await getRepository(RefreshToken).findOne({
        where: {
          refreshToken,
        },
      });
      const user = refreshTokenModel.user;
      if (user) {
        const token = signToken(user);
        delete user.password;
        return res.status(200).json({
          accessToken: token,
        });
      }
      return res.status(403).json({
        message: 'Cannot be accessed',
      });
    } catch (e) {
      res.status(500).json(e);
    }
  };
}
