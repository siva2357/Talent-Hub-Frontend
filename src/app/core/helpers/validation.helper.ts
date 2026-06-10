export class ValidationHelper {

  static isValidPAN(pan: string): boolean {

    if (!pan) {
      return false;
    }

    return /^[A-Z]{5}[0-9]{4}[A-Z]$/
      .test(pan.trim().toUpperCase());
  }

  static isValidAadhaar(aadhaar: string): boolean {

    if (!aadhaar) {
      return false;
    }

    return /^\d{12}$/
      .test(aadhaar.replace(/\s/g, ''));
  }

  static isValidIFSC(ifsc: string): boolean {

    if (!ifsc) {
      return false;
    }

    return /^[A-Z]{4}0[A-Z0-9]{6}$/
      .test(ifsc.trim().toUpperCase());
  }

  static isValidAccountNumber(
    accountNumber: string
  ): boolean {

    if (!accountNumber) {
      return false;
    }

    return /^[0-9]{9,18}$/
      .test(accountNumber.trim());
  }

  static isValidAccountHolderName(
    holderName: string
  ): boolean {

    if (!holderName) {
      return false;
    }

    return /^[A-Za-z\s]{3,100}$/
      .test(holderName.trim());
  }

  static isValidBankName(
    bankName: string
  ): boolean {

    if (!bankName) {
      return false;
    }

    return /^[A-Za-z\s&().,-]{2,100}$/
      .test(bankName.trim());
  }

}