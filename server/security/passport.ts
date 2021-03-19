import passport from 'passport';
import User from '../models/User';
import { getRepository } from 'typeorm';
import { strategy as GithubStrategy } from './strategies/github';
import { strategy as FacebookStrategy } from './strategies/facebook';
import { strategy as GoogleStrategy } from './strategies/google';
import { strategy as LocalStrategy } from './strategies/local';
import { strategy as JwtStrategy } from './strategies/jwt';

GithubStrategy();
FacebookStrategy();
GoogleStrategy();
LocalStrategy();
JwtStrategy();

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (user: User, done) {
  const userRepository = getRepository(User);
  try {
    const userModel = await userRepository.findOne({
      where: {
        id: user.id,
      },
    });
    if (!userModel) {
      done(null, false);
    }
    done(null, userModel);
  } catch (e) {
    done(e, null);
  }
});
