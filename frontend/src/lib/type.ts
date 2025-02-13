export type Office = {
  id: number;
  price: number;
  duration: number;
  name: string;
  slug: string;
  city: City;
  thumbnail: string;
  photos: Photo[];
  benefits: Benefit[];
  about: string;
  address: string;
};

export type Photo = {
  id: number;
  photo: string;
};

export type Benefit = {
  id: number;
  name: string;
};

export type City = {
  id: number;
  name: string;
  slug: string;
  photo: string;
  officeSpaces_count: number;
  officeSpaces: Office[];
};

export type BookingDetails = {
  id: number;
  name: string;
  phone_number: string;
  booking_trx_id: string;
  is_paid: boolean;
  duration: number;
  total_amount: number;
  started_at: string;
  ended_at: string;
  office: Office;
};
