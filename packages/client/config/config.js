
 const PORT = process.env.PORT || 3000;
 const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
 const PUBLIC_PATH = '/';
 const APP_TITLE = 'My Fullstack App';
 const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = {
    PORT,
    API_BASE_URL,
    PUBLIC_PATH,
    APP_TITLE,
    IS_DEV,
}