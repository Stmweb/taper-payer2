import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CreditCard, Send, CheckCircle, Shield, Clock, DollarSign, Globe, ArrowRight, Smartphone, Laptop, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';

export default function TaperPayerHowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up in minutes with just your email. No paperwork, no hassle.',
      details: [
        'Quick 2-minute signup process',
        'Verify your identity securely',
        'No hidden fees or commitments',
        'Available on web and mobile'
      ],
      color: 'from-blue-600 to-blue-500'
    },
    {
      icon: CreditCard,
      title: 'Add Payment Method',
      description: 'Link your bank account, debit card, or credit card safely and securely.',
      details: [
        'Multiple payment options supported',
        'Bank-level encryption',
        'Instant payment verification',
        'Save multiple payment methods'
      ],
      color: 'from-green-600 to-green-500'
    },
    {
      icon: Send,
      title: 'Enter Transfer Details',
      description: 'Choose your recipient, enter the amount, and review the exchange rate.',
      details: [
        'Real-time exchange rates',
        'No hidden fees',
        'Save frequent recipients',
        'Send to 180+ countries'
      ],
      color: 'from-orange-600 to-orange-500'
    },
    {
      icon: CheckCircle,
      title: 'Money Delivered',
      description: 'Your money is on its way! Track your transfer in real-time.',
      details: [
        'Instant to minutes delivery',
        'Real-time tracking',
        'Email & SMS notifications',
        'Money-back guarantee'
      ],
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Lightning Fast',
      description: 'Most transfers complete within minutes',
      stat: '< 5 min',
      color: 'text-yellow-500',
      bg: 'bg-yellow-50'
    },
    {
      icon: DollarSign,
      title: 'Low Fees',
      description: 'Save up to 90% vs traditional banks',
      stat: 'From $0',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your money is always protected',
      stat: '256-bit',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Send money to anywhere in the world',
      stat: '180+',
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    }
  ];

  const deliveryMethods = [
    {
      icon: Smartphone,
      title: 'Mobile Wallet',
      description: 'Instant delivery to mobile money accounts',
      countries: '50+ countries'
    },
    {
      icon: Building2,
      title: 'Bank Transfer',
      description: 'Direct deposit to bank accounts',
      countries: '180+ countries'
    },
    {
      icon: Laptop,
      title: 'Cash Pickup',
      description: 'Pick up cash at thousands of locations',
      countries: '100+ countries'
    }
  ];

  const faqs = [
    {
      question: 'How long does a transfer take?',
      answer: 'Most transfers are completed within minutes. Bank transfers may take 1-3 business days depending on the destination country.'
    },
    {
      question: 'What are your fees?',
      answer: 'Our fees start from $0 and vary based on the amount, destination, and payment method. You\'ll always see the exact fee before confirming your transfer.'
    },
    {
      question: 'Is my money safe?',
      answer: 'Absolutely. We use bank-level 256-bit encryption, are fully licensed and regulated, and your money is protected by our guarantee.'
    },
    {
      question: 'What documents do I need?',
      answer: 'You\'ll need a valid government-issued ID and proof of address. The verification process is quick and done entirely online.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl('TaperPayerHome')}>
              <TaperPayerLogo height="h-28" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
                How It Works
              </Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                About
              </Link>
              <Link to={createPageUrl('TaperPayerContact')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('TaperPayerLogin')}>
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                  Login
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                Sign up
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
              <CheckCircle className="w-4 h-4" />
              Simple & Fast
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Send Money in
              <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                4 Simple Steps
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Sending money internationally has never been easier. Get started in minutes 
              and experience the future of money transfers.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-10 h-14 text-lg rounded-xl">
              Start Your First Transfer
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Timeline */}
          <div className="relative mb-20">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 hidden lg:block" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-600 to-green-600 -translate-y-1/2 transition-all duration-500 hidden lg:block"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
            
            <div className="grid lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveStep(index)}
                  className="relative cursor-pointer"
                >
                  <div className={`text-center ${activeStep === index ? 'scale-105' : 'scale-100'} transition-transform`}>
                    <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg ${
                      activeStep === index ? 'ring-4 ring-blue-100' : ''
                    }`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-600 text-sm font-medium mb-2">
                      Step {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Step Details */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-8 lg:p-12"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${steps[activeStep].color} text-white rounded-full text-sm font-medium mb-4`}>
                  Step {activeStep + 1} of {steps.length}
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {steps[activeStep].title}
                </h2>
                <p className="text-lg text-gray-600 mb-8">{steps[activeStep].description}</p>
                <ul className="space-y-4">
                  {steps[activeStep].details.map((detail, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl blur-3xl opacity-20" />
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className={`w-full h-64 bg-gradient-to-br ${steps[activeStep].color} rounded-2xl flex items-center justify-center mb-6`}>
                    {React.createElement(steps[activeStep].icon, { className: "w-32 h-32 text-white opacity-50" })}
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2">Current Step</p>
                    <p className="text-2xl font-bold text-gray-900">{steps[activeStep].title}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Taper Payer?</h2>
            <p className="text-xl text-gray-600">Experience the benefits of modern money transfers</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{feature.stat}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Multiple Delivery Options</h2>
            <p className="text-xl text-gray-600">Choose how your recipient receives their money</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {deliveryMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {method.countries}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know</p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join millions who trust Taper Payer for fast, secure transfers
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
              <TaperPayerLogo className="mb-4" height="h-20" />
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