const axios = require('axios');
const { getUserInfo, getBusinessDiscovery } = require('../utils/instagramUtils');
const clientId = process.env.INSTA_CLIENT_ID;
const clientSecret = process.env.INSTA_CLIENT_SECRET;
const redirectUri = 'https://961a-223-185-40-176.ngrok-free.app/callback';

const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;

const showAuthLink = (req, res) => {
    res.send(`
        <a href="${authUrl}">Authenticate with Instagram</a>
        <br><br>
    `);
};

const handleCallback = async (req, res) => {
    const authCode = req.query.code;
    if (authCode) {
        try {
            const params = new URLSearchParams();
            params.append('client_id', clientId);
            params.append('client_secret', clientSecret);
            params.append('grant_type', 'authorization_code');
            params.append('redirect_uri', redirectUri);
            params.append('code', authCode);

            const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', params);
            const accessToken = tokenResponse.data.access_token;

            const userInfo = await getUserInfo(accessToken);
            const username = userInfo.username;
            const businessInfo = await getBusinessDiscovery(username);

            const responseData = {
                accessToken,
                userInfo,
                businessInfo,
            };

            res.json(responseData);
        } catch (error) {
            console.error('Error during authorization or fetching data:', error.response ? error.response.data : error.message);
            res.status(500).json({ error: 'Error during authorization or fetching data.', details: error.response ? error.response.data : error.message });
        }
    } else {
        res.status(400).json({ error: 'Authorization failed or was denied.' });
    }
};

module.exports = {
    showAuthLink,
    handleCallback
};
