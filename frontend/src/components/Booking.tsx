import './Booking.css';

export default function Booking({ id, datetime, seats, price, movie, location, format }) {
  const parsed = new Date(datetime);

  return (
    <div>
      <h2>ID:</h2> {id}
      <h2>Date:</h2> {parsed.toDateString()}
      <h2>Time:</h2> {parsed.toLocaleTimeString()}
      <h2>Seats:</h2> {seats}
      <h2>Price:</h2> {price}
      <h2>Movie:</h2> {movie}
      <h2>Location:</h2> {location}
      <h2>Format:</h2> {format}
    </div>
  );
}
