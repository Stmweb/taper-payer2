import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Award, Globe, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';

export default function TaperPayerAbout() {
  const values = [
    {
      icon: Users,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do, ensuring their needs drive our innovation.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your money and data are protected with the highest security standards in the industry.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We constantly innovate to make money transfers faster, easier, and more accessible.',
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    {
      icon: Heart,
      title: 'Transparency',
      description: 'No hidden fees, no surprises. What you see is what you pay, always.',
      color: 'text-rose-500',
      bg: 'bg-rose-50'
    }
  ];

  const milestones = [
    { year: '2018', title: 'Founded', description: 'Taper Payer was born with a mission to revolutionize money transfers' },
    { year: '2019', title: '1M Users', description: 'Reached our first million happy customers worldwide' },
    { year: '2021', title: 'Global Expansion', description: 'Expanded to 180+ countries across 6 continents' },
    { year: '2023', title: '10M Users', description: 'Celebrating 10 million users and $50B+ transferred' },
    { year: '2025', title: 'Industry Leader', description: 'Recognized as the fastest-growing fintech company' }
  ];

  const team = [
    { name: 'Sarah Martinez', role: 'CEO & Founder', initial: 'S', color: 'bg-blue-600' },
    { name: 'David Chen', role: 'CTO', initial: 'D', color: 'bg-green-600' },
    { name: 'Emma Johnson', role: 'CFO', initial: 'E', color: 'bg-emerald-500' },
    { name: 'Michael Brown', role: 'Head of Product', initial: 'M', color: 'bg-rose-500' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl('TaperPayerHome')}>
              <TaperPayerLogo height="h-12" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                How It Works
              </Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
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
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Our Story
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Making Money Transfers
              <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Simple for Everyone
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We believe everyone deserves access to fast, affordable, and secure money transfers. 
              That's why we're on a mission to break down barriers and connect the world financially.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To empower individuals and businesses worldwide with seamless, instant, and affordable 
                money transfer solutions that transcend borders and break down financial barriers.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're building a world where sending money is as easy as sending a message, where 
                families stay connected, businesses thrive globally, and financial inclusion is a reality for all.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: Globe, label: '180+ Countries', color: 'from-blue-600 to-blue-500' },
                { icon: Users, label: '10M+ Users', color: 'from-green-600 to-green-500' },
                { icon: TrendingUp, label: '$50B+ Sent', color: 'from-orange-500 to-orange-600' },
                { icon: Award, label: '4.9★ Rating', color: 'from-yellow-500 to-orange-500' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-xl transition-shadow"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.label.split(' ')[0]}</p>
                  <p className="text-gray-600 text-sm">{stat.label.split(' ').slice(1).join(' ')}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${value.bg} rounded-xl flex items-center justify-center mb-5`}>
                  <value.icon className={`w-7 h-7 ${value.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones in our growth story</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-200 to-green-200 hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-bold rounded-full mb-3">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0 w-4 h-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-full hidden md:block">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 rounded-full animate-ping opacity-75" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
            <p className="text-xl text-gray-600">The team driving innovation at Taper Payer</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className={`w-24 h-24 ${member.color} rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4`}>
                  {member.initial}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
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
              Join Our Journey
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Be part of the revolution in global money transfers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-10 h-14 text-lg rounded-xl font-semibold">
                Get Started Today
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 h-14 px-10 text-lg rounded-xl font-semibold">
                View Careers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <TaperPayerLogo className="mb-4" height="h-10" />
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