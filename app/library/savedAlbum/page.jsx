import Link from "next/link";

export default function SavedAlbum() {
  return (
    <main>
      <h1>SavedAlbum</h1>
      <Link href="/api/getSavedAlbum">Get Data</Link>
    </main>
  );
}
