import React, { useState, useEffect, useContext } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
	
const XMLtoJSON = dynamic(() => import('../components/xmltojson'), {
	ssr: false,
	loading: () => <p>Loading...</p>
})
	
export default function XMLtoJSONPage() {
	
	const router = useRouter()
    const { json, url } = router.query
    
	return (
		<>
		<div className="mt-8 max-w-8xl mx-auto sticky top-ad-container top-0 z-10 flex">
			<div id="bsa-zone_1570746984891-3_123456"></div>
		</div>
		<div className="flex-1 pt-6 max-w-8xl mx-auto dark:text-slate-300 px-8 lg:px-10">
			
			<h1 className="text-xl mb-2">Convert XML to JSON</h1>
			<h2 className="text-base mb-6 font-normal">Copy + paste your XML below and click the button:</h2>
			
			<XMLtoJSON />
			
			<div className="grid grid-cols-3 gap-4">
				<div className="col-span-2">
			
					<div className="block mt-10 mb-20">
						<h2>XML to JSON Converter</h2>
						<p>Welcome to the XML to JSON Conversion Tool, your one-stop solution for transforming XML data structures into readable and easy-to-manage JSON formats.</p>
						
						<h2>Why Convert from XML to JSON?</h2>
						<ul>
							<li><strong>Simplicity</strong>: JSON is generally more concise and easier to read than XML.</li>
							<li><strong>Popularity</strong>: JSON has become the de facto standard for many web APIs, offering a more lightweight data interchange.</li>
							<li><strong>Interoperability</strong>: While both XML and JSON are universal formats, JSON is more commonly used in web applications, especially with JavaScript.</li>
						</ul>
						
						<h2>How to Use This Tool</h2>
						<ol>
							<li><strong>Paste Your XML</strong>: Simply insert your XML data into the input box.</li>
							<li><strong>Validate & Convert</strong>: Our tool not only validates your XML but also seamlessly converts it into JSON format.</li>
							<li><strong>Review & Edit</strong>: After conversion, you can review the resulting JSON, make any necessary modifications, and validate it right here!</li>
						</ol>
		
						<h2>Additional Features</h2>
						<ul>
							<li><strong>Clear All</strong>: With a single click, reset everything and start over.</li>
							<li><strong>Real-time Feedback</strong>: Instantly see errors or issues with your XML data, pinpointed to the exact line.</li>
							<li><strong>Pretty & Compact</strong>: Choose to display your JSON in a pretty-printed or compacted format.</li>
						</ul>
						
						<p>Whether you’re a developer looking to convert large XML datasets or just someone curious about transforming a few XML strings into JSON, this tool ensures a smooth and hassle-free experience. Dive in and make your data conversion simpler and faster!</p>
						
					</div>
				</div>
				<div className="mt-10 mb-20">
					
					<div>
						<div id="bsa-zone_1605730077127-6_123456"></div>
					</div>
					
				</div>
			</div>
		</div>
		</>
	)
}

export async function getStaticProps() {
	
	const title = 'Online XML to JSON Converter - Quickly Convert, Download & Share'
	const metaTags = [
		{ attribute: 'name', value: 'description', content: 'Effortlessly convert XML to JSON with our user-friendly online tool. Paste XML directly, upload a file, or load from a URL. Download the result, save for later, and share with ease!' }
	]

	return {
		props: {
			title,
			metaTags
		},
		revalidate: 86400,
	}

}
