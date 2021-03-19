import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { JWT_SECRET } from '../../configs/baseConfig';
import { getRepository } from 'typeorm';
import User from '../../models/User';

const strategy = () => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async function (jwt_payload, next) {
        const userRepository = getRepository(User);
        // usually this would be a database call:
        try {
          const user = await userRepository.findOne({
            where: {
              id: jwt_payload.data.id,
            },
          });
          if (user) {
            next(null, user);
          } else {
            next(null, false);
          }
        } catch (e) {
          next(e, false);
        }
      }
    )
  );
};

export { strategy };
