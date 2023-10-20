import React from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const JSONStringifier = dynamic(() => import('../components/JSONStringifier'), {
	ssr: false,
	loading: () => <p>Loading...</p>
})

export default function JSONStringifyPage() {
	
	const router = useRouter()
    const { json, url } = router.query
    
	return (
		<>
			<div className="mt-8 max-w-7xl mx-auto sticky top-ad-container top-0 z-10 flex">
				<div id="bsa-zone_1570746984891-3_123456"></div>
			</div>
			<main className="flex-1 pt-6 max-w-7xl mx-auto dark:text-slate-300">
				
				<h1 className="text-xl mb-2">Stringify JSON</h1>
				<h2 className="text-base mb-6 font-normal">Paste your JSON below and click the button:</h2>
				
				<JSONStringifier />
				
				<div className="grid grid-cols-3 gap-4">
					<div className="col-span-2">
				
						<div className="block mt-10 mb-20">
							<h2>JSON Stringify Tool</h2>
							<p>JSON-escaped text has several use cases, especially when working with data interchange. Here are some primary reasons and scenarios where JSON-escaped text is essential:</p>
							<ol>
								<li>
									<strong>Embedding JSON within JSON:</strong> If you need to represent a string that is itself JSON-formatted within another JSON object, you&#39;ll need to escape it. Otherwise, it could be misinterpreted as part of the outer JSON structure.
								</li>
								<li>
									<strong>Including Special Characters:</strong> Certain characters, like double quotes (<code>&quot;</code>), backslashes (<code>\</code>), and control characters (e.g., newline (<code>\n</code>), carriage return (<code>\r</code>)), have special meanings in JSON. When these characters appear in strings and aren&#39;t escaped, they can break the validity of the JSON. By escaping these characters, you ensure that the JSON remains valid and the special characters are correctly interpreted.
								</li>
								<li>
									<strong>Security Concerns:</strong> When embedding user-generated content within a JSON payload, it&#39;s crucial to escape the text to prevent potential security issues like JSON injection. Properly escaped text helps in preventing malicious users from ending the string prematurely and adding their own malicious content.
								</li>
								<li>
									<strong>Interoperability with Other Systems:</strong> When exchanging data between different systems, it&#39;s essential to ensure that special characters or sequences in the text do not interfere with the receiving system&#39;s ability to parse and interpret the data correctly.
								</li>
								<li>
									<strong>Storing JSON in Databases:</strong> In situations where JSON data might be stored as a string in databases, it&#39;s often essential to ensure that the JSON is properly escaped, especially if the database uses special characters for its operations or queries.
								</li>
								<li>
									<strong>Embedding JSON in HTML or JavaScript:</strong> If you&#39;re embedding JSON data within HTML or JavaScript (for configurations, initial data loads, etc.), escaping is crucial. For instance, the <code>&lt;/script&gt;</code> sequence in a JSON payload could prematurely end a script tag in HTML, leading to issues.
								</li>
								<li>
									<strong>Web APIs and Services:</strong> When designing web services, especially those that accept and return JSON, ensuring that content is properly escaped can prevent potential parsing errors, ensuring that clients can correctly interpret the data.
								</li>
							</ol>
						</div>
					</div>
					<div className="mt-10 mb-20">
						<div>
							<div id="bsa-zone_1605730077127-6_123456"></div>
						</div>
					</div>
				</div>
			</main>
		</>
	)
}

export async function getStaticProps() {
	
	const title = 'Online JSON Stringify Tool - Make Your JSON Readable'
	const metaTags = [
		{ attribute: 'name', value: 'description', content: 'Easily make your JSON data readable with our user-friendly online tool. Paste JSON directly, and get a beautified version instantly.' }
	]

	return {
		props: {
			title,
			metaTags
		},
		revalidate: 86400
	}
}