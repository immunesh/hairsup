import jwt from 'jsonwebtoken';

// Values that must never sign a real token: the old hardcoded fallbacks and
// the placeholders shipped in .env.example. All of them are public, so a token
// signed with one can be forged by anyone who has read the repo — including an
// admin token.
const UNSAFE_SECRETS = new Set([
  'fallback_secret_change_me',
  'fallback_refresh_secret',
  'your_super_secret_jwt_key_change_in_production_min_32_chars',
  'your_refresh_secret_key_change_in_production',
]);

const isProduction = process.env.NODE_ENV === 'production';

function resolveSecret(name: string, devFallback: string): string {
  const value = process.env[name];

  if (!isProduction) {
    return value && !UNSAFE_SECRETS.has(value) ? value : devFallback;
  }

  if (!value || UNSAFE_SECRETS.has(value)) {
    throw new Error(
      `${name} is missing or still set to a public example value. Tokens signed ` +
        `with it could be forged by anyone, including admin tokens. Set ${name} ` +
        `to a private random string of at least 32 characters.`
    );
  }

  if (value.length < 32) {
    throw new Error(
      `${name} is ${value.length} characters; use at least 32 so it cannot be ` +
        `brute-forced.`
    );
  }

  return value;
}

const JWT_SECRET = resolveSecret('JWT_SECRET', 'dev_only_access_secret');
const JWT_REFRESH_SECRET = resolveSecret(
  'JWT_REFRESH_SECRET',
  'dev_only_refresh_secret'
);

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): { userId: string; role: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
};
