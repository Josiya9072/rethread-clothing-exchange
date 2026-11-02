import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="font-inter" style={{ backgroundColor: '#f4f7f2', color: '#2d4526' }}>
      {/* Navbar */}
      <nav className="fixed top-0 w-full py-6 px-8 flex justify-between items-center z-50"
           style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sage-500 rounded-xl flex items-center justify-center text-white font-bold">S</div>
          <span className="text-2xl font-playfair font-bold">SwapStyle</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium">
          <Link to="/browse" className="hover:text-sage-500">Browse</Link>
          <a href="#how-it-works" className="hover:text-sage-500">How it Works</a>
          <a href="#about" className="hover:text-sage-500">About</a>
        </div>
        <Link to="/auth" className="bg-sage-500 text-white px-6 py-2 rounded-full font-bold hover:bg-sage-600 transition-all">
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-sage-500/10 text-sage-500 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-6 inline-block">
            Sustainable Fashion
          </span>
          <h1 className="text-6xl lg:text-7xl font-playfair font-bold leading-tight mb-6">
            Style has <span className="text-sage-500 italic">No Waste.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg">
            Join the world's most elegant community for clothing exchange. Refresh your wardrobe without the environmental cost.
          </p>
          <div className="flex gap-4">
            <Link to="/browse" className="bg-sage-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-sage-500/20 transition-all">
              Explore Swaps
            </Link>
            <a href="#how-it-works" className="border border-sage-500 text-sage-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-sage-50 transition-all">
              How it works
            </a>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200"
            className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
            alt="Fashion"
          />
          <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl shadow-xl max-w-[200px]"
               style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <p className="font-bold text-sage-500 mb-1">Eco Impact</p>
            <p className="text-xs text-gray-500">Swapping a jacket saves ~20,000 liters of water used in production.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-playfair font-bold text-center mb-16 underline decoration-sage-500/30 underline-offset-8">
            The Swapping Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-3xl bg-sage-50">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-sage-500 text-3xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-4">List Your Closet</h3>
              <p className="text-gray-500">Upload photos of items you no longer wear. It's free and takes seconds.</p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-sage-50">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-sage-500 text-3xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-4">Propose a Swap</h3>
              <p className="text-gray-500">Find items you love and offer something from your own collection.</p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-sage-50">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-sage-500 text-3xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-4">Meet & Exchange</h3>
              <p className="text-gray-500">Chat with users, verify conditions, and swap locally or via courier.</p>
            </div>
          </div>
        </div>
      </section>

      <footer id="about" className="bg-sage-500 text-white py-12 px-8 text-center">
        <p className="font-playfair font-bold text-xl mb-4">SwapStyle</p>
        <p className="text-white/70">Join the movement toward a circular fashion economy.</p>
        <div className="mt-8 border-t border-white/20 pt-8 text-sm text-white/50">
          &copy; 2026 SwapStyle Marketplace. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
