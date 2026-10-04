export type Currency = {
  short_code: string;
  name: string;
};

export type Conversion = {
  value: number;
  from: string;
  to: string;
  amount: number;
  date: string;
};
