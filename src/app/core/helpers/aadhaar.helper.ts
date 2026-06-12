export class AadhaarHelper {

  static isValid(aadhaar: string): boolean {

    if (!aadhaar) {
      return false;
    }

    const clean = aadhaar.replace(/\s/g, '');

    return /^\d{12}$/.test(clean);
  }

}