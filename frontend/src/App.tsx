import './App.css';
import Booking from './Booking';
import bookings from '../demo.json';

export default function App() {
  fetch("http://127.0.0.1:8000/bookings").then(res => {
    res.json().then(json => console.log(json))
  });

  return (
    <>
      <Booking {...bookings[0]} />
      <Booking {...bookings[1]} />
      <Booking {...bookings[2]} />
    </>
  );
}
