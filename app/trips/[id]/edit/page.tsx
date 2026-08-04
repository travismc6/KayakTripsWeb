import { notFound } from "next/navigation";
import { TripEditForm } from "@/components/trip-edit-form";
import { getTrip } from "@/lib/api";

export default async function EditTripPage({ params }: { params: { id: string } }) {
  const trip = await getTrip(params.id);
  if (!trip) notFound();
  return <TripEditForm trip={trip} />;
}
