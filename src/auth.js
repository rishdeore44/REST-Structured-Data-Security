
//Token
//ya29.a0AXooCgtS4vznxabiaCfg2p7jBdkaFcn8efS6Vhw65PlS6olcxPD2yfOvz0wAu-btWuwJwmRB0KcvfspL6mBsxFmbHgjNFqEypeHuZFt35IJ5XW1qk1juEuusDldajY-i2g52yZIs3CoDnm99wcs16CiQA6wrTIRwVz-AaCgYKAa0SARASFQHGX2Miz03HtlqBEu1mdvTyqJCtjg0171

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const CLIENT_ID = '---';
const CLIENT_SECRET = '---';
const CALLBACK_URL = 'http://localhost:3000/auth/google/callback';

passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: ['profile', 'email', 'openid'] // Add openid scope
}, (accessToken, refreshToken, params, profile, done) => {
    // ID token can be found in the accessToken if the scope 'openid' is requested
    const idToken = params.id_token; // This is the JWT token
    return done(null, { profile, idToken });
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

const app = express();

app.use(session({ secret: '---', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, return the JWT token
        if (req.user && req.user.idToken) {
            res.json({ token: req.user.idToken });
        } else {
            res.status(500).json({ error: 'Failed to obtain ID token' });
        }
    }
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
