const axios = require('axios');
const clientId = process.env.INSTA_CLIENT_ID;
const clientSecret = process.env.INSTA_CLIENT_SECRET;
const accessToken = 'EAAOSBQYT5ycBOw7xG79peHcRyiwP4sPQbgPZC1rySwuH9PpC5zM5CzXTmlAhvHRohv4kIgjEusZCSBXdSzJ0ujjTOqgfKsFawuGTj9aRugmYoZCTNvnkbZC5d8ZC35iJqvAESEBrLetKMX7BwKri8Xs6Dl4kQENn7n8aZCS9cZAqqSGvNoMZA739ovfT9gcchHyWpZAbVG7eM';

// Function to get user info
const getUserInfo = async (accessToken) => {
    try {
        const response = await axios.get('https://graph.instagram.com/me', {
            params: {
                fields: 'id,username',
                access_token: accessToken
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Function to get business discovery data
const getBusinessDiscovery = async (username) => {
    try {
        const encodedUsername = encodeURIComponent(username);
        const response = await axios.get(`https://graph.facebook.com/v20.0/17841438836501180`, {
            params: {
                fields: `business_discovery.username(${encodedUsername}){id,username,name,profile_picture_url,followers_count,follows_count,media_count,media{id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count}}`,
                access_token: accessToken
            }
        });
        return response.data.business_discovery;
    } catch (error) {
        console.error('Error fetching business discovery info:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Function to calculate metrics
const calculateMetrics = (businessInfo) => {
    let totalLikes = 0;
    let totalComments = 0;
    let numberOfPosts = 0;

    if (businessInfo.media && businessInfo.media.data) {
        totalLikes = businessInfo.media.data.reduce((acc, media) => acc + (media.like_count || 0), 0);
        totalComments = businessInfo.media.data.reduce((acc, media) => acc + (media.comments_count || 0), 0);
        numberOfPosts = businessInfo.media.data.length;
    }

    const averageLikes = numberOfPosts > 0 ? totalLikes / numberOfPosts : 0;
    const averageComments = numberOfPosts > 0 ? totalComments / numberOfPosts : 0;
    const engagementRate = numberOfPosts > 0 ? ((totalLikes + totalComments) / (numberOfPosts * businessInfo.followers_count)) * 100 : 0;

    return { averageLikes, averageComments, engagementRate };
};

module.exports = {
    getUserInfo,
    getBusinessDiscovery,
    calculateMetrics
};
