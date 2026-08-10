let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
} catch(e) {
  console.warn("Cloudinary not available");
}

/**
 * Uploads a base64 string or file path to Cloudinary.
 * @param {string} file - The base64 string or path.
 * @param {string} folder - Optional folder name.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
const uploadToCloudinary = async (file, folder = 'prime_pets') => {
  if (!file) return null;
  // If it's already a URL (e.g. from a previous upload), just return it
  if (file.startsWith('http://') || file.startsWith('https://')) {
    return file;
  }
  
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

module.exports = { cloudinary, uploadToCloudinary };
