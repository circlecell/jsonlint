import React, { useState, useEffect, useContext } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
	
const DynamicJSONLint = dynamic(() => import('../components/jsonlint'), {
	ssr: false,
	loading: () => <p>Loading...</p>
})
	
export default function Home() {
	
	const router = useRouter()
    const { json, url } = router.query
    
	return (
		<>
		{/* <div className="mt-8 max-w-8xl mx-auto sticky top-ad-container top-0 z-10 px-8 lg:px-10 flex">
			<div id="bsa-zone_1570746984891-3_123456"></div>
		</div> */}
		<div className="flex-1 pt-6 max-w-8xl mx-auto dark:text-slate-300 px-8 lg:px-10">
			
			<h1 className="text-base mb-4">To format and validate your JSON, just copy + paste it below:</h1>
			
			<div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(932px,1fr),auto] xl:gap-12">
				<div className="min-w-4xl">
				
					<DynamicJSONLint json={json} url={url} />
					
					{/* <div className="block mt-10 mb-20">
					
						<div className="custom-slant"></div>
			
						<h2 className="mt-10">About the JSONLint Editor</h2>
						<p>JSONLint is a validator and reformatter for JSON, a lightweight data-interchange format. Copy and paste, directly type, or input a URL in the editor above and let JSONLint tidy and validate your messy JSON code.</p>
		
						<h2>What Is JSON?</h2>
						<p>JSON (pronounced as Jason), stands for &quot;JavaScript Object Notation,&quot; is a human-readable and compact solution to represent a complex data structure and facilitate data interchange between systems. It&apos;s a widespread data format with a diverse range of applications enabled by its simplicity and semblance to readable text. As such, it&apos;s used by most but not all systems for communicating data.</p>
		
						<h2>Why Use JSON?</h2>
						<p>There are several reasons why you should consider using JSON, the key reason being that JSON is independent of your system&apos;s programming language, despite being derived from JavaScript. Not only is JSON language-independent, but it also represents data that speaks common elements of many programming languages, effectively making it into a universal data representation understood by all systems.</p>
						<p>Other reasons include:</p>
						<ul>
							<li>Readability – JSON is human-readable, given proper formatting.</li>
							<li>Compactness – JSON data format doesn&apos;t use a complete markup structure, unlike XML.</li>
							<li>It&apos;s easy to analyze into logical syntactic components, especially in JavaScript.</li>
							<li>Countless JSON libraries are available for most programming languages.</li>
						</ul>
		
						<h2>Proper JSON Format</h2>
						<p>Using JSON doesn&apos;t require any JavaScript knowledge, though having such would only improve your understanding of JSON. And though the knowledge of JavaScript isn&apos;t necessary, following specific rules is:</p>
						<ul>
							<li>Data is in name/value pairs</li>
							<li>Data is separated by commas</li>
							<li>Objects are encapsulated within the opening and closing curly brackets</li>
							<li>An empty object can be represented by <code>{"{}"}</code></li>
							<li>Arrays are encapsulated within opening and closing square brackets</li>
							<li>An empty array can be represented by <code>[]</code></li>
							<li>A member is represented by a key-value pair, contained in double quotes</li>
							<li>Each member should have a unique key within an object structure</li>
							<li>The value of a member must be contained in double quotes, if it&apos;s a string</li>
							<li>Boolean values are represented using the <code>true</code> or <code>false</code> literals in lower case</li>
							<li>Number values are represented using double-precision floating-point format and shouldn&apos;t have leading zeroes</li>
							<li>&quot;Offensive&quot; characters in a string need to be escaped using the backslash character <code>\</code></li>
							<li>Null values are represented by the <code>null</code> literal in lower case</li>
							<li>Dates, and similar object types, aren&apos;t adequately supported and should be converted to strings</li>
							<li>Each member of an object or array value must be followed by a comma, except for the last one</li>
							<li>The standard extension for the JSON file is <code>{'\'.json\''}</code></li>
							<li>The mime type for JSON files is <code>{'\'application/json\''}</code></li>
						</ul>
						<p>You can achieve proper JSON formatting by following these simple rules. However, if you&apos;re unsure about your code, we suggest using this JSONLint Validator and formatter.</p>
						
						<h2>Why Use JSONLint Validator and Formatter?</h2>
						<p>Programming can be challenging, as it requires enormous attention and excellent knowledge of the programming language, even as simple as JSON. Still, writing codeis tricky, and finding an error in JSON code can be a challenging and time-consuming task.</p><p>The best way to find and correct errors while simultaneously saving time is to use an online tool such as JSONLint. JSONLint will check the validity of your JSON code, detect and point out line numbers of the code containing errors. It&apos;s an excellent way to correct errors without wasting hours finding a missing coma somewhere inside your code.</p><h2>How Does A JSONLint Validator Work?</h2><p>JSONLint is an online editor, validator, and formatting tool for JSON, which allows you to directly type your code, copy and paste it, or input a URL containing your code. It will validate your JSON content according to JS standards, informing you of every human-made error, which happens for a multitude of reasons – one of them being the lack of focus.</p><p>Using JSONLint, you can quickly find any errors that might&apos;ve occurred, allowing you to focus more on the rest of your code than on a tiny error itself.</p>
						
						<h2>Tips & Tricks</h2>
						<ul>
							<li>You can use a URL and JSONLint will scrape it for JSON and parse it. Just structure the link like this, for example: <Link href="/?url=/datasets/programming-languages.json"><code>{process.env.NEXT_PUBLIC_BASE_URL}/?url={process.env.NEXT_PUBLIC_BASE_URL}/datasets/programming-languages.json</code></Link></li>
							<li>You can provide JSON to lint in the URL if you link to JSONLint with the <code>{'\'json\''}</code> parameter. For example: <Link href="/?json=%7B%22hello%22:%20%22world%22%7D"><code>{process.env.NEXT_PUBLIC_BASE_URL}/?json=%7B%22hello%22:%20%22world%22%7D</code></Link>.</li>
							<li>JSONLint can also be used as a JSON compressor/minifier. Just click on the &quot;Compress&quot; button above.</li>
						</ul>
						
						<h2>Common Errors</h2>
						<ul>
							<li>Expecting <code>&apos;STRING&apos;</code> - You probably have an extra comma at the end of your collection. Something like <code>{`{ "a": "b", }`}</code></li>
							<li>Expecting <code>{'\'STRING\''}</code>, <code>{'\'NUMBER\''}</code>, <code>{'\'NULL\''}</code>, <code>{'\'TRUE\''}</code>, <code>{'\'FALSE\''}</code>, <code>{'\'{\''}</code>, <code>{'\'[\''}</code> - You probably have an extra comma at the end of your list. Something like: <code>{`["a", "b", ]`}</code></li>
							<li>Enclosing your collection keys in quotes. Proper format for a collection is <code>{'{ "key": "value" }'}</code></li>
							<li>Make sure you follow <a href="http://www.json.org/" title="Visit JSON.org to learn more">JSON&apos;s syntax</a> properly. For example, always use double quotes, always quotify your keys, and remove all callback functions.</li>
						</ul>
						
						<h2>Different Results</h2>
						<p>If you use a Windows computer you may end up with different results. This is possibly due to the way Windows handles newlines. Essentially, if you have just newline characters <code>(\n)</code> in your JSON and paste it into JSONLint from a Windows computer, it may validate it as valid erroneously since Windows may need a carriage return <code>(\r)</code> as well to detect newlines properly. As a solution, either use direct URL input, or make sure your content&apos;s newlines match the architecture your system expects!</p>
						
						<h2>Credits</h2>
						<p>Maintained by CircleCell. Thanks to <a href="http://www.crockford.com/">Douglas Crockford</a> of JSON and JS Lint, and <a href="http://zaa.ch/">Zach Carter</a>, who built a <a href="https://github.com/zaach/jsonlint">pure JavaScript implementation</a>. You can download the <a href="https://www.github.com/circlecell/jsonlintdotcom" data-ga="sourceLink">JSONLint source code on GitHub</a>.</p>
					
					</div> */}
					
				</div>
				{/* <div>
					
					<div>
						<div id="bsa-zone_1605730077127-6_123456"></div>
					</div>
					
					<div className="py-10 px-6 bg-slate-100 dark:bg-slate-800">
						<h2 className="text-base font-semibold mb-6 font-['MonoLisa'] tracking-tight dark:text-slate-400">
				        	<svg viewBox="0 0 640 512" height="24" className="mb-2 dark:text-slate-500"><path fill="currentColor" d="M416 31.94C416 21.75 408.1 0 384.1 0c-13.98 0-26.87 9.072-30.89 23.18l-128 448c-.8404 2.935-1.241 5.892-1.241 8.801C223.1 490.3 232 512 256 512c13.92 0 26.73-9.157 30.75-23.22l128-448C415.6 37.81 416 34.85 416 31.94zM176 143.1c0-18.28-14.95-32-32-32c-8.188 0-16.38 3.125-22.62 9.376l-112 112C3.125 239.6 0 247.8 0 255.1S3.125 272.4 9.375 278.6l112 112C127.6 396.9 135.8 399.1 144 399.1c17.05 0 32-13.73 32-32c0-8.188-3.125-16.38-9.375-22.63L77.25 255.1l89.38-89.38C172.9 160.3 176 152.2 176 143.1zM640 255.1c0-8.188-3.125-16.38-9.375-22.63l-112-112C512.4 115.1 504.2 111.1 496 111.1c-17.05 0-32 13.73-32 32c0 8.188 3.125 16.38 9.375 22.63l89.38 89.38l-89.38 89.38C467.1 351.6 464 359.8 464 367.1c0 18.28 14.95 32 32 32c8.188 0 16.38-3.125 22.62-9.376l112-112C636.9 272.4 640 264.2 640 255.1z"/></svg>
							More tools from JSONLint
						</h2>
				        <ul className="tools grid grid-cols-1">
				            <li>
				                <Link href="/xml-to-json">
				                    XML to JSON
				                </Link>
				            </li>
				            <li>
				                <Link href="/json-stringify">
				                    JSON Stringify
				                </Link>
				            </li>
				        </ul>
						
					</div>
					
					<div className="py-10 px-6 bg-slate-100 dark:bg-slate-800">
						<h2 className="text-base font-semibold mb-6 font-['MonoLisa'] tracking-tight dark:text-slate-400">
				        	<svg viewBox="0 0 640 512" height="24" className="mb-2 dark:text-slate-500"><path fill="currentColor" d="M416 31.94C416 21.75 408.1 0 384.1 0c-13.98 0-26.87 9.072-30.89 23.18l-128 448c-.8404 2.935-1.241 5.892-1.241 8.801C223.1 490.3 232 512 256 512c13.92 0 26.73-9.157 30.75-23.22l128-448C415.6 37.81 416 34.85 416 31.94zM176 143.1c0-18.28-14.95-32-32-32c-8.188 0-16.38 3.125-22.62 9.376l-112 112C3.125 239.6 0 247.8 0 255.1S3.125 272.4 9.375 278.6l112 112C127.6 396.9 135.8 399.1 144 399.1c17.05 0 32-13.73 32-32c0-8.188-3.125-16.38-9.375-22.63L77.25 255.1l89.38-89.38C172.9 160.3 176 152.2 176 143.1zM640 255.1c0-8.188-3.125-16.38-9.375-22.63l-112-112C512.4 115.1 504.2 111.1 496 111.1c-17.05 0-32 13.73-32 32c0 8.188 3.125 16.38 9.375 22.63l89.38 89.38l-89.38 89.38C467.1 351.6 464 359.8 464 367.1c0 18.28 14.95 32 32 32c8.188 0 16.38-3.125 22.62-9.376l112-112C636.9 272.4 640 264.2 640 255.1z"/></svg>
							Learn more about JSON
						</h2>
				        <ul className="tools grid grid-cols-1">
				            <li>
				                <Link href="/mastering-json-format">
				                    Mastering JSON Format: Advantages, Best Practices and Comparison with Other Data Formats
				                </Link>
				            </li>
				            <li>
				                <Link href="/common-mistakes-in-json-and-how-to-avoid-them">
				                    Common JSON Mistakes and How to Avoid Them
				                </Link>
				            </li>
							<li>
				                <Link href="/mastering-json-in-javascript">
				                    Mastering JSON in JavaScript: Comprehensive Examples and Techniques
				                </Link>
				            </li>
							<li>
				                <Link href="/benefits-of-using-a-json-beautifier">
				                    Understanding the Benefits of Using a JSON Beautifier
				                </Link>
				            </li>
							<li>
				                <Link href="/how-to-open-json-file">
				                    How to open JSON files
				                </Link>
				            </li>
				        </ul>
						
					</div>
					
				</div> */}
			</div>
			
		</div>
		</>
	)
}

export async function getStaticProps() {
	
	const title = 'JSON Online Validator and Formatter - JSON Lint'
	const metaTags = [
		{ attribute: 'name', value: 'description', content: 'JSONLint is the free online validator, json formatter, and json beautifier tool for JSON, a lightweight data-interchange format. You can format json, validate json, with a quick and easy copy+paste.' }
	]

	return {
		props: {
			title,
			metaTags
		},
		revalidate: 86400,
	}

}