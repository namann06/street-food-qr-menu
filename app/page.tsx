'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, QrCode, UtensilsCrossed, ClipboardList } from 'lucide-react';

import { Button, Card, CardContent } from '@/components/ui';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const steps = [
  {
    num: '01',
    icon: ClipboardList,
    title: 'Register',
    desc: 'Create an account for your food stall in under a minute.',
  },
  {
    num: '02',
    icon: UtensilsCrossed,
    title: 'Add Menu',
    desc: 'Upload your dishes, prices, and photos — all from your phone.',
  },
  {
    num: '03',
    icon: QrCode,
    title: 'Share QR',
    desc: 'Display your unique QR code and let customers order digitally.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-sand-50">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-sand-50/80 backdrop-blur-md border-b border-sand-200/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-charcoal-900 text-body-lg">
              Servio
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="gap-1.5">
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="inline-flex items-center gap-1.5 bg-sage-50 border border-sage-200 text-sage-700 text-body-xs font-medium rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
              Digital menus for street food vendors
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="text-display-lg md:text-display-xl font-bold font-display text-charcoal-900 leading-tight"
          >
            Your menu,{' '}
            <span className="text-sage-600">one scan</span>{' '}
            away
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="mt-5 text-body-lg text-charcoal-500 max-w-xl mx-auto leading-relaxed"
          >
            Create a beautiful digital menu, generate a QR code, and let customers browse &amp; order — all without paper or an expensive app.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Register Your Shop
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Vendor Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-center mb-12"
          >
            <h2 className="text-display-sm font-bold font-display text-charcoal-900">
              How it works
            </h2>
            <p className="mt-2 text-body-md text-charcoal-500">
              Three simple steps to go digital
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease }}
              >
                <Card variant="elevated" className="h-full group">
                  <CardContent className="p-7 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sage-50 text-sage-600 group-hover:bg-sage-100 transition-colors">
                      <step.icon className="w-5 h-5" />
                    </div>

                    <div>
                      <span className="text-body-xs font-semibold text-charcoal-300 uppercase tracking-wider">
                        Step {step.num}
                      </span>
                      <h3 className="text-body-lg font-semibold text-charcoal-900 mt-1">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-body-sm text-charcoal-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-sand-200 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-body-xs text-charcoal-400">
            &copy; {new Date().getFullYear()} Servio. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sage-100 flex items-center justify-center text-sage-600">
              <UtensilsCrossed className="w-3 h-3" />
            </div>
            <span className="text-body-xs font-medium text-charcoal-500">Servio</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
