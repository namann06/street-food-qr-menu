import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Street Food QR Menu
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Digital menus for street food vendors
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Vendor Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Register Your Shop
            </Link>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-4">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">1. Register</h3>
                <p className="text-gray-300">Create an account for your food stall</p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">2. Add Menu</h3>
                <p className="text-gray-300">Upload your menu items and prices</p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">3. Share QR</h3>
                <p className="text-gray-300">Display your unique QR code for customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
