import React, { useState, useContext } from 'react'
import { parseString } from 'xml2js'
import JSONLint from './jsonlint'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/xml/xml'

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

const XMLtoJSONLint = () => {
	const [xmlInput, setXmlInput] = useState('')
	const [jsonOutput, setJsonOutput] = useState('')
	const [error, setError] = useState(null)
	const [isValid, setIsValid] = useState(null)

	const handleConvert = () => {
		if (!xmlInput.trim()) {
	        setError('XML field cannot be empty')
	        setIsValid(false)
	        return
	    }
	
		parseString(xmlInput, (err, result) => {
			if (err) {
				setError(err.message)
				setIsValid(false)
				return
			}
			const jsonString = JSON.stringify(result, null, 4)
			setJsonOutput(jsonString)
			setError(null)
			setIsValid(true)
		})
	}
	
	const handleClear = () => {
	    setJsonOutput('')
	    setError(null)
	    setIsValid(null)
	}

	return (
		<div>
			
			<div className="grid grid-cols-2 gap-4">
				<div>
					<div className="relative border border-slate-200 dark:border-slate-600">
						<CodeMirror
							value={xmlInput}
							options={{
								mode: 'xml',
								lineNumbers: true,
								foldGutter: true,
								gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
								search: true,
								highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
							}}
							onBeforeChange={(editor, data, value) => {
								setXmlInput(value)
							}}
						/>
					</div>

					<button className="primary-button" onClick={() => handleConvert()}>Convert to JSON</button>
					
				</div>
				<div>
					<JSONLint json={jsonOutput} onClear={handleClear} />
				</div>
			</div>
			
			{isValid === false && 
				<div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 mt-4">
					<span className="font-semibold block mb-2 pt-1">Invalid XML!</span>
					{error && 
						<pre className="py-4 text-xs border-t border-dashed border-red-300">
							{error}
						</pre>
					}
				</div>
			}
		</div>
	)
}

export default XMLtoJSONLint
