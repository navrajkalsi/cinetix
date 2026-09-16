import './App.css';
import Booking from './components/Booking';
import bookings from '../demo.json';
import { useEffect } from 'react';

export default function App() {

  useEffect(
    () => {
      fetch("/api/bookings").then(res => {
        res.json().then(json => console.log(json))
      })
    }
  );

  return (
    <>
      <Booking {...bookings[0]} />
      <Booking {...bookings[1]} />
      <Booking {...bookings[2]} />
    </>
  );
}
