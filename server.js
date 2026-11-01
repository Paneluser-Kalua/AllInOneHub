const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

async function fetchUpstream(url) {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*'
        }
    });

    const textData = await response.text();
    if (textData.trim().startsWith('<!DOCTYPE') || textData.trim().startsWith('<html')) {
        throw new Error("Upstream returned HTML instead of JSON");
    }

    try {
        return JSON.parse(textData);
    } catch (e) {
        return textData;
    }
}

const sendSuccess = (res, data) => {
    return res.json({
        developer: "KaluaApiAdmin",
        channel: "KaluaApiStore",
        status: "success",
        data: data
    });
};

const sendError = (res, details = "Service failure") => {
    return res.status(500).json({
        developer: "KaluaApiAdmin",
        channel: "KaluaApiStore",
        status: "error",
        message: "pls purchase premium on this telegram id = @KaluaApiAdmin",
        details: details
    });
};

// 1. Vehicle Full Info API
app.get('/api/vehicle-full/:key', async (req, res) => {
    const vehicle = req.query.vehicle || req.query.xr;
    if (!vehicle) return res.status(400).json({ status: "error", message: "Vehicle number is required (?vehicle=)" });
    try {
        const url = `https://api.sarkariallupdates.com/api?=vehicle_full&key=30day&xr=${encodeURIComponent(vehicle)}`;
        const data = await fetchUpstream(url);
        return sendSuccess(res, data);
    } catch (err) {
        return sendError(res, err.message);
    }
});

// 2. Vehicle to Number API
app.get('/api/vehicle-to-number/:key', async (req, res) => {
    const vehicle = req.query.vehicle || req.query.xr;
    if (!vehicle) return res.status(400).json({ status: "error", message: "Vehicle number is required (?vehicle=)" });
    try {
        const url = `https://api.sarkariallupdates.com/api?=vehicle_to_number&key=30day&xr=${encodeURIComponent(vehicle)}`;
        const data = await fetchUpstream(url);
        return sendSuccess(res, data);
    } catch (err) {
        return sendError(res, err.message);
    }
});

// 3. Aadhaar to PAN API
app.get('/api/aadhaar2pan/:key', async (req, res) => {
    const aadhaar = req.query.aadhaar || req.query.aadhaar2pan;
    if (!aadhaar) return res.status(400).json({ status: "error", message: "Aadhaar number is required (?aadhaar=)" });
    try {
        const url = `https://api.sarkariallupdates.com/api?=aadhaar2pan&key=30day&aadhaar2pan=${encodeURIComponent(aadhaar)}`;
        const data = await fetchUpstream(url);
        return sendSuccess(res, data);
    } catch (err) {
        return sendError(res, err.message);
    }
});

// 4. Aadhaar to Number API
app.get('/api/aadhaar2num/:key', async (req, res) => {
    const q = req.query.q || req.query.aadhaar;
    if (!q) return res.status(400).json({ status: "error", message: "Query value is required (?q=)" });
    try {
        const url = `https://api.sarkariallupdates.com/api?=addhaar2num&key=30day&q=${encodeURIComponent(q)}`;
        const data = await fetchUpstream(url);
        return sendSuccess(res, data);
    } catch (err) {
        return sendError(res, err.message);
    }
});

// 5. Vehicle to Challan API
app.get('/api/challan/:key', async (req, res) => {
    const vehicle = req.query.vehicle || req.query.v;
    if (!vehicle) return res.status(400).json({ status: "error", message: "Vehicle number is required (?vehicle=)" });
    try {
        const url = `https://api.allprinthub.in/api?=challan&key=Ronak_api&v=${encodeURIComponent(vehicle)}`;
        const data = await fetchUpstream(url);
        return sendSuccess(res, data);
    } catch (err) {
        return sendError(res, err.message);
    }
});

// 6. PAN to Name / DOB API
app.get('/api/pan2dob/:key', async (req, res) => {
    const pan = req.query.pan || req.query.pan2dob_name;
    if (!pan) return res.status(400).json({ status: "error", message: "PAN value is required (?pan=)" });
    try {
        const url = `https://api.sarkariallupdates.com/api?=pan2dob_name&key=30day&pan2dob_name=${encodeURIComponent(pan)}`;
        const data = await fetchUpstream(url);
        return sendSuccess(res, data);
    } catch (err) {
        return sendError(res, err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
