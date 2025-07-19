const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

app.post('/sign', (req, res) => {
	const { secret, apiPath, params, body } = req.body;

	if (!secret || !apiPath || !params) {
		return res.status(400).json({ error: 'Missing required field(s)' });
	}

	const sortedKeys = Object.keys(params).sort();
	let signString = secret + apiPath;

	for (const key of sortedKeys) {
		signString += key + params[key];
	}

	signString += (body || '') + secret;

	const sign = crypto.createHmac('sha256', secret).update(signString).digest('hex');
	res.json({ sign });
});

app.get('/', (_, res) => res.send('OK'));
app.listen(3000, () => console.log('Sign server running on port 3000'));
