export class PanHelper {

  private static readonly PAN_REGEX =
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  static isValid(pan: string): boolean {
    if (!pan) {
      return false;
    }
    return this.PAN_REGEX.test(
      pan.trim().toUpperCase()
    );
  }

  static format(pan: string): string {
    if (!pan) {
      return '';
    }
    return pan.trim().toUpperCase();
  }
}