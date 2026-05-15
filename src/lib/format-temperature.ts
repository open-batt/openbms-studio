export function formatTemperature(dk: number): string {
	const formatted = (dk / 10 - 273.15).toFixed(1);
	return `${formatted === "-0.0" ? "0.0" : formatted} °C`;
}
