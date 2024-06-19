import React, { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import Head from 'next/head'
import ValidContext from '../contexts/ValidContext'
import Script from 'next/script'

import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
	
	const [isValid, setIsValid] = useState(null)
	const [isExtensionInstalled, setIsExtensionInstalled] = useState(null)
    const [hasAdBlocker, setHasAdBlocker] = useState(null)
	const router = useRouter()
	
	const extensionTimeoutRef = useRef(null)
    const adBlockerTimeoutRef = useRef(null)
	
	useEffect(() => {
	
		window.fullres ||= { events: [], metadata: {} }
        
        const checkExtension = () => {
		    return
			return new Promise((resolve) => {
		        if (window.fullres.metadata.isChromeExtensionInstalled !== undefined) {
		            console.log('Extension status already determined:', window.fullres.metadata.isChromeExtensionInstalled)
		            setIsExtensionInstalled(window.fullres.metadata.isChromeExtensionInstalled)
		            resolve()
		        } else {
		            const handleMessage = (event) => {
		                if (event.data === 'extensionInstalled') {
		                    console.log('Received extensionInstalled message')
		                    window.fullres.metadata.isChromeExtensionInstalled = true
		                    setIsExtensionInstalled(true)
		                    window.removeEventListener('message', handleMessage)
		                    clearTimeout(extensionTimeoutRef.current)
		                    resolve()
		                }
		            }
		            window.addEventListener('message', handleMessage)
		
		            extensionTimeoutRef.current = setTimeout(() => {
		                console.log('Posting message to check for extension')
		                window.postMessage('isExtensionInstalled', '*')
		            }, 100)
		
		            // Fallback to resolve the promise if no message is received within a reasonable time
		            setTimeout(() => {
		                console.log('No response received, assuming extension is not installed')
		                window.removeEventListener('message', handleMessage)
		                window.fullres.metadata.isChromeExtensionInstalled = false
		                setIsExtensionInstalled(false)
		                resolve()
		            }, 500) // Adjust timeout as needed
		        }
		    })
		}
        
        const checkAdBlocker = () => {
			return
            return new Promise((resolve) => {
                if (window.fullres.metadata.hasAdBlockerInstalled !== undefined) {
                    setHasAdBlocker(window.fullres.metadata.hasAdBlockerInstalled)
                    resolve()
                } else {
                    const testDiv = document.createElement('div')
                    testDiv.className = 'head-banner468'
                    document.body.appendChild(testDiv)

                    adBlockerTimeoutRef.current = setTimeout(() => {
                        const hasAdBlocker = (testDiv.offsetHeight === 0)
                        document.body.removeChild(testDiv)
                        window.fullres.metadata.hasAdBlockerInstalled = hasAdBlocker
                        setHasAdBlocker(hasAdBlocker)
                        resolve()
                    }, 100)
                }
            })
        }
        
        const handleRouteChange = () => {
            Promise.all([checkExtension(), checkAdBlocker()]).then(() => {
                const script = document.getElementById('fullres')
                if (script) {
                    return
                }
                const newScript = document.createElement('script')
                newScript.async = true
                newScript.src = 'https://jsonlint.com/omwRUQbcAI/jsonlint.js?' + (new Date() - new Date() % 43200000)
				newScript.id = 'fullres'
				newScript.attributes.siteKeyOverride = 'jsonlint'
                document.head.appendChild(newScript)
            })
        }
        
        handleRouteChange()
        router.events.on('routeChangeComplete', handleRouteChange)
        
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
			if (extensionTimeoutRef.current) {
                clearTimeout(extensionTimeoutRef.current)
            }
            if (adBlockerTimeoutRef.current) {
                clearTimeout(adBlockerTimeoutRef.current)
            }
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