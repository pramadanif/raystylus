// test-openrouter.js
const https = require('https');
require('dotenv').config({ path: '.env.local' }); // Load variable dari .env.local

const API_KEY = process.env.OPENROUTER_API_KEY;

console.log('--- DIAGNOSTIC START ---');

// 1. Cek apakah Key terbaca
if (!API_KEY) {
    console.error('❌ ERROR: OPENROUTER_API_KEY tidak ditemukan di process.env');
    console.error('   Pastikan file .env.local ada dan berisi OPENROUTER_API_KEY=sk-or-...');
    process.exit(1);
} else {
    console.log('✅ API Key terdeteksi:', API_KEY.substring(0, 10) + '...');
}

// 2. Coba Request langsung
const data = JSON.stringify({
    model: 'openai/gpt-oss-20b:free', // Model murah untuk test
    messages: [
        { role: 'user', content: 'Say "Hello World"' }
    ]
});

const options = {
    hostname: 'openrouter.ai',
    path: '/api/v1/chat/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'TestScript'
    }
};

console.log('\n--- SENDING REQUEST ---');
const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('\n--- RESPONSE BODY ---');
        try {
            const parsed = JSON.parse(responseBody);
            console.log(JSON.stringify(parsed, null, 2));
            
            if (res.statusCode === 200) {
                console.log('\n✅ SUCCESS: Koneksi ke OpenRouter Berhasil!');
            } else {
                console.log('\n❌ FAILED: Ada masalah dengan API atau Key Anda.');
                if (parsed.error) {
                    console.error('Error Detail:', parsed.error.message);
                }
            }
        } catch (e) {
            console.log('Raw response:', responseBody);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ NETWORK ERROR:', error);
});

req.write(data);
req.end();