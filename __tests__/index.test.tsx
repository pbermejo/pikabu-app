import { validations } from '../utils'

test('Is valid email', () => {
	const email = 'test@email.com'
	expect(validations.isValidEmail(email)).toBe(true)
})

test('Is email', () => {
	const email = 'test@email.com'
	expect(validations.isEmail(email)).toBe(undefined)
})
