import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github';
import { getRepository } from 'typeorm';
import User from '../../models/User';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../../configs/socialConfig';

const strategy = () => {
  passport.use(
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/github/callback',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async function (accessToken: string, refreshToken: string, profile: any, cb) {
        const userRepository = getRepository(User);
        // For sb with private email
        const email = profile._json.email === null ? `${profile.username}@github.com` : profile._json.email;
        try {
          let user = await userRepository.findOne({
            where: {
              email,
            },
          });
          if (user != null) {
            user = await userRepository.save(user);
            user.googleId = profile.id;
            return cb(null, user);
          } else {
            user = new User(email, '', '', '', profile.username || '', '', '', profile.id);
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
