export interface PaginationFetch<T> {
  currentPage?: number;
  data?: Array<T>;
  total?: number;
  totalPages?: number;
}
export interface Reservation {
  _id: string;
  table: string;
  user: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  _id: string;
  reservation: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
export interface Food {
  _id: string
  name: string
  desc: string
  price: number
  img: string
  type: string
  createdAt: string
  updatedAt: string
}
export interface Status {
  _id: string
  name: string
}
export interface FoodType {
  _id: string
  name: string
  desc: string
}

export interface Ingredient {
  _id: String;
  name: String;
  desc: String;
  stock: number;
  stockFlag: number;
  unit: String;
}

export interface Order {
  _id: string;
  food: Food;
  sale: string;
  status: Status;
  desc: string;
}

export interface ActiveReservation {
  reservation: Reservation;
  sale: Sale;
  orders: Order[];
}

export interface Table{
  _id: string
  num: number
  size: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  active?: boolean;
  createdAt?: Date;
  lastName?: string;
  mail?: string;
  name?: string;
  password?: string;
  updatedAt?: Date;
  userType?: string;
  verified?: boolean;
  _id?: string;
}