import {Request, Response, Router} from "express";
import SpotifyWebApi from 'spotify-web-api-node';
import pino from 'pino';
import {transformCurrentTrack} from "../helper/currentTrack";

const spotifyRouter = Router();
const logger = pino({level: 'debug'});

// Create the spotify client
const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URL
});

// Make place for the access token
const scopes = ['user-read-currently-playing'];
const state = 'big-man-little-dignity';
const token = {
    accessToken: '',
    refreshToken: '',
    expiresIn: 0
};

// Create the method for obtaining, checking and refreshing the access token
const tokenHandler = async () => {
    // Check the access token and expires in
    if (token.accessToken.length > 0 && new Date(token.expiresIn) > new Date()) {
        return true;
    }

    // Refresh the token
    try {
        let grant = await spotifyAPI.refreshAccessToken();
        token.accessToken = grant.body['access_token'];
        spotifyAPI.setAccessToken(token.accessToken);
        return true;
    } catch (error) {
        logger.error('Failed to obtain to refresh the token!');
        return false;
    }
};

// Create the endpoint for logging in
spotifyRouter.get('/music-auth', async (req, res) => {
    /*
        #swagger.tags = ['Music']
     */

    res.redirect(spotifyAPI.createAuthorizeURL(scopes, state));
});

// Take received code and get the authorization code grant
spotifyRouter.get('/music-cred', async (req, res) => {
    /*
        #swagger.tags = ['Music']
     */

    try {
        const code = req.query['code'] as string;
        let grant = await spotifyAPI.authorizationCodeGrant(code);
        token.accessToken = grant.body['access_token'];
        token.refreshToken = grant.body['refresh_token'];
        token.expiresIn = grant.body['expires_in'];
        spotifyAPI.setAccessToken(token.accessToken);
        spotifyAPI.setRefreshToken(token.refreshToken);
        return res.status(200).render('SpotifyUpdated');
    } catch (error) {
        logger.error('Failed to obtain an Authorization Code Grant.');
        return res.status(500).render('SpotifyFailedToUpdate');
    }
});

// Create the endpoint for current playing track
spotifyRouter.get('/music', async (req, res) => {
    /*
        #swagger.tags = ['Music']
        #swagger.responses[200] = {
            description: 'The track information',
            schema: { $ref: '#/definitions/CurrentTrack' }
        }
     */

    if (!await tokenHandler()) {
        return res.status(500).send('Failed to handle token!');
    }

    try {
        let data = await spotifyAPI.getMyCurrentPlayingTrack();
        res.status(data.statusCode).send(transformCurrentTrack(data.body));
    } catch (error) {
        res.status(500).send({
            message: 'Experienced an error while obtaining current' +
                ' playing track.',
            data: error
        });
    }
});

// Return the router
export = spotifyRouter;
