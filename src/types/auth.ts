export interface UserBooking {
  id: string;
  vendorName?: string;
  serviceName?: string;
  category?: string;
  date?: string;
  status: 'Pending' | 'Confirmed';
  price?: number | string;
  image?: string;
  details?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  brideName: string;
  groomName: string;
  coupleInitials: string;
  weddingDate?: string;
  weddingDateISO?: string;
  location?: string;
  hasBooking: boolean;
  userBookings: UserBooking[];
}
