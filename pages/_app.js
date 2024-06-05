import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import Head from 'next/head'
import ValidContext from '../contexts/ValidContext'
import Script from 'next/script'

import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
	
	const [isValid, setIsValid] = useState(null)
	const router = useRouter()
	
	useEffect(() => {
		window.fullres ||= { events: [] }
		
		const handleRouteChange = () => {
			const script = document.getElementById('fullres');
			if (script) {
				script.remove();
			}
			const newScript = document.createElement('script');
			newScript.async = true;
			newScript.src = 'https://t.fullres.net/jsonlint.js?' + (new Date() - new Date() % 43200000);
			newScript.id = 'fullres';
			document.head.appendChild(newScript);
		}
		
		// Extension detection script
		const checkExtension = () => {
			window.addEventListener('message', function(event) {
				if (event.data === 'extensionInstalled') {
					window.fullres.metadata = { isChromeExtensionInstalled: true }
					setIsValid(true)
				}
			})
			
			setTimeout(() => {
				window.postMessage('isExtensionInstalled', '*')
			}, 100)
		}
		
		// Ad blocker detection script
		const checkAdBlocker = () => {
			const testDiv = document.createElement('div')
			testDiv.className = 'head-banner468'
			document.body.appendChild(testDiv)

			window.setTimeout(function() {
				const hasAdBlocker = (testDiv.offsetHeight === 0)
				document.body.removeChild(testDiv)
				
				if (!window.fullres) {
					window.fullres = {}
				}
				if (!window.fullres.metadata) {
					window.fullres.metadata = {}
				}
				window.fullres.metadata.hasAdBlockerInstalled = hasAdBlocker
				
			}, 100)
		}
		
		// Call on component mount
		checkExtension()
		checkAdBlocker()
		handleRouteChange()
		router.events.on('routeChangeComplete', () => {
			checkExtension()
			checkAdBlocker()
			handleRouteChange()
		})
		
		// clean up the event listener when the component unmounts
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [router.events])
	
	return (
		<>
		<Head>
			<title>{pageProps.title}</title>
			{pageProps.metaTags &&
				pageProps.metaTags.map((tag, index) => (
					<meta {...{ [tag.attribute]: tag.value, content: tag.content }} key={index} />
				))
			}
			<link rel="alternate" href={typeof window !== 'undefined' && `${window.location.origin}${window.location.pathname}`} hrefLang="x-default" />
			<link rel="canonical" href={typeof window !== 'undefined' && `${window.location.origin}${window.location.pathname}`} key="canonical" />
			
			<link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"/>
			<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
			<link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
			<link rel="manifest" href="/images/site.webmanifest"/>
			<link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#5bbad5"/>
			<meta name="msapplication-TileColor" content="#00aba9"/>
			<meta name="theme-color" content="#ffffff"/>
		</Head>
		<div className="min-h-full bg-slate-50 dark:bg-slate-900">
			<ValidContext.Provider value={{ isValid, setIsValid }}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ValidContext.Provider>
		</div>
		<Script src={`//m.servedby-buysellads.com/monetization.custom.js`} />
		<Script
		    id='native-ad'
		    dangerouslySetInnerHTML={{
		        __html: `
				window.onload = function() {
					if (typeof _bsa !== 'undefined' && _bsa) {
		                _bsa.init('custom', 'CVADT27Y', 'placement:jsonlintcom', {
		                    target: '.custom-slant',
		                    template: \`
		                        <a href="##link##" class="native-banner">
		                            <div class="native-sponsor-container">
		                                <div class="native-sponsor">
		                                    <div class="native-label">Sponsor</div>
		                                    <div class="native-company">##company##</div>
		                                </div>
		                            </div>
		                            <div class="native-main">
		                                <img class="native-logo" src="##logo##" style="background-color: ##backgroundColor##">
		                                <div class="native-text">
		                                    <div class="native-tagline">##tagline##</div>
		                                    <div class="native-description">##description##</div>
		                                    <div class="native-cta">##callToAction##</div>
		                                </div>
		                            </div>
		                        </a>\`
		                });
		            }
				};
		        `,
		    }}
		/>
		<Script
			id='bsa'
			dangerouslySetInnerHTML={{
				__html: `
				(function(){
					var bsa_optimize=document.createElement('script');
					bsa_optimize.type='text/javascript';
					bsa_optimize.async=true;
					bsa_optimize.src='https://srv.buysellads.com/pub/jsonlint.js?'+(new Date()-new Date()%600000);
					(document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(bsa_optimize);
				})();
				`,
			}}
		/>
		<Script src={`https://www.googletagmanager.com/gtag/js?id=UA-69209117-1`} />
		<Script
			id='gajs'
			dangerouslySetInnerHTML={{
				__html: `
		  		window.dataLayer = window.dataLayer || [];
		  		function gtag(){dataLayer.push(arguments);}
		  			gtag('js', new Date());
		  			gtag('config', 'UA-69209117-1');
				`,
			}}
		/>
		</>
	)
}