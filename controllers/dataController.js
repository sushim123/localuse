const { getBusinessDiscovery, calculateMetrics } = require('../utils/instagramUtils');

const showUsernameForm = (req, res) => {
    res.send(`
        <form action="/fetch-data" method="post">
            <label for="username">Enter Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="days">Select Days:</label>
            <select id="days" name="days">
                <option value="7">7 Days</option>
                <option value="10" selected>10 Days</option>
                <option value="30">30 Days</option>
            </select>
            <button type="submit">Fetch Data</button>
        </form>
    `);
};

const fetchData = async (req, res) => {
    const { username, days } = req.body;
    if (username && days) {
        try {
            const businessInfo = await getBusinessDiscovery(username);
            const metrics = calculateMetrics(businessInfo);

            const mediaDetails = businessInfo.media.data.map(media => ({
                id: media.id,
                caption: media.caption,
                mediaType: media.media_type,
                mediaUrl: media.media_url,
                thumbnailUrl: media.thumbnail_url,
                permalink: media.permalink,
                timestamp: media.timestamp,
                likeCount: media.like_count,
                commentsCount: media.comments_count,
            }));

            const responseData = {
                businessInfo,
                metrics,
                mediaDetails,
            };

            res.json(responseData);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching data.', details: error.response ? error.response.data : error.message });
        }
    } else {
        res.status(400).json({ error: 'Please provide a username and number of days.' });
    }
};

module.exports = {
    showUsernameForm,
    fetchData
};
