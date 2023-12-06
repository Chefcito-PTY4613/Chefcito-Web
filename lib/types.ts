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
export interface Process {
  _id: string
  name: string
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
export interface Recipe {
  _id: string
  food: string
  ingredient: Ingredient
  process: Process
  amount: number
}

export interface Ingredient {
  _id: string;
  name: string;
  desc: string;
  stock: number;
  stockFlag: number;
  unit: string;
}

export interface Order {
  _id: string;
  food: Food;
  sale: string;
  status: Status;
  desc: string;
}

export interface ActiveReservation {
  msg?:string;
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
export interface Process{
  _id: string,
  name:string,
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


export interface MyRoutes {
  icon: string;
  name: string;
  path: string;
}
export interface IRoutesOps {
  admin: Array<number>;
  waiter: Array<number>;
  finance: Array<number>;
  chef: Array<number>;
  store: Array<number>;
}

export interface ChefOrder {
  _id: string;
  food: {
    _id: string;
    name: string;
    img: string;
  };
  sale: {
    _id: string;
    reservation: {
      _id: string;
      table: {
        _id: string;
        num: number;
      };
      user: string;
      active: boolean;
      createdAt: string;
      updatedAt: string;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  status: string;
  desc: string;
}
export interface ChefOrderFetching {
  order: ChefOrder;
  repit?: number;
  tableId: string;
  processResume: string[];
  recipes: {
      _id: string;
      ingredient: string
      process: string;
      unit: string;
      amount: number;
  }[];
}