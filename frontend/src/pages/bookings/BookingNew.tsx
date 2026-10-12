import AutocompleteInput from "../../components/AutocompleteInput";
import Input from "../../components/Input";
import useLookupArrays from "../../hooks/useLookupArrays";
import { type MovieCreate } from "../../models/Movie";
import { type LocationCreate } from "../../models/Location";
import "./BookingNew.css";
import Select from "../../components/Select";
import { useRef, useState } from "react";
import { getMovieMatches, postMovie } from "../../api/movies";
import { getLocationMatches, postLocation } from "../../api/locations";
import Seats from "../../components/Seats";
import { postBooking } from "../../api/bookings";

export default function BookingNew() {
  const [dbMovies, dbLocations, dbFormats] = useLookupArrays(true);
  const [extMovies, setExtMovies] = useState<MovieCreate[] | null>(null);
  const [extLocations, setExtLocations] = useState<LocationCreate[] | null>(
    null,
  );
  const [selectedMovieId, setSelectedMovieId] = useState<
    string | number | null
  >(null);
  const [selectedLocationId, setSelectedLocationId] = useState<
    string | number | null
  >(null);
  const movieController = useRef<AbortController | null>(null);
  const locationController = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formValid, setFormValid] = useState(false);
  const [seats, setSeats] = useState<Set<string>>(new Set());

  const rawFormats: [number, string][] = dbFormats.map((format) => [
    format.id,
    format.name,
  ]);

  async function fetchExtMovies(searchTerm: string) {
    movieController.current?.abort();
    const controller = new AbortController();
    movieController.current = controller;
    setExtMovies(null);

    try {
      const records = await getMovieMatches(searchTerm, controller.signal);
      if (!controller.signal.aborted) setExtMovies(records);
    } catch {
      if (!controller.signal.aborted) setExtMovies([]);
      // else aborted and no real error
    }
  }

  async function fetchExtLocations(searchTerm: string) {
    locationController.current?.abort();
    const controller = new AbortController();
    locationController.current = controller;
    setExtLocations(null);

    try {
      const records = await getLocationMatches(searchTerm, controller.signal);
      if (!controller.signal.aborted) setExtLocations(records);
    } catch {
      if (!controller.signal.aborted) setExtLocations([]);
      // else aborted and no real error
    }
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent browser from reloading

    const data = new FormData(e.currentTarget);

    const movie =
      dbMovies.find((m) => m.name === data.get("movie")) ||
      extMovies?.find((m) => m.name === data.get("movie"));
    const location =
      dbLocations.find((l) => l.name === data.get("location")) ||
      extLocations?.find((l) => l.name === data.get("location"));

    const date = data.get("date") as string;
    const time = data.get("time");
    const dateTime = new Date(time != null ? `${date}T${time}` : date);

    const rawPrice = data.get("price");
    const price = rawPrice === null ? null : Number(rawPrice);
    const rawId = data.get("id");
    const bookingId = rawId === null ? null : String(rawId);
    const rawFormatId = data.get("format_id");
    const formatId = rawFormatId === null ? null : Number(rawFormatId);

    if (!movie || !location || !formatId)
      throw new Response("failed to parse movie or location or formatId");

    try {
      const movieId = (await postMovie(movie)).id;
      const locationId = (await postLocation(location)).id;

      const booking = await postBooking({
        external_id: bookingId,
        date_time: dateTime,
        seats: Array.from(seats),
        price: price,
        movie_id: movieId,
        location_id: locationId,
        format_id: formatId,
        source: "manual",
      });

      console.log(booking);
    } catch (e) {
      console.error(e);
    }
  }

  const canSubmit =
    selectedMovieId != null && selectedLocationId != null && formValid;

  return (
    <div className="booking-new">
      <div className="title">Create new booking</div>

      <form
        onSubmit={handleSubmit}
        className="booking-form"
        ref={formRef}
        onChange={() =>
          setFormValid(
            formRef.current ? formRef.current.checkValidity() : false,
          )
        }
      >
        <AutocompleteInput<MovieCreate>
          name="Movie"
          databaseRecords={dbMovies}
          externalRecords={extMovies}
          externalService="TMDB"
          fetchExternal={fetchExtMovies}
          updateSelected={setSelectedMovieId}
        />
        <AutocompleteInput<LocationCreate>
          name="Location"
          databaseRecords={dbLocations}
          externalRecords={extLocations}
          externalService="Google Maps"
          fetchExternal={fetchExtLocations}
          updateSelected={setSelectedLocationId}
        />
        <Select placeholder="Format" name="format_id" options={rawFormats} />
        <Input placeholder="Date" name="date" type="date" required />
        <Input placeholder="Time" name="time" type="time" />
        <Input placeholder="Price" name="price" type="number" step="0.01" />
        <Input placeholder="Booking ID" name="id" type="text" />
        <Seats sendSeats={setSeats} />

        <button className="submit" type="submit" disabled={!canSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
