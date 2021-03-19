import express, { Express, json, urlencoded } from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import AuthRouter from './router/auth/auth';
import GoogleAuthRouter from './router/auth/google';
import GithubAuthRouter from './router/auth/github';
import FacebookAuthRouter from './router/auth/facebook';
import cors from 'cors';
import session from 'cookie-session';

const app: Express = express();

app.set('trust proxy', 1); // trust first proxy

app.use(
  session({
    name: 'session',
    keys: ['Secret', 'My little secret'],
    secret: 'what the hell is this secret',
    httpOnly: false,
    secure: process.env.NODE_ENV !== 'development',
    //domain: '.vercel.app',
    //path: '/',
    expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 365),
  })
);

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    //origin: ['https://newcastle-organizer.vercel.app', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

app.use(passport.initialize());

// deserialize cookie from the browser
app.use(passport.session());

/**
 * Dummy route
 */
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello!',
  });
});

app.use('/auth/google', GoogleAuthRouter);
app.use('/auth/github', GithubAuthRouter);
app.use('/auth/facebook', FacebookAuthRouter);
app.use('/api/v1/auth', AuthRouter);

app.use('*', (req, res) => {
  return res.status(404).json({ error: 'Nothing here' });
});

export default app;
