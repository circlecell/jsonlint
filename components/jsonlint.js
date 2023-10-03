import React, { useState, useEffect, useRef, useContext } from 'react'
import ValidContext from '../contexts/ValidContext'
import jsonlint from 'jsonlint-mod'
import copy from 'copy-to-clipboard'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'

// Fold
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/foldgutter.css'

// Search
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/matchesonscrollbar.css'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/search'
import 'codemirror/addon/scroll/annotatescrollbar'
import 'codemirror/addon/search/matchesonscrollbar'
import 'codemirror/addon/search/jump-to-line'

const JSONLint = ({ json, url }) => {
	const { isValid, setIsValid } = useContext(ValidContext)
	const [isPretty, setIsPretty] = useState(true)
	const [input, setInput] = useState('')
	const [output, setOutput] = useState('')
	const [error, setError] = useState('')
	const editorRef = useRef(null)
	const errorMarkerRef = useRef(null)
	const [copySuccess, setCopySuccess] = useState(false)

	const handleValidate = (jsonToValidate = input) => {
		if (errorMarkerRef.current) {
			errorMarkerRef.current.clear()
			errorMarkerRef.current = null
		}

		try {
			const parsed = jsonlint.parse(jsonToValidate)
			const indentedJson = JSON.stringify(parsed, null, 4)
			setOutput(indentedJson)
			setInput(indentedJson)
			setError('')
			setIsValid(true)
			document.body.classList.add('valid')
			document.body.classList.remove('invalid')
		} catch (e) {
			setOutput('')
			setError(e.toString())
			setIsValid(false)
			document.body.classList.add('invalid')
			document.body.classList.remove('valid')
			const match = e.toString().match(/line (\d+)/)
			if (match) {
				const lineNumber = parseInt(match[1], 10) - 1
				errorMarkerRef.current = editorRef.current.markText(
					{ line: lineNumber, ch: 0 },
					{ line: lineNumber + 1, ch: 0 },
					{ className: 'cm-error-highlight' }
				)
			}
		}
	}
	
	const handleFormatting = () => {
	    try {
	        const parsed = JSON.parse(input)
	        if (isPretty) {
	            const compressed = JSON.stringify(parsed)
	            setInput(compressed)
	        } else {
	            const pretty = JSON.stringify(parsed, null, 4)
	            setInput(pretty)
	        }
	        setIsPretty(!isPretty)
	    } catch (error) {
	        setError(`Failed to format JSON: ${error.message}`)
	    }
	}
	
	const handleClear = () => {
		if (editorRef.current) {
			editorRef.current.setValue('')
			setInput('')
			setError('')
			setOutput('')
			setIsValid(null)
			document.body.classList.remove('valid', 'invalid')
		}
	}
	
	const handleCopy = () => {
		copy(input)
		setCopySuccess(true)
		setTimeout(() => setCopySuccess(false), 2000)
	}
	
	useEffect(() => {
	    if (json) {
	        const decodedJson = decodeURIComponent(json)
	        setInput(decodedJson)
	        setTimeout(() => handleValidate(decodedJson), 0)
	    } else if (url) {
	        fetch(decodeURIComponent(url))
	            .then(response => response.json())
	            .then(data => {
	                const fetchedJson = JSON.stringify(data, null, 4)
	                setInput(fetchedJson)
	                setTimeout(() => handleValidate(fetchedJson), 0)
	            })
	            .catch(error => {
	                setError(`Failed to fetch JSON from URL: ${error.message}`)
	                setIsValid(false)
	            })
	    }
	}, [json, url])

	return (
		<>
		<div className="relative border border-slate-200 dark:border-slate-600">
			<CodeMirror
				value={input}
				options={{
					mode: { name: "javascript", json: true },
					lineNumbers: true,
					foldGutter: true,
					gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
					matchBrackets: true,
					autoCloseBrackets: true,
					search: true,
					highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
				}}
				editorDidMount={editor => {
					editorRef.current = editor
				}}
				onBeforeChange={(editor, data, value) => {
					setInput(value)
				}}
			/>
			<button 
			    className="absolute top-2 right-6 p-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400" 
			    onClick={handleCopy} 
			    title="Copy to clipboard"
			>
			    {copySuccess ? (
	                // Checkmark SVG
					<svg width="24" height="24" className="px-1 py-1 text-green-500" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
						<path 
							fill="currentColor" 
							stroke="currentColor" 
							d="M480 128c0 8.188-3.125 16.38-9.375 22.62l-256 256C208.4 412.9 200.2 416 192 416s-16.38-3.125-22.62-9.375l-128-128C35.13 272.4 32 264.2 32 256c0-18.28 14.95-32 32-32c8.188 0 16.38 3.125 22.62 9.375L192 338.8l233.4-233.4C431.6 99.13 439.8 96 448 96C465.1 96 480 109.7 480 128z"
						/>
					</svg>
	            ) : (
	                // Copy SVG
	                <svg width="24" height="24" className="px-1 py-1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				        <path 
				            fill="currentColor" 
				            stroke="currentColor" 
				            d="M448 0H224C188.7 0 160 28.65 160 64v224c0 35.35 28.65 64 64 64h224c35.35 0 64-28.65 64-64V64C512 28.65 483.3 0 448 0zM464 288c0 8.822-7.178 16-16 16H224C215.2 304 208 296.8 208 288V64c0-8.822 7.178-16 16-16h224c8.822 0 16 7.178 16 16V288zM304 448c0 8.822-7.178 16-16 16H64c-8.822 0-16-7.178-16-16V224c0-8.822 7.178-16 16-16h64V160H64C28.65 160 0 188.7 0 224v224c0 35.35 28.65 64 64 64h224c35.35 0 64-28.65 64-64v-64h-48V448z"
				        />
				    </svg>
	            )}
			</button>
		</div>
		<div>
			<button className="py-3 px-4 inline-flex mt-6 justify-center mr-4 items-center gap-2 border-2 border-green-500 text-white bg-green-500 font-semibold text-green-500 hover:text-white hover:bg-green-500 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" onClick={() => handleValidate()}>Validate JSON</button>
			<button className="py-3 px-4 inline-flex mt-6 justify-center mr-4 items-center gap-2 border-2 border-slate-200 font-semibold text-slate-500 hover:text-white hover:bg-slate-500 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-slate-800" onClick={handleClear}>Clear</button>
			<button className="py-3 px-4 inline-flex mt-6 justify-center items-center gap-2 border-2 border-slate-200 font-semibold text-slate-500 hover:text-white hover:bg-slate-500 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-slate-800" onClick={handleFormatting}>{isPretty ? "Compress" : "Prettify"}</button>
			
			{isValid === true && 
			    <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-2 mt-4">
			        JSON is valid!
			    </div>
			}
			
			{isValid === false && 
			    <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 mt-4">
			        <span className="font-semibold block mb-2 pt-1">Invalid JSON!</span>
					{error && 
						<pre className="py-4 text-xs border-t border-dashed border-red-300">
							{error}
						</pre>
					}
			    </div>
			}
			
		</div>
		</>
	)
}

export default JSONLint