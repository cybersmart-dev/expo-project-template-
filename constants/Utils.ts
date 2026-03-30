export function isValidMobileNumber(mobileNumber: string) {
  if (!mobileNumber) {
    return false;
  }

  if (mobileNumber.trim().length == 14 && mobileNumber.startsWith("+234")) {
    return true;
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

export function toNumber(num: string) {
  return new Number(num).valueOf();
}

export class Timer {
  time;
  constructor() {
    this.time = 0;
  }

  async postDelayedAsync({ sec = 100 } = {}) {
    const promise = new Promise((resolve, reject) => {
      this.time = setTimeout(() => {
        resolve(true);
        clearTimeout(this.time);
        this.time = 0;
      }, sec);
    });
    return await promise;
  }

  clearTimer() {
    clearTimeout(this.time)
    this.time = 0
  }
}
