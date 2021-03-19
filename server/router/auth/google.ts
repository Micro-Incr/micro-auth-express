import { Router } from 'express';
import passport from 'passport';
import User from '../../models/User';
import { signToken } from '../../helpers/jwt';
import RefreshToken from '../../models/RefreshToken';
import { v4 as uuid4 } from 'uuid';
import { CLIENT_URL } from '../../configs/baseConfig';

const googleAuthRouter = Router();

googleAuthRouter.get('/success', (req, res, next) => {
  if (req.user) {
    const user = req.user as User;
    return res.status(200).json(user);
  } else {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
});

googleAuthRouter.get(
  '',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  })
);

googleAuthRouter.get('/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const user: User = req.user as User;

  const token = signToken(user);
  const refreshTokenModel = new RefreshToken();
  const refreshToken = uuid4();
  refreshTokenModel.refreshToken = refreshToken;
  refreshTokenModel.user = user;

  return res

    .status(200)
    .cookie('accessToken', token, {
      httpOnly: false,
    })
    .cookie('user', user, {
      httpOnly: false,
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
    })
    .redirect(`${CLIENT_URL}/projects`);
});

googleAuthRouter.get('/logout', async (req, res) => {
  try {
    req.logOut();
    res.status(204);
  } catch (e) {
    res.status(500).json(e);
  }
});

export default googleAuthRouter;
