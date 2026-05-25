export type LogSeverity = "info" | "warn" | "error";

export interface LogEntry {
	id: string;
	timestamp: Date;
	severity: LogSeverity;
	message: string;
}

export interface TestConfigField {
	key: string;
	label: string;
	unit?: string;
	default: number;
}

export interface TestDef {
	id: string;
	label: string;
	config: TestConfigField[];
}
