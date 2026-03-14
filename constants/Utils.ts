export function isValidMobileNumber(mobileNumber: string) {
  if (!mobileNumber) {
    return false;
  }
  if (mobileNumber.trim().length < 10) {
    return false;
  }
  if (mobileNumber.startsWith("0") && mobileNumber.trim().length < 11) {
    return false;
  }
  if (!mobileNumber.startsWith("0") && mobileNumber.trim().length > 10) {
    return false;
  }

  return true;
}
