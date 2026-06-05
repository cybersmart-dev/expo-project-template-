export const formatNumberSafe = (num:number) => {
  const safe = Number(num);

  if (isNaN(safe)) return "0"; // fallback when offline or invalid
  return safe.toLocaleString();
};

export const formatNumber = (num: number) => {
  const f = Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (isNaN(toNumber(f.replaceAll(",", "")))) {
    return "0.00";
  }
  return f;
};


export const toNumber = (numString:string) => {
  return new Number(numString).valueOf();
};
export const maskEmail = (email: string) => {
  if (email) {
    const [user, domain] = email.split("@");

    if (user.length <= 2) {
      return user[0] + "****" + "@" + domain;
    }

    const first = user[0];
    const last = user.slice(-2);

    return `${first}****${last}@${domain}`;
  }

  return "";
};

export const getTransactionSideFormat = (side: string, amount: number, status?: string) => {
  if (side.toUpperCase() == "DEBIT") {

    if (status == "PENDING") {
      return {
        color: "orange",
        format: `~ ₦${formatNumber(amount)}`,
      };
    }

    return {
      color: "red",
      format: `- ₦${formatNumber(amount)}`,
    };
  }

  if (side.toUpperCase() == "CREDIT") {

    if (status == "PENDING") {
      return {
        color: "orange",
        format: `+ ₦${formatNumber(amount)}`,
      };
    }
 
      return {
        color: "green",
        format: `+ ₦${formatNumber(amount)}`,
      };
      
  }
  
  return {
    color: "black",
    format: `₦${formatNumber(amount)}`,
  };
  
};
