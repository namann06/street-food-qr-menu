import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-orange-500">
            Street Food QR Menu
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300">
            Digital menus for street food vendors
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link
              href="/auth/signin"
              className="group bg-stone-800 hover:bg-stone-700 text-white font-medium py-4 px-8 rounded-full border border-stone-700 hover:border-orange-500 shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Vendor Login
              </span>
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-orange-500/10 to-orange-500/0 group-hover:w-full transition-all duration-500"></div>
            </Link>
            <Link
              href="/auth/signup"
              className="group bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-8 rounded-full shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register Your Shop
              </span>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-white/20 group-hover:w-full transition-all duration-500"></div>
            </Link>
          </div>

          <div className="mt-24">
            <h2 className="text-3xl font-bold mb-10 text-orange-500">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-stone-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-700 hover:border-orange-500/30 group">
                <div className="mb-4 text-orange-500 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Register</h3>
                <p className="text-gray-400">Create an account for your food stall</p>
              </div>
              <div className="p-8 bg-stone-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-700 hover:border-orange-500/30 group">
                <div className="mb-4 text-orange-500 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Add Menu</h3>
                <p className="text-gray-400">Upload your menu items and prices</p>
              </div>
              <div className="p-8 bg-stone-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-700 hover:border-orange-500/30 group">
                <div className="mb-4 text-orange-500 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Share QR</h3>
                <p className="text-gray-400">Display your unique QR code for customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
