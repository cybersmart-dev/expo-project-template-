
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
