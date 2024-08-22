import React from 'react'
import Link from 'next/link'

export default function Bottom() {

	return (
		<footer className="w-full bg-white py-12 pb-20 dark:bg-slate-800 px-8 lg:px-10" aria-labelledby="footer-heading">
		    <div className="max-w-8xl mx-auto">
		    	<h3 className="text-base font-semibold mb-6 font-['MonoLisa'] tracking-tight dark:text-slate-300 dark:border-slate-700">JSON Datasets</h3>
				<p className="mb-4">We have created a series of helpful JSON files that you can use for your projects and for testing. If you would like to contribute to the archive or have ideas please open up a ticket or pull request on our GitHub repo.</p>
				
				<ul className="tools grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
					<li>
						<Link href="/datasets/us-states-with-detail">US States, Abbreviation, Capital City, Date Founded, and Bordering States</Link>
					</li>
					<li>
						<Link href="/datasets/programming-languages">Programming Languages</Link>
					</li>
					<li>
						<Link href="/datasets/emoticons">Emoticons</Link>
					</li>
				</ul>
		        
		        <h2 className="mt-20 pt-10 border-t border-slate-100 text-base font-semibold mb-6 font-['MonoLisa'] tracking-tight dark:text-slate-300 dark:border-slate-700">
					Our Friends and Favorites
				</h2>
		        <ul className="tools grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
					<li>
		                <a href="https://fr.sh/7ee613" rel="noopener">Fullres</a>
		                <span className="block">The All-in-one Platform for Creators</span>
		            </li>
		            <li>
		                <a href="https://markdowneditor.org" rel="noopener">Markdown Editor</a>
		                <span className="block">A lightweight and basic Markdown Editor</span>
		            </li>
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
		    <div className="max-w-8xl mx-auto mt-20 pt-6 border-t border-slate-200 dark:border-slate-700">
		    	<div className="text-sm">
		    		&copy; 2023 JSONLint.com. <Link href="/privacy">Privacy Policy</Link>
				</div>
		    </div>
		</footer>
	)
}
