// 1. Look for the Live URL in Environment Variables, otherwise use Localhost
export const URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 2. Base the Image Folder (IF) on the main URL so they both update together
export const IF = `${URL}/images`;