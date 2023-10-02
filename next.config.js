const result = require('dotenv').config()

module.exports = {
	reactStrictMode: false,
	async redirects() {
		return [
			{
				source: '/icons/icon-hires.png',
				destination: '/images/logo.png',
				permanent: true,
			}
		]
	}
}