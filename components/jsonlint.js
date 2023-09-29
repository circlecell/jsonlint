import React, { useState, useEffect, useRef, useContext } from 'react'
import ValidContext from '../contexts/ValidContext'
import jsonlint from 'jsonlint-mod'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'

const JSONLint = ({ json, url }) => {
	const { isValid, setIsValid } = useContext(ValidContext)
	const [isPretty, setIsPretty] = useState(true)
	const [input, setInput] = useState('')
	const [output, setOutput] = useState('')
	const [error, setError] = useState('')
	const editorRef = useRef(null)
	const errorMarkerRef = useRef(null)

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
		<div className="border border-slate-200 dark:border-slate-600 max-w-5xl">
			<CodeMirror
				value={input}
				options={{
					mode: { name: "javascript", json: true },
					lineNumbers: true,
				}}
				editorDidMount={editor => {
					editorRef.current = editor
				}}
				onBeforeChange={(editor, data, value) => {
					setInput(value)
				}}
			/>
		</div>
		<div>
			<button className="py-3 px-4 inline-flex mt-6 justify-center mr-4 items-center gap-2 border-2 border-green-500 text-white bg-green-500 font-semibold text-green-500 hover:text-white hover:bg-green-500 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" onClick={() => handleValidate()}>Validate JSON</button>
			<button className="py-3 px-4 inline-flex justify-center mr-4 items-center gap-2 border-2 border-slate-200 font-semibold text-slate-500 hover:text-white hover:bg-slate-500 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-slate-800" onClick={handleClear}>Clear</button>
			<button className="py-3 px-4 inline-flex justify-center items-center gap-2 border-2 border-slate-200 font-semibold text-slate-500 hover:text-white hover:bg-slate-500 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-slate-800" onClick={handleFormatting}>{isPretty ? "Compress" : "Prettify"}</button>
			
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