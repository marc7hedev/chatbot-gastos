
const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
    keyFile: '/path/to/your-secret-key.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = '1HIE-IsaXirsBf5-YepSRHQsLTGlKJNMJHH5Yame3g6c';
