import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Researchatron Logo" width={40} height={40} className="rounded-lg" />
          <span className="text-xl font-bold tracking-tight">Researchatron</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition">Log in</Link>
          <Link href="/register" className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-zinc-200 transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 mb-8 shadow-lg">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Now available in early access
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          AI-Powered Intelligence <br className="hidden md:block" /> for Advanced Research.
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
          Interact seamlessly with custom transformer models. Maintain deep context, analyze complex data, and accelerate your ML workflows in a beautifully dark, distraction-free environment.
        </p>

        <div className="flex items-center gap-4">
          <Link href="/register" className="bg-white text-black font-semibold px-8 py-4 rounded-full text-lg hover:bg-zinc-200 transition shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]">
            Start Researching
          </Link>
          <a href="#features" className="bg-zinc-900 border border-zinc-800 text-white font-medium px-8 py-4 rounded-full text-lg hover:bg-zinc-800 transition">
            Learn More
          </a>
        </div>
      </main>

      {/* Features Showcase */}
      <section id="features" className="py-24 border-t border-zinc-900 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16 text-zinc-100">Designed for Researchers</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Custom Transformers", desc: "Easily integrate your own locally hosted or cloud-based proprietary models." },
              { title: "Deep Context History", desc: "Your sessions are securely saved, allowing you to pick up complex thoughts right where you left off." },
              { title: "Distraction-Free UI", desc: "A sleek, zinc-based dark mode palette designed to reduce eye strain during long sessions." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800/80 p-8 rounded-2xl hover:bg-zinc-900 transition-colors cursor-default shadow-sm hover:shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-zinc-100">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 text-center text-zinc-500 text-sm bg-zinc-950">
        <p>© 2026 Researchatron. All rights reserved.</p>
      </footer>
    </div>
  );
}
