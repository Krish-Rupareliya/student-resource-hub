// backend/scripts/get-refresh-token.js
// Helper tool to generate a new Google OAuth Refresh Token for Google Drive integration.
'use strict';

require('dotenv').config();
const { google } = require('googleapis');
const readline   = require('readline');

const clientId     = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri  = 'https://developers.google.com/oauthplayground';

if (!clientId || !clientSecret) {
  console.error('\n❌ ERROR: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in your backend/.env file.');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

console.log('\n======================================================');
console.log('🔑 Google Drive OAuth Refresh Token Generator Tool');
console.log('======================================================\n');
console.log('📌 NOTE ON "invalid_grant" ERRORS:');
console.log('If your Google Cloud Console OAuth Publishing Status is "Testing",');
console.log('refresh tokens automatically expire after 7 days.');
console.log('To prevent future expiration, set your Google OAuth App status');
console.log('to "In Production" in Google Cloud Console > OAuth consent screen.\n');

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // Forces generation of a new refresh token
  scope: SCOPES,
});

console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Authorize with your Google account.');
console.log('3. Copy the authorization code returned (or use OAuth Playground).\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the authorization code here: ', async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log('\n======================================================');
    console.log('✅ SUCCESS! Here is your new Refresh Token:');
    console.log('======================================================\n');
    console.log(`GOOGLE_REFRESH_TOKEN="${tokens.refresh_token}"\n`);
    console.log('Update this line in backend/.env, backend/.env.local, and Render environment variables.');
  } catch (err) {
    console.error('\n❌ Failed to obtain refresh token:', err.message);
  }
});
