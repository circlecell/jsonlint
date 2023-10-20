import React, { useState, useRef } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import copy from 'copy-to-clipboard'
import 'codemirror/lib/codemirror.css'
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

const JSONStringifier = () => {
    const [jsonInput, setJsonInput] = useState('')
    const [stringifiedOutput, setStringifiedOutput] = useState('')
	const editorRef = useRef(null)
	const [copySuccess, setCopySuccess] = useState(false)
	
    const handleStringify = () => {
	    if (!jsonInput.trim()) {
	        setStringifiedOutput('Input field cannot be empty')
	        return
	    }
	
	    try {
	        const parsedJSON = JSON.parse(jsonInput)
	        const standardStringified = JSON.stringify(parsedJSON)
	        const escapedStringified = standardStringified.replace(/"/g, '\\"')
	        setStringifiedOutput('"' + escapedStringified + '"')
	    } catch (error) {
	        setStringifiedOutput('Invalid JSON: ' + error.message)
	    }
	}
	
	const handleClear = () => {
        if (editorRef.current) {
            editorRef.current.setValue('')
            setJsonInput('')
            setStringifiedOutput('')
        }
        // Check if the onClear callback from the parent component exists
        if (typeof onClear === 'function') {
            onClear()
        }
    }
	
	const handleCopy = () => {
		copy(stringifiedOutput)
		setCopySuccess(true)
		setTimeout(() => setCopySuccess(false), 2000)
	}

    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <div className="relative border border-slate-200 dark:border-slate-600">
                    <CodeMirror
                        value={jsonInput}
                        options={{
                            mode: 'javascript',
                            lineNumbers: true,
                            foldGutter: true,
                            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                            search: true,
                            highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
                        }}
                        onBeforeChange={(editor, data, value) => {
                            setJsonInput(value);
                        }}
						editorDidMount={editor => { editorRef.current = editor }}
                    />
                </div>

				<button className="primary-button" onClick={() => handleStringify()}>Stringify JSON</button>
				<button className="secondary-button" onClick={handleClear}>Clear</button>
            </div>
            <div className="relative">
                <CodeMirror
                    value={stringifiedOutput}
                    options={{
                        mode: 'javascript',
                        lineNumbers: true,
                        foldGutter: true,
                        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                        search: true,
                        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
                        lineWrapping: true
                    }}
                />
				<button 
				    className="absolute top-2 right-6 p-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 dark:bg-slate-500 dark:border-slate-400" 
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
        </div>
    )
}

export default JSONStringifier