
export type DataPackType = {
  id: number;
  price: number;
  validity: string;
  benefits: string;
};

export type NetworksType = Array<{
  id: number;
  name: "mtn" | "airtel" | "glo" | "9mobile";
  icon: string;
}>;

export type BeneficiaryType = {
  phone_number: string,
  network: NetworksType[0] | undefined
}

export type UserInfoType = {
  email: string
  full_name: string
  phone_number: string
  referral_code: string
  wallet: {
    balance: number
    airtime2cash: number
    cashback: number
    bonus: number
  }
}