import moment from 'moment/moment';

export class DateTimeHelper {
	public static DEFAULT_SERVER_DATE_FORMAT: string = 'YYYY-MM-DD';
	public static DEFAULT_SERVER_DATETIME_FORMAT: string = 'YYYY-MM-DDTHH:mm:ss';
	public static DEFAULT_SERVER_TIME_FORMAT: string = 'HH:mm';
	public static DEFAULT_LOCAL_FORMAT: string = 'DD-MM-YYYY HH:mm';

	private static toUtc(dateTime: any): moment.Moment {
		return moment(dateTime).utc();
	}

	private static toLocal(datetime: any): moment.Moment {
		return moment(datetime);
	}

	public static toLocalString(datetime: any, isDefault?: boolean, format?: string): string {
		if (!datetime) return 'N/A';
		if (format) return DateTimeHelper.toLocal(datetime).format(format);
		else if (isDefault) return DateTimeHelper.toLocal(datetime).format('MMM DD, YYYY');
		else return DateTimeHelper.toLocal(datetime).format(); //ISO-8601
	}

	public static toUtcString(datetime: any, isDefault?: boolean, format?: string): any {
		if (format) return DateTimeHelper.toUtc(datetime).format(format);
		else if (isDefault) return DateTimeHelper.toUtc(datetime).format('MMM DD, YYYY');
		else return DateTimeHelper.toUtc(datetime).format(); //ISO-8601
	}

	public static changeToUTCTimeZone(dateTime: Date): Date {
		return moment(dateTime).utc(true).toDate();
	}

	public static formatDate(dateTime: Date, format?: string): string {
		let momentObj = moment(dateTime);
		if (format) {
			return momentObj.format(format);
		} else {
			return momentObj.toISOString();
		}
	}

	public static parseDate(dateTime: string, format?: string): Date {
		if (format) {
			return moment(dateTime, format).toDate();
		} else {
			return moment(dateTime, moment.ISO_8601).toDate();
		}
	}

	public static get yesterday(): Date {
		return moment().add(-1, 'days').startOf('day').toDate();
	}

	public static addYears(dateTime: Date, numberOfYears: number): Date {
		return moment(dateTime).add(numberOfYears, 'years').toDate();
	}

	public static subtractYears(dateTime: Date, numberOfYears: number): Date {
		return moment(dateTime).subtract(numberOfYears, 'years').toDate();
	}

	public static addMonths(dateTime: Date, numberOfMonths: number): Date {
		return moment(dateTime).add(numberOfMonths, 'months').toDate();
	}

	public static subtractDays(dateTime: Date, numberOfDays: number): Date {
		return moment(dateTime).subtract(numberOfDays, 'days').toDate();
	}

	public static addDays(dateTime: Date, numberOfDays: number): Date {
		return moment(dateTime).add(numberOfDays, 'days').toDate();
	}

	public static subtractHours(dateTime: Date, numberOfHourse: number): Date {
		return moment(dateTime).subtract(numberOfHourse, 'hours').toDate();
	}

	public static addHours(dateTime: Date, numberOfHourse: number): Date {
		return moment(dateTime).add(numberOfHourse, 'hours').toDate();
	}

	public static subtractMonths(dateTime: Date, numberOfMonths: number): Date {
		return moment(dateTime).subtract(numberOfMonths, 'months').toDate();
	}

	public static dateIsAfter(dateTime: Date, ofDateTime: Date): boolean {
		return moment(dateTime).isAfter(ofDateTime);
	}

	public static dateIsBefore(dateTime: Date, ofDateTime: Date): boolean {
		return moment(dateTime).isBefore(ofDateTime);
	}

	public static dateIsSameOrBefore(dateTime: Date, ofDateTime: Date): boolean {
		return moment(dateTime).isSameOrBefore(ofDateTime);
	}

	public static getStartOfYear(dateTime: Date): Date {
		return moment(dateTime).startOf('year').toDate();
	}

	public static getYearDifference(firstdate: Date, secondDate: Date, exactDifference: boolean = true): number {
		return moment(firstdate).diff(secondDate, 'years', exactDifference);
	}

	public static getDayDifference(firstdate: Date, secondDate: Date): number {
		return moment(firstdate).diff(secondDate, 'days');
	}

	public static roundToNearest30Minutes(date: Date): Date {
		const momentDate = moment(date);
		const remainder = 30 - (momentDate.minute() % 30);
		return moment(momentDate).add(remainder, 'minutes').toDate();
	}

	public static getCurrentMillis(): number {
		return moment.now();
	}

	public static getMonthEnd(): number {
		return moment().endOf('month').date();
	}

	/**
	 * returns start of the month date in YYYY-MM-DD format
	 */
	public static getMonthStartInServerFormat(): string {
		return moment().startOf('month').format('YYYY-MM-DD');
	}

	/**
	 * returns end of the month date in YYYY-MM-DD format
	 */
	public static getMonthEndInServerFormat(): string {
		return moment().endOf('month').format('YYYY-MM-DD');
	}

	/**
	 * returns end of the month date in YYYY-MM-DD format
	 */
	public static getCurrentDateInServerFormat(): string {
		return moment().format('YYYY-MM-DD');
	}

	/**
	 * returns end of the month date in YYYY-MM-DD format
	 */
	public static getMonthRangeInServerFormat(): { fromDate: string; toDate: string } {
		return {
			fromDate: DateTimeHelper.getMonthStartInServerFormat(),
			toDate: DateTimeHelper.getMonthEndInServerFormat(),
		};
	}

	public static setTimeToDefaultValue(date: Date): Date {
		date.setHours(0, 0, 0, 0);
		return date;
	}

	public static setTimeToEndOfDayValue(date: Date): Date {
		date.setHours(23, 59, 59, 0);
		return date;
	}

	public static utcToLocalString(utcTimestamp: string, is24HourFormat: boolean = false, includeTime: boolean = true): string {
		let format = 'DD-MM-YYYY h:mm A';

		if (is24HourFormat) {
			format = 'DD-MM-YYYY HH:mm';
		}

		if (!includeTime) {
			format = 'DD-MM-YYYY';
		}
		const utcMoment = moment.utc(utcTimestamp);
		const localUtcMoment = utcMoment.local();
		const formattedUtcString = localUtcMoment.format(format);
		const localTimeString = moment.utc(formattedUtcString, format).local();

		return localTimeString.format(format);
	}

	public static convertLocalString(localTimeStamp: string) {
		const localUtcMoment = moment(localTimeStamp).local();
		const localTimeString = moment.utc(localUtcMoment, 'DD-MM-YYYY h:mm A').local();
		return localTimeString.format('YYYY-MM-DD h:mm A');
	}

	public static isIsoDate(date: string): boolean {
		if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(date)) return false;
		const d = new Date(date);
		return d instanceof Date && !isNaN(d.getTime()) && d.toISOString() === date;
	}
}
