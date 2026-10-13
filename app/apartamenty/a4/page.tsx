import type { Metadata } from "next";
import { ApartmentPage } from "@/components/object/ApartmentPage";
import { apartments } from "@/content/apartments";

const apartment = apartments.a4;

export const metadata: Metadata = apartment.meta;

/* «Апартамент A4» */
export default function ApartmentA4Page() {
  return <ApartmentPage apartment={apartment} />;
}
