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

export function toNumber(num: string | number) {
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
    clearTimeout(this.time);
    this.time = 0;
  }
}

export const formatDate = (dateString: string) => {
  return dateString ? new Date(dateString).toDateString() : "N/A";
};

export class Interval {
  count;
  interval;
  constructor(count: number) {
    this.count = count;
    this.interval = 0;
  }

  async listinerAsync(
    setCounterState: React.Dispatch<React.SetStateAction<number>>,
  ) {
    const promise = new Promise((resolve, reject) => {
      this.interval = setInterval(() => {
        this.count -= 1;
        setCounterState(this.count);
        if (this.count <= 0) {
          resolve(this.count);
          this.clear();
        }
      }, 1000);
    });
    return await promise;
  }

  clear() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
  }
}
