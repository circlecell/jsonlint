import { createContext } from 'react'

const ValidContext = createContext({
	isValid: null,
	setIsValid: () => {}
})

export default ValidContext