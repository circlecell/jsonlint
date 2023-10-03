import React from 'react'
import Link from 'next/link'

export default function Bottom() {

	return (
		<footer className="w-full bg-white py-12 pb-20 px-4 lg:px-10 dark:bg-slate-700" aria-labelledby="footer-heading">
		    <div className="max-w-7xl mx-auto">
		        <h2 className="text-lg font-semibold mb-6 font-['MonoLisa'] tracking-tight dark:text-slate-300">
		        	<svg viewBox="0 0 640 512" height="24" className="mb-2"><path d="M416 31.94C416 21.75 408.1 0 384.1 0c-13.98 0-26.87 9.072-30.89 23.18l-128 448c-.8404 2.935-1.241 5.892-1.241 8.801C223.1 490.3 232 512 256 512c13.92 0 26.73-9.157 30.75-23.22l128-448C415.6 37.81 416 34.85 416 31.94zM176 143.1c0-18.28-14.95-32-32-32c-8.188 0-16.38 3.125-22.62 9.376l-112 112C3.125 239.6 0 247.8 0 255.1S3.125 272.4 9.375 278.6l112 112C127.6 396.9 135.8 399.1 144 399.1c17.05 0 32-13.73 32-32c0-8.188-3.125-16.38-9.375-22.63L77.25 255.1l89.38-89.38C172.9 160.3 176 152.2 176 143.1zM640 255.1c0-8.188-3.125-16.38-9.375-22.63l-112-112C512.4 115.1 504.2 111.1 496 111.1c-17.05 0-32 13.73-32 32c0 8.188 3.125 16.38 9.375 22.63l89.38 89.38l-89.38 89.38C467.1 351.6 464 359.8 464 367.1c0 18.28 14.95 32 32 32c8.188 0 16.38-3.125 22.62-9.376l112-112C636.9 272.4 640 264.2 640 255.1z"/></svg>
					Other tools from JSONLint
				</h2>
		        <ul className="tools grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		            <li>
		                <Link href="/xml-to-json">
		                    <strong>XML to JSON</strong>
		                </Link>
		            </li>
		        </ul>
		        
		        
		        <h2 className="mt-20 pt-10 border-t border-slate-100 text-base font-semibold mb-6 font-['MonoLisa'] tracking-tight dark:text-slate-300">
					Our Friends and Favorites
				</h2>
		        <ul className="tools grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
		            <li>
		                <a href="https://jscompress.com/" rel="noopener">JSCompress</a>
		                <span className="block">A JavaScript Compression Tool</span>
		            </li>
		            <li>
		                <a href="https://randomkeygen.com/" rel="noopener">RandomKeygen</a>
		                <span>The Random Password Generator</span>
		            </li>
		            <li>
		                <a href="https://jsoncompare.com/" rel="noopener">JSONCompare</a>
		                <span>The Advanced JSON Linter</span>
		            </li>
		            <li>
		                <a href="https://dns-lookup.com/" rel="noopener">DNS-Lookup</a>
		                <span>Professional DNS & IP Lookup Tool</span>
		            </li>
		            <li>
		                <a href="https://validatejavascript.com/" rel="noopener">ValidateJavaScript</a>
		                <span>Quickly Find & Fix JavaScript Errors</span>
		            </li>
		            <li>
		                <a href="https://colors.to/" rel="noopener">Colors.to</a>
		                <span>Generate color palette codes</span>
		            </li>
		            <li>
		                <a href="https://whatismyip.io/" rel="noopener">What is my IP address?</a>
		                <span>IP Lookup and diagnostic tool</span>
		            </li>
		        </ul>
		    </div>
		    <div className="max-w-7xl mx-auto mt-20 pt-6 border-t border-slate-200 dark:border-slate-500">
		    	<div className="text-sm">
		    		&copy; 2023 JSONLint.com. <Link href="/privacy">Privacy Policy</Link>
				</div>
		    </div>
		</footer>
	)
}
