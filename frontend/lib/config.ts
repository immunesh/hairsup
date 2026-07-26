// Single source for the backend URL.
//
// NEXT_PUBLIC_* values are inlined at build time, not read at runtime, so a
// deployment must have NEXT_PUBLIC_API_URL set *before* the build runs —
// changing it afterwards requires a rebuild.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// The same host without the trailing /api, for files the backend serves
// directly rather than through the API — currently /uploads/<image>.
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');
