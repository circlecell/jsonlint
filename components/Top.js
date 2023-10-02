import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import ValidContext from '../contexts/ValidContext'

export default function Top() {

	const router = useRouter()
	const [theme, setTheme] = useState('system')
	
	const { isValid } = useContext(ValidContext)
	
	const defaultPath = 'M18.5708 20C19.8328 20 20.8568 18.977 20.8568 17.714V13.143L21.9998 12L20.8568 10.857V6.286C20.8568 5.023 19.8338 4 18.5708 4M5.429 4C4.166 4 3.143 5.023 3.143 6.286V10.857L2 12L3.143 13.143V17.714C3.143 18.977 4.166 20 5.429 20M7.5 12H7.51M12 12H12.01M16.5 12H16.51M8 12C8 12.2761 7.77614 12.5 7.5 12.5C7.22386 12.5 7 12.2761 7 12C7 11.7239 7.22386 11.5 7.5 11.5C7.77614 11.5 8 11.7239 8 12ZM12.5 12C12.5 12.2761 12.2761 12.5 12 12.5C11.7239 12.5 11.5 12.2761 11.5 12C11.5 11.7239 11.7239 11.5 12 11.5C12.2761 11.5 12.5 11.7239 12.5 12ZM17 12C17 12.2761 16.7761 12.5 16.5 12.5C16.2239 12.5 16 12.2761 16 12C16 11.7239 16.2239 11.5 16.5 11.5C16.7761 11.5 17 11.7239 17 12Z'
	const validPath = 'M18.5708 20C19.8328 20 20.8568 18.977 20.8568 17.714V13.143L21.9998 12L20.8568 10.857V6.286C20.8568 5.023 19.8338 4 18.5708 4M5.429 4C4.166 4 3.143 5.023 3.143 6.286V10.857L2 12L3.143 13.143V17.714C3.143 18.977 4.166 20 5.429 20M7.5 12L9.93431 14.4343C10.1323 14.6323 10.2313 14.7313 10.3455 14.7684C10.4459 14.8011 10.5541 14.8011 10.6545 14.7684C10.7687 14.7313 10.8677 14.6323 11.0657 14.4343L16.5 9'
	const invalidPath = 'M18.5708 20C19.8328 20 20.8568 18.977 20.8568 17.714V13.143L21.9998 12L20.8568 10.857V6.286C20.8568 5.023 19.8338 4 18.5708 4M5.429 4C4.166 4 3.143 5.023 3.143 6.286V10.857L2 12L3.143 13.143V17.714C3.143 18.977 4.166 20 5.429 20M8 12H16'

	const getSystemTheme = () => {
	    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	        return 'dark'
	    }
	    return 'light'
	}
	
	useEffect(() => {
	    const storedTheme = localStorage.getItem('theme')
	    if (storedTheme) {
	        setTheme(storedTheme)
	    } else {
	        setTheme(getSystemTheme())
	    }
	}, [])
	
	useEffect(() => {
	    if (theme === 'dark') {
	        document.body.classList.add('dark')
	    } else {
	        document.body.classList.remove('dark')
	    }
	}, [theme])
	
	const toggleTheme = () => {
	    if (theme === 'light' || theme === 'system') {
	        setTheme('dark')
	        localStorage.setItem('theme', 'dark')
	        document.body.classList.add('dark')
	    } else {
	        setTheme('light')
	        localStorage.setItem('theme', 'light')
	        document.body.classList.remove('dark')
	    }
	}
	
	return (
		<>
		<div>
		  	<nav className="bg-white dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 font-bold font-system">
				<div className="mx-auto w-full px-6 lg:px-6">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center w-full">
							<Link href="/" className="flex-shrink-0 normal-case" onClick={(e) => {e.preventDefault();window.location.href = '/';}}>
								<div className="flex">
									<span className="flex">
										<svg className="logo text-slate-800 dark:text-slate-200 max-w-none mr-3 mt-1" fill="none" height="46" width="46" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path 
											 	d={isValid === true ? validPath : (isValid === false ? invalidPath : defaultPath)}
												strokeLinecap="round" 
												strokeLinejoin="round" 
												strokeWidth="2" 
												className="stroke-current"
											/>
										</svg>
									</span>
									<h1 className="hidden lg:block flex py-2 text-lg leading-5 font-semibold mr-12 font-['MonoLisa'] dark:text-slate-300">JSONLint <span className="block text-sm subtitle">Validator and Formatter</span></h1>
								</div>
							</Link>
						</div>
						<div className="hidden md:block">
							<div className="ml-4 flex items-center md:ml-6 whitespace-nowrap">
								<button onClick={toggleTheme} className="focus:outline-none">
									{theme === 'light' ? (
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-400">
										    <circle cx="12" cy="12" r="5" className="fill-current"/>
										    <path d="M21,13H20a1,1,0,0,1,0-2h1a1,1,0,0,1,0,2Z" className="fill-current"/>
										    <path d="M4,13H3a1,1,0,0,1,0-2H4a1,1,0,0,1,0,2Z" className="fill-current"/>
										    <path d="M17.66,7.34A1,1,0,0,1,17,7.05a1,1,0,0,1,0-1.41l.71-.71a1,1,0,1,1,1.41,1.41l-.71.71A1,1,0,0,1,17.66,7.34Z" className="fill-current"/>
										    <path d="M5.64,19.36a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.41L5.64,17a1,1,0,0,1,1.41,1.41l-.71.71A1,1,0,0,1,5.64,19.36Z" className="fill-current"/>
										    <path d="M12,5a1,1,0,0,1-1-1V3a1,1,0,0,1,2,0V4A1,1,0,0,1,12,5Z" className="fill-current"/>
										    <path d="M12,22a1,1,0,0,1-1-1V20a1,1,0,0,1,2,0v1A1,1,0,0,1,12,22Z" className="fill-current"/>
										    <path d="M6.34,7.34a1,1,0,0,1-.7-.29l-.71-.71A1,1,0,0,1,6.34,4.93l.71.71a1,1,0,0,1,0,1.41A1,1,0,0,1,6.34,7.34Z" className="fill-current"/>
										    <path d="M18.36,19.36a1,1,0,0,1-.7-.29L17,18.36A1,1,0,0,1,18.36,17l.71.71a1,1,0,0,1,0,1.41A1,1,0,0,1,18.36,19.36Z" className="fill-current"/>
										</svg>
									) : (
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-400">
											<path d="M20.21,15.32A8.56,8.56,0,1,1,11.29,3.5a.5.5,0,0,1,.51.28.49.49,0,0,1-.09.57A6.46,6.46,0,0,0,9.8,9a6.57,6.57,0,0,0,9.71,5.72.52.52,0,0,1,.58.07A.52.52,0,0,1,20.21,15.32Z" className="fill-current"/>
										</svg>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</div>
		</>
	)
}