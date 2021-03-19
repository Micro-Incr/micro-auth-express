import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { getRepository } from 'typeorm';
import User from '../../models/User';
import { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } from '../../configs/socialConfig';

const strategy = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email'],
      },
      async function (accessToken, refreshToken, profile, cb) {
        const userRepository = getRepository(User);
        try {
          let user = await userRepository.findOne({
            where: {
              email: profile._json.email,
            },
          });
          if (user != null) {
            user = await userRepository.save(user);
            user.googleId = profile.id;
            return cb(null, user);
          } else {
            user = new User(profile._json.email, '', '', '', profile.username || '', '', profile.id, '');
            user = await userRepository.save(user);
            return cb(null, user);
          }
        } catch (e) {
          return cb(e, null);
        }
      }
    )
  );
};

export { strategy };
