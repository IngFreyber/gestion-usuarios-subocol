export interface User {
  id: number;
  name: string;
  email: string;
  city: string;
  address?: Address;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  }

}
export interface ApiUser {
  id: number;
  name: string;
  email: string;
  address?: { city: string };
}
