export class QueryResult<T extends object> {
	private content: T | null = null;
	private error: string | null = null;

	public static asEmptySuccessResult() {
		return new QueryResult();
	}

	public static asSuccessResult<T extends object>(content: T) {
		const result = new QueryResult();
		result.content = content;
		return result;
	}

	public static asErrorResult(error: string) {
		const result = new QueryResult();
		result.error = error;
		return result;
	}

	public getContent() {
		return this.content;
	}

	public getError() {
		return this.error;
	}
}
