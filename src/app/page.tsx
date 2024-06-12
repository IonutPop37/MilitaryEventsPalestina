import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Home Page</h1>
      <Link href="/vectorLayer" className="text-blue-500 underline">
        Go to Vector Layer Page
      </Link>
    </div>
  );
}
