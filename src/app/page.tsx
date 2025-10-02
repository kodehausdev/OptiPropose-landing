"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, Lightbulb, LayoutTemplate, ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { addToWaitlist, trackEngagement } from '@/lib/firestore';

const EarlyAccessForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error" | "exists">(null); // null, 'success', 'error', 'exists'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!email.includes('@') || !email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setStatus(null);
    setErrorMessage('');
  console.log('Adding to waitlist...');
    try {
      await addToWaitlist(email, 'landing-page');
        console.log('Waitlist success');

        console.log('Tracking engagement...');
      // Track successful signup
await trackEngagement(email, 'waitlist_signup', {
  source: 'landing-page'
});
  console.log('Engagement success');



      setStatus('success');
      setEmail(''); // Clear the form
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus(null), 5000);
      
     } catch (error) {
       console.error('Signup error:', error);
       if (error instanceof Error && error.message === 'Email already registered') {
         setStatus('exists');
         setErrorMessage('You\'re already on our waitlist! 🎉');
       } else {
         setStatus('error');
         setErrorMessage('Something went wrong. Please try again.');
       }
       // Reset error message after 5 seconds
       setTimeout(() => {
         setStatus(null);
         setErrorMessage('');
       }, 5000);
     } finally {
       setIsLoading(false);
     }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (status === 'success') {
      return <CheckCircle className="h-4 w-4" />;
    }
    return (
      <>
        Join
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
      </>
    );
  };

  const getStatusMessage = () => {
    if (status === 'success') {
      return (
        <p className="text-center text-green-400 text-sm mt-2 animate-fade-in">
          🎉 You're in! We'll be in touch soon.
        </p>
      );
    }
    if (status === 'exists') {
      return (
        <p className="text-center text-yellow-400 text-sm mt-2 animate-fade-in">
          {errorMessage}
        </p>
      );
    }
    if (status === 'error') {
      return (
        <p className="text-center text-red-400 text-sm mt-2 animate-fade-in flex items-center justify-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {errorMessage}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50"
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !email.trim()}
          className="px-6 py-3 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white font-medium hover:bg-white/30 transition-all duration-300 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getButtonContent()}
        </button>
      </div>
      {getStatusMessage()}
    </div>
  );
};

const features = [
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: 'Strategic Analysis',
    description: 'Analyzes project requirements and client context to understand what truly matters, removing the guesswork from proposal strategy.',
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: 'Persuasive Content',
    description: 'Generates data-backed, compelling content that addresses client pain points and positions your solution as the clear winner.',
    gradient: 'from-blue-400 to-cyan-400',
  },
  {
    icon: <LayoutTemplate className="h-8 w-8" />,
    title: 'Win Rate Optimization',
    description: 'Continuously learns from successful proposals to improve recommendations and increase your chances of winning deals.',
    gradient: 'from-green-400 to-emerald-400',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              OptiPropose
            </span>
          </div>
          <button className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium hover:bg-white/20 transition-all duration-300">
            Get Early Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              💥 Win More Proposals with AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            OptiPropose is your AI co-pilot that analyzes client needs and crafts persuasive, 
            data-backed proposals - so you close more deals in less time.
          </p>
          
          <div className="mb-3">
            <EarlyAccessForm />
          </div>
          
          <p className="text-white/50 text-sm">
            Join 500+ professionals increasing their proposal win rates
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Why OptiPropose Works
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Beyond time-saving: the strategic advantage that increases your win rate
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <CardContent className="p-0 text-center">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-purple-200 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Ready to Boost Your Win Rate?
              </span>
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Stop competing on price alone. Let OptiPropose help you win on value, 
              strategy, and compelling storytelling.
            </p>
            <EarlyAccessForm />
            <div className="flex items-center justify-center gap-8 mt-8 text-white/50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Proven ROI increase</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BrainCircuit className="h-5 w-5 text-purple-400" />
            <span className="text-lg font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              OptiPropose
            </span>
          </div>
          <p className="text-white/50 text-sm">
            © 2025 OptiPropose. Your strategic proposal advantage.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}