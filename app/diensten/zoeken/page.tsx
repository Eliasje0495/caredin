import { redirect } from "next/navigation";

export default function ZoekenPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const params = new URLSearchParams(searchParams as any).toString();
  redirect(`/diensten${params ? `?${params}` : ""}`);
}
