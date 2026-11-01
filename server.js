const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_PASSWORD = 'KaluaApiHub';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Password Authentication Endpoint
app.post('/api/auth', (req, res) => {
    const { password } = req.body;
    if (password === SITE_PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid Password! Access Denied.' });
    }
});

// Secure API Proxy Endpoint (Handles CORS & Error Messages)
app.post('/api/proxy', async (req, res) => {
    const { apiType, keyType, queryValue } = req.body;
    
    let targetUrl = '';
    const key = keyType === 'lifetime' ? 'lifetime' : (keyType === '1week' ? '1week' : '30day');

    switch (apiType) {
        case 'vehicle_full':
            targetUrl = `https://api.sarkariallupdates.com/api?=vehicle_full&key=${key}&xr=${encodeURIComponent(queryValue)}`;
            break;
        case 'vehicle_to_number':
            targetUrl = `https://api.sarkariallupdates.com/api?=vehicle_to_number&key=${key}&xr=${encodeURIComponent(queryValue)}`;
            break;
        case 'aadhaar2pan':
            targetUrl = `https://api.sarkariallupdates.com/api?=aadhaar2pan&key=${key}&aadhaar2pan=${encodeURIComponent(queryValue)}`;
            break;
        case 'aadhaar2num':
            targetUrl = `https://api.sarkariallupdates.com/api?=addhaar2num&key=${key}&q=${encodeURIComponent(queryValue)}`;
            break;
        case 'challan':
            targetUrl = `https://api.allprinthub.in/api?=challan&key=Ronak_api&v=${encodeURIComponent(queryValue)}`;
            break;
        case 'pan2dob_name':
            targetUrl = `https://api.sarkariallupdates.com/api?=pan2dob_name&key=${key}&pan2dob_name=${encodeURIComponent(queryValue)}`;
            break;
        default:
            return res.status(400).json({ success: false, error: 'Invalid API type selected.' });
    }

    try {
        const response = await fetch(targetUrl);
        const textData = await response.text();
        
        let jsonData;
        try {
            jsonData = JSON.parse(textData);
        } catch (e) {
            jsonData = { raw: textData };
        }

        // Check if API failed or returned error
        if (!response.ok || (jsonData && (jsonData.status === false || jsonData.error || jsonData.message?.toLowerCase().includes('invalid') || jsonData.message?.toLowerCase().includes('expired')))) {
            return res.json({
                success: false,
                error: "pls purchase premium on this telegram id = @KaluaApiAdmin",
                details: jsonData
            });
        }

        res.json({
            success: true,
            data: jsonData
        });
    } catch (error) {
        res.json({
            success: false,
            error: "pls purchase premium on this telegram id = @KaluaApiAdmin",
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Kalua API Hub server running on port ${PORT}`);
});
