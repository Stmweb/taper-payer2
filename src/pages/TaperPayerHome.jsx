import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Shield, Zap, Clock, DollarSign, Users, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';

export default function TaperPayerHome() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Transfer money in minutes, not days. Real-time processing for instant transfers.',
      color: 'text-yellow-500',
      bg: 'bg-yellow-50'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your money is protected with military-grade encryption and fraud detection.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      icon: DollarSign,
      title: 'Low Fees',
      description: 'Save up to 90% on transfer fees compared to traditional banks.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Send money to over 180 countries with competitive exchange rates.',
      color: 'text-green-600',
      bg: 'bg-green-50'
    }
  ];

  const stats = [
    { value: '$50B+', label: 'Transferred' },
    { value: '10M+', label: 'Happy Users' },
    { value: '180+', label: 'Countries' },
    { value: '4.9/5', label: 'User Rating' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Freelancer',
      content: 'Best money transfer service I\'ve used. Fast, reliable, and the fees are incredibly low!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Small Business Owner',
      content: 'We send international payments weekly. Taper Payer saves us thousands in fees every year.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'Remote Worker',
      content: 'The app is so easy to use. I can send money home to my family in seconds.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <TaperPayerLogo iconSize="w-7 h-7" textSize="text-xl" />
            <div className="hidden md:flex items-center gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                How It Works
              </Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                About
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Trusted by 10M+ users worldwide
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Send Money
                <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Anywhere, Instantly
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The fastest, safest, and most affordable way to send money globally. 
                Join millions who trust Taper Payer for their international transfers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 h-14 text-lg rounded-xl">
                  Start Sending Money
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Link to={createPageUrl('TaperPayerHowItWorks')}>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-2">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-green-400 border-2 border-white" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">4.9/5 from 50K+ reviews</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl p-6 text-white mb-4">
                  <p className="text-sm opacity-80 mb-1">Available Balance</p>
                  <p className="text-4xl font-bold">$24,850.00</p>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Maria Garcia', amount: '$500', flag: '🇲🇽' },
                    { name: 'John Smith', amount: '$1,200', flag: '🇬🇧' },
                    { name: 'Yuki Tanaka', amount: '$850', flag: '🇯🇵' }
                  ].map((transfer, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{transfer.flag}</div>
                        <div>
                          <p className="font-medium text-gray-900">{transfer.name}</p>
                          <p className="text-sm text-gray-500">Just now</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{transfer.amount}</p>
                        <p className="text-xs text-emerald-600">Completed</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Taper Payer?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of money transfers with features designed for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Millions Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Sending?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join millions of users who trust Taper Payer for fast, secure money transfers
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-10 h-14 text-lg rounded-xl font-semibold">
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <TaperPayerLogo className="mb-4" iconSize="w-6 h-6" textSize="text-lg" />
              <p className="text-sm">Fast, secure, and affordable global money transfers.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl('TaperPayerHowItWorks')} className="hover:text-white transition-colors">How It Works</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Countries</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl('TaperPayerAbout')} className="hover:text-white transition-colors">About Us</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2025 Taper Payer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}