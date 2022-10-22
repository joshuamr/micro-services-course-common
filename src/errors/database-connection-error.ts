import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError {
	reason = 'Error connecting to database'
	statusCode = 500
	constructor() {
		super('Error connecting to database')
		Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
	}

	serializeErrors() {
		console.log(`Handling db connection error ${this.message}: ${JSON.stringify(this.stack)}`)
		return [{message: this.reason}]
	}
}