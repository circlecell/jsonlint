module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			transitionProperty: {
                'width': 'width'
            },
			keyframes: {
				wiggle: {
					'0%': { transform: 'rotate(3deg)' },
					'10%': { transform: 'rotate(-3deg)' },
					'20%': { transform: 'rotate(3deg)' },
					'30%': { transform: 'rotate(-3deg)' },
					'40%': { transform: 'rotate(3deg)' },
					'50%': { transform: 'rotate(-3deg)' },
					'60%': { transform: 'rotate(3deg)' },
					'70%': { transform: 'rotate(-3deg)' },
					'80%': { transform: 'scale(.75)' },
					'90%': { transform: 'scale(.5)' },
					'100%': { transform: 'scale(.25)' },
				}
			},
			animation: {
				wiggle: 'wiggle .95s ease-in-out'
			},
			scale: {
				'102': '1.02'
			},
			backgroundImage: {
				'gradient-fade': 'linear-gradient(0deg, rgb(0,0,0,0.75), rgba(0,0,0,0.25))'
			}
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio')
	],
}