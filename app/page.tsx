export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-stone-900">poristiwa.my.id</h1>
        <p className="text-stone-600">The ultimate news aggregator.</p>
      </header>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* News articles will be fetched and rendered here */}
        <p>News articles will appear here after scraping and enrichment.</p>
      </section>
    </main>
  );
}
