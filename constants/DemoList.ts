import { NetworksType } from "./Types";

export const Networks: NetworksType = [
  {
    id: 1,
    name: "mtn",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwgL5yNmWXTDyJ_l4pwTA6QlY3wEcUeE8Bng&s",
  },
  {
    id: 2,
    name: "airtel",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbtnOWST4RtneU4tHYLmaG4Z2ejYQe6Qhq8w&s",
  },
  {
    id: 3,
    name: "glo",
    icon: "https://cdn.punchng.com/wp-content/uploads/2025/07/15224513/Globacom-logo.jpg",
  },
  {
    id: 4,
    name: "9mobile",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ5NyP_4Se11SXnz9hvsbF829TqjE23u-0hg&s",
  },
];


export const Transactions = [
  {
    id: 1,
    status: "Success",
    side: "CREDIT",
    title: "DEPOSIT",
    type: "Bank Transfer",
    description: "Your deposit of 1,000.00 was successfully",
    date: "1 JUN 26",
    amount: 1000.0,
    ref: "",
    data: {
      type: "transfer",
    },
  },
  {
    id: 2,
    status: "Success",
    side: "DEBIT",
    title: "BUY DATA",
    type: "Data",
    description: "You successfully buy MTN 1.5GB data for 500.00",
    date: "1 JUN 26",
    amount: 500.0,
    ref: "",
    data: {
      type: "data",
      phone: "07026426748",
      plan: "1.5GB / 7 days",
      network: "MTN",
    },
  },
];

export const BettingProviders = [
  {
    id: 1,
    name: 'SpotyBet',
    icon: 'https://play-lh.googleusercontent.com/ey2jDyUUJtjMT6T8Lli343tlCNM9HpEE4xbvh4I9zfIA2LCs9oZuWZTbS6OrlvMbqNSHQ83_mXiLmfSE1BllvQ=w240-h480-rw'
  },
  {
    id: 2,
    name: 'MSport',
    icon: 'https://play-lh.googleusercontent.com/KTIOJFZff5nOlKJnkvhUBGqfzb0e7bsryCeMKIhbIozG8camnhxwJx5-98wkrqvcOKnE'
  },
  {
    id: 3,
    name: 'Bet9ja',
    icon:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNKCRQfT6yRkTPZf_-e5EbT6uP_7LVadvZ9g&s'
  },
  {
    id: 4,
    name: '1XBet',
    icon:'https://play-lh.googleusercontent.com/V7bL_5xtOgCFPbsN44iK4MdtdnXb07ik04FJb7gaubqbrD4ISlW7XpH4tbq0spO_LDY'
  }
]

export const ElectricityProviders = [
  { 
    id: 1, 
    name: 'Abuja Electricity Distribution Company (AEDC)', 
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgHsb5YJU2dia5vHvyu6NvWt4uByN5SL5maA&s' 
  },
  { 
    id: 2, 
    name: 'Ikeja Electric (IE)', 
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO67XEjr6aybwENzYyZSGv0tbIEANaIBdQeA&s' 
  },
  { 
    id: 3, 
    name: 'Eko Electricity Distribution Company (EKEDC)', 
    icon: 'https://pbs.twimg.com/profile_images/1346732336319225858/XBNsf7VS_400x400.jpg' 
  },
  { 
    id: 4, 
    name: 'Ibadan Electricity Distribution Company (IBEDC)', 
    icon: 'https://media.licdn.com/dms/image/v2/C4D0BAQEQAc7yg5nZyg/company-logo_200_200/company-logo_200_200/0/1631360224928?e=2147483647&v=beta&t=DzaotXKZ_zz3pKl4HfhJtuxzKlhBN6kowALWwgM2pGE' 
  },
  { 
    id: 5, 
    name: 'Enugu Electricity Distribution Company (EEDC)', 
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgxhNVpkFZgJ9KeRty6P4N4QDI7EkwgGb3mQ&s' 
  },
  { 
    id: 6, 
    name: 'Benin Electricity Distribution Company (BEDC)', 
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb8W16Z_MMng4r6RfkelaKuSfCkKGUTaEpOQ&s' 
  },
  { 
    id: 7, 
    name: 'Port Harcourt Electricity Distribution Company (PHED)', 
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEDF9iNNe-4_Luup_HB1uZ78z_8xZpM-QIHg&s' 
  },
  { 
    id: 8, 
    name: 'Jos Electricity Distribution Company (JEDC)', 
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd0Oq-Te-mgvnNDucN1-EEt90TbgPInq2LZQ&s' 
  },
  { 
    id: 9, 
    name: 'Kano Electricity Distribution Company (KEDCO)', 
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMJO7efYpIaUXqIzY6ufChWnd4uXUbatsi3w&s' 
  },
  { 
    id: 10, 
    name: 'Kaduna Electric (KAEDC)', 
    icon: 'https://cdn.businessday.ng/wp-content/uploads/2024/01/KAEDC.png' 
  },
  { 
    id: 11, 
    name: 'Yola Electricity Distribution Company (YEDC)', 
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdetOBuUodzK4QU13Kmfnr9RRmaKe2ap91tQ&s' 
  },
  { 
    id: 12, 
    name: 'Aba Power Electric Company (APLE)', 
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz2KvMYrZionxZQkXFuw25Wwj1T6445HoLIQ&s' 
  }
];

export const CableTVSubscription = [
  {
    id: 1,
    name: "GOTV",
    icon: "https://getlogo.net/wp-content/uploads/2021/05/gotv-nigeria-logo-vector.png",
    plans: [
      {
        id: 1,
        name: "GOTV 500 super",
        amount: 500,
      },
    ],
  },
  {
    id: 2,
    name: "DSTV",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdvcooV9w7FCAa8YdqKD7KWeXGio73Y71wUw&s",
    plans: [
      {
        id: 1,
        name: "DSTV 500 super",
        amount: 500,
      },
    ],
  },
  {
    id: 3,
    name: "StarTimes",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9fkKAS5ttwnbR8yXoC5y_m2Eemf0UwtjsIQ&s",
    plans: [
      {
        id: 1,
        name: "StartTime 500 super",
        amount: 500,
      },
    ],
  },
];
