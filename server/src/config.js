import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}

module.exports = {
  jwt_secret: process.env.JWT_SECRET || 'unsafe_jwt_secret',
  mongoose: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost/mern'
  },
  s3: {
    BUCKET_NAME: process.env.S3_BUCKET_NAME,
    IAM_USER_KEY: process.env.S3_IAM_USER_KEY,
    IAM_USER_SECRET: process.env.S3_IAM_USER_SECRET
  }
}
