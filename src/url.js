// This checks if the app is running on a live server or your laptop
const isProduction = process.env.NODE_ENV === 'production';

// If live, use Render. If local, use localhost.
export const URL = isProduction 
    ? 'https://blog-backend-mnap.onrender.com' 
    : 'http://localhost:8000';

export const IF = `${URL}/images`;