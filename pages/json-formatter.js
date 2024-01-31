import React, { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
	
export default function Home() {
    
	return (
		<>
		<main className="flex-1 pt-6 max-w-8xl mx-auto dark:text-slate-300 text-center">
			
			<div className="max-w-6xl mx-auto py-12">
			
				<div className="grid grid-cols-2 items-center justify-center mx-auto w-96">
				    <div className="flex justify-center">
				        <img src="/images/logo.svg" height="125" width="125" alt="JSONLint Logo" />
				    </div>
				    <div className="flex justify-center">
				        <img src="/images/chrome.svg" height="125" width="125" alt="Chrome Logo" />
				    </div>
				</div>
								
				<h1 className="mt-10 text-5xl mb-8">JSON Formatter for Chrome</h1>
			
				<h2 className="text-2xl font-normal mb-12">Turn tedious JSON data into a visually intuitive, interactive experience.</h2>
				
				<Link 
					className="no-underline bg-blue-500 text-white px-6 py-3 text-xl font-semibold"
					href="https://chrome.google.com/webstore/detail/json-formatter/ondecobpcidaehknoegeapmclapnkgcl"
				>
					Install (free!)
				</Link>
				
				<div className="mx-auto max-w-5xl px-16 py-3 mt-16">
				    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
				        <div className="flex items-center">
				            <span role="img" aria-label="Intuitive Visualization">🌟</span>
				            <span className="ml-2">Intuitive Visualization</span>
				        </div>
				        <div className="flex items-center">
				            <span role="img" aria-label="Image Previews">🖼️</span>
				            <span className="ml-2">Image Previews</span>
				        </div>
				        <div className="flex items-center">
				            <span role="img" aria-label="Effortless Navigation">🔍</span>
				            <span className="ml-2">Collapsible trees / indent guides</span>
				        </div>
				        <div className="flex items-center">
				            <span role="img" aria-label="Clickable URLs">🔗</span>
				            <span className="ml-2">Clickable URLs</span>
				        </div>
				        <div className="flex items-center">
				            <span role="img" aria-label="Human-Readable Timestamps">⏳</span>
				            <span className="ml-2">Human-Readable Timestamps</span>
				        </div>
				        <div className="flex items-center">
				            <span role="img" aria-label="Toggle with Ease">🔄</span>
				            <span className="ml-2">Toggle between raw/formatted</span>
				        </div>
				        <div className="flex items-center">
				            <span role="img" aria-label="Toggle with Ease">📤</span>
				            <span className="ml-2">Export to JSONLint</span>
				        </div>
				        <div className="flex items-center">
				            <span role="img" aria-label="Toggle with Ease">🛡️</span>
				            <span className="ml-2">Safe and Respectful</span>
				        </div>
				    </div>
				    <div className="carousel p-4 overflow-x-auto flex whitespace-nowrap snap-x">
					    <div className="snap-start">
					        <img src="/images/formatter/1.png" alt="JSON Formatter Screenshot 1" className="w-full h-auto" />
					    </div>
					    <div className="snap-start">
					        <img src="/images/formatter/2.png" alt="JSON Formatter Screenshot 2" className="w-full h-auto" />
					    </div>
					    <div className="snap-start">
					        <img src="/images/formatter/3.png" alt="JSON Formatter Screenshot 3" className="w-full h-auto" />
					    </div>
					    <div className="snap-start">
					        <img src="/images/formatter/4.png" alt="JSON Formatter Screenshot 4" className="w-full h-auto" />
					    </div>
					</div>
				</div>
				
				<div className="max-w-3xl text-left mx-auto mb-12">
					<p>When you encounter raw JSON data, it&apos;s often just an overwhelming wall of text. Navigating this maze can be tedious and error-prone. But with the enhanced JSON Formatter, you can now visualize, understand, and interact with JSON in ways you never imagined.</p>
					
					<h3>Why Choose JSON Formatter?</h3>
					
					<p>🌟 Intuitive Visualization: Not only does our extension decode raw JSON to present it in a beautifully structured format, but it also detects colors and shows a small color swatch. With clear indentations, color-coded elements, and organized blocks, you can discern different components at a glance.</p>
					
					<p>🖼️ Image Previews: Whenever images are detected within your JSON data, JSON Formatter will provide a handy preview, making your data more interactive and easier to understand.</p>
					
					<p>🔍 Effortless Navigation: Dive deep into nested structures with our collapsible trees and indent guides. And with the added feature of human-readable timestamps, understanding your data&apos;s timeline becomes a breeze.</p>
					
					<p>🔗 Clickable URLs: Found a link within your JSON? It&apos;s now instantly clickable! No more copy-pasting. This streamlines your workflow and saves you time.</p>
					
					<p>⏳ Human-Readable Timestamps: No more puzzling over cryptic timestamps. Our extension now converts them into a format that&apos;s easy to understand.</p>
					
					<p>🔄 Toggle with Ease: Whether you need the original data or the formatted version, effortlessly switch between raw and parsed views with a simple click.</p>
					
					<p>📤 Export to jsonlint.com: Want to edit your JSON? Easily export it to jsonlint.com and make your modifications there.</p>
					
					<p>🛡️ Safe and Respectful: We prioritize your privacy. Our extension operates client-side, ensuring your data never leaves your browser. No tracking, no data collection, just pure JSON magic.</p>
					
					<h3>Speed Up Your Development Workflow</h3>
					
					<p>For developers, every second counts. Why squint at unformatted JSON when you can view, interact, and even edit it seamlessly? With JSON Formatter, you&apos;re not just reading data; you&apos;re experiencing it. Whether you&apos;re debugging, analyzing, or just curious, our tool is designed to speed up your workflow.</p>
					
					<p>Install JSON Formatter today and transform chaos into clarity!</p>
				</div>
				
				<Link 
					className="no-underline bg-blue-500 text-white px-6 py-3 text-xl font-semibold"
					href="https://chrome.google.com/webstore/detail/json-formatter/ondecobpcidaehknoegeapmclapnkgcl"
				>
					Install (free!)
				</Link>
				
			</div>
		</main>
		</>
	)
}

export async function getStaticProps() {
	
	const title = 'JSON Formatter For Chrome'
	const metaTags = [
		{ attribute: 'name', value: 'description', content: 'Turn tedious JSON data into a visually intuitive, interactive experience with our JSON Formatter. Featuring color-coded formatting, image previews, clickable URLs, and easy navigation, it’s more than a formatter—it’s your gateway to understanding and working with JSON efficiently. Perfect for developers and data enthusiasts, our tool makes JSON data effortlessly readable and editable. Dive into a transformed JSON viewing experience and speed up your workflow today!' }
	]

	return {
		props: {
			title,
			metaTags
		},
		revalidate: 86400,
	}

}