import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Salesforce color palette
				salesforce: {
					blue: {
						50: '#F3F7FC',
						100: '#E8F1FA',
						200: '#C8DDF5',
						300: '#A8CAF0',
						400: '#69A4E6',
						500: '#0176D3', // Primary Salesforce Blue
						600: '#0163B8',
						700: '#014D99',
						800: '#013A7A',
						900: '#002A5C'
					},
					gray: {
						50: '#FAFAF9',
						100: '#F3F2F2',
						200: '#ECEBEA',
						300: '#DDDBDA',
						400: '#C9C7C5',
						500: '#ABA9A8',
						600: '#706E6B',
						700: '#514F4D',
						800: '#3E3E3C',
						900: '#201E1C'
					},
					green: {
						500: '#2E844A',
						600: '#1F6D38'
					},
					red: {
						500: '#EA001E',
						600: '#C23934'
					},
					orange: {
						500: '#FE9339',
						600: '#DD7A01'
					},
					yellow: {
						500: '#FFB75D',
						600: '#E4A402'
					}
				}
			},
			fontFamily: {
				sans: ['Salesforce Sans', 'Arial', 'sans-serif']
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography')
	]
} satisfies Config;
