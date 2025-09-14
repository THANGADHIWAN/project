import CMS from 'netlify-cms-app';
import CloudinaryMediaLibrary from 'netlify-cms-media-library-cloudinary';

// Initialize Netlify CMS
CMS.init();

// Initialize Cloudinary integration if you're using it
CMS.registerMediaLibrary(CloudinaryMediaLibrary);
