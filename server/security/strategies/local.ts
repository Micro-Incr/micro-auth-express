import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getRepository } from 'typeorm';
import User from '../../models/User';
import { comparePassword } from '../../helpers/bcrypt';

const strategy = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async function (email, password, done) {
        const userRepository = getRepository(User);
        try {
          const user = await userRepository.findOne({
            where: {
              email,
            },
          });
          if (!user) {
            return done(null, false);
          }
          if (!(await comparePassword(password, user.password))) {
            return done(null, false);
          }
          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );
};

export { strategy };
