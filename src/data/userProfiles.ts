import type { UserProfile } from '@/types/auth';
import { images } from '@/data/mockData';

export const CUSTOMER_1: UserProfile = {
  id: 'customer_1',
  email: 'aishwarya@wedding.com',
  brideName: 'Aishwarya',
  groomName: 'Rohan',
  coupleInitials: 'A&R',
  weddingDate: 'December 18, 2026',
  location: 'The Leela Palace, Udaipur, Rajasthan',
  hasBooking: true,
  userBookings: [
    {
      id: 'b1',
      serviceName: 'Photography',
      vendorName: 'Candid Canvas Studio',
      category: 'Photography',
      status: 'Confirmed',
      price: '₹1,20,000',
      image: images.photography,
    },
    {
      id: 'b2',
      serviceName: 'Makeup',
      vendorName: 'Glow Bridal Studio',
      category: 'Makeup Artists',
      status: 'Confirmed',
      price: '₹35,000',
      image: images.makeup,
    },
    {
      id: 'b3',
      serviceName: 'DJ & Sound',
      vendorName: 'DJ Aakash Beats',
      category: 'DJ / Music',
      status: 'Confirmed',
      price: '₹60,000',
      image: images.dj,
    },
    {
      id: 'b4',
      serviceName: 'Decoration',
      vendorName: 'Blossom Decor Studio',
      category: 'Decoration',
      status: 'Confirmed',
      price: '₹2,00,000',
      image: images.mandap,
    },
    {
      id: 'b5',
      serviceName: 'Catering',
      vendorName: 'Maharaja Feast Caterers',
      category: 'Catering',
      status: 'Confirmed',
      price: '₹1,500 / plate',
      image: images.food,
    },
  ],
};

export const CUSTOMER_2: UserProfile = {
  id: 'customer_2',
  email: 'newuser@wedding.com',
  brideName: 'Priya',
  groomName: 'Vikram',
  coupleInitials: 'P&V',
  weddingDate: 'To Be Decided',
  location: 'Not Specified Yet',
  hasBooking: false,
  userBookings: [],
};
