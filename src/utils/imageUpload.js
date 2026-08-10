import axios from 'axios';

/**
 * Uploads a media file (image or video) to the backend server, 
 * which in turn uploads it to Cloudinary and returns the secure URL.
 */
export const handleImageUpload = (file) => {
  return new Promise(async (resolve, reject) => {
    if (!file) {
      reject('No file provided');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.url) {
        resolve(response.data.url);
      } else {
        reject('Upload failed, no URL returned');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      reject(error.response?.data?.error || 'Failed to upload media');
    }
  });
};
