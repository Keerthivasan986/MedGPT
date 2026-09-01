import 'dotenv/config';

const required = ['MONGO_URI', 'JWT_SECRET'];

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env.`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
  reservationWindowHours: Number(process.env.RESERVATION_WINDOW_HOURS) || 4,
  defaultRadiusKm: Number(process.env.DEFAULT_RADIUS_KM) || 5
};

export default env;
