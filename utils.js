
const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
    keyFile: './google.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const spreadsheetId = '1HIE-IsaXirsBf5-YepSRHQsLTGlKJNMJHH5Yame3g6c';


async function appendToSheet(values){
    const sheets = google.sheets({version: 'v4', auth});
    const range = 'Sheet1!A1';
    const valueInputOption = 'USER_ENTERED';

    const resource = { values: values };

    try {
        const res = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        })
        return res;
    } catch (error) {
        console.error('error', error);
    }
}

async function readSheet(range){
    const sheets = google.sheets({
        version: 'v4', auth});
    
    try{
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId, range
        });
        const rows = response.data.values;
        return rows;
    } catch(error){
        console.error('error', error);
    }
}



module.exports = { appendToSheet, readSheet };