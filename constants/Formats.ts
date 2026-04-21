export const formatNumberSafe = (num) => {
  const safe = Number(num);

  if (isNaN(safe)) return "0"; // fallback when offline or invalid
  return safe.toLocaleString();
};

export const formatNumber = (num: number) => {
  const f = Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (isNaN(toNumber(f.replaceAll(',','')))) {
    return "0.00"
  }
  return f;
};
export const formatNumberWithDecimal = (num, dec) => {
  const f = Number(num).toLocaleString(undefined, {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

  return f;
};

export const toNumber = (numString) => {
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

export const getColor = (
  type: string,
  status: string,
  amount_format: string,
  side: string,
) => {
  type = type?.toLowerCase();
  status = status?.toLowerCase();

  if (type == "transfer" && status == "success") {
    return "red";
  }
  if (type == "transfer" && status == "pending") {
    return "yellow";
  }
  if (type == "deposit" && status == "pending") {
    return "yellow";
  }
  if (type == "deposit" && status == "success") {
    return "green";
  }
  if (type == "deposit" && status == "failed") {
    return "red";
  }
  if (status == "success") {
    if (side === "CREDIT") {
      return "green";
    }
    return "red";
  }
  if (status == "failed") {
    return "red";
  }
  if (status == "pending") {
    return "yellow";
  }
  if (status == "cancelled") {
    return "gray";
  }
};

const TransferTypes = [
  { type: "ESCROW_LOCK", icon: "cash-lock" },
  { type: "WITHDRAW", icon: "call-made" },
  { type: "CONVERT", icon: "sync" },
  { type: "DEPOSIT", icon: "call-received" },
  { type: "REFUND", icon: "arrow-u-down-right" },
];

export const getTransferTypeIcon = (type) => {
  return TransferTypes.find((item) => item.type == type)?.icon;
};

export const getStatusIcon = (status) => {
  if (status?.toLowerCase() == "success") {
    return "check";
  }
  if (status?.toLowerCase() == "failed") {
    return "close";
  }
  if (status?.toLowerCase() == "pending") {
    return "clock";
  }
  if (status?.toLowerCase() == "cancelled") {
    return "close";
  }
};
