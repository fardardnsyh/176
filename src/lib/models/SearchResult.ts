export default interface SearchResult {
	url: string;
	name: string;
	recordType: RecordType;
}

export enum RecordType {
	ACCOUNT,
	EXPENSE,
	TAG
}
