'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Store, 
  Package, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  X, 
  Users, 
  Truck, 
  Layers
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-orange-50 text-orange-500 selection:bg-orange-500 selection:text-white overflow-x-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 text-white p-2 rounded-xl">
              <Layers className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-orange-500">
              TiiB<span className="text-orange-600">n</span>Tick
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/relay-points" className="hover:text-orange-600 transition-colors">
              Trouver un Point Relais
            </Link>
            <Link href="/become-rp" className="hover:text-orange-600 transition-colors">
              Devenir Partenaire
            </Link>
            <Link href="#features" className="hover:text-orange-600 transition-colors">
              Fonctionnalités
            </Link>
          </nav>

          {/* Connection Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-semibold text-gray-700 hover:text-orange-600 px-3 py-2 transition-colors"
            >
              Connexion
            </Link>
            <Link 
              href="/inscription" 
              className="text-sm font-semibold bg-orange-500 text-white hover:bg-orange-800 px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              S&apos;inscrire
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-orange-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-orange-200 bg-white px-4 py-6 space-y-4 shadow-inner">
            <Link 
              href="/relay-points" 
              className="block text-base font-medium text-gray-700 hover:text-orange-600 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trouver un Point Relais
            </Link>
            <Link 
              href="/become-rp" 
              className="block text-base font-medium text-gray-700 hover:text-orange-600 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Devenir Partenaire
            </Link>
            <div className="border-t border-orange-100 pt-4 flex flex-col gap-2">
              <Link 
                href="/login" 
                className="w-full text-center py-2.5 rounded-xl border border-orange-200 text-gray-700 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link 
                href="/inscription" 
                className="w-full text-center py-2.5 rounded-xl bg-orange-500 text-white font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                S&apos;inscrire
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold tracking-wider uppercase">
                <Store className="h-4 w-4" /> Solution Logistique Point Relais
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-orange-500 tracking-tight leading-none">
                Simplifiez vos envois grâce à notre réseau de <span className="text-orange-600">Points Relais</span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
                TiiBnTick connecte les expéditeurs, les livreurs agiles, et les commerces locaux pour créer un écosystème de livraison ultra-rapide, sécurisé et proche de chez vous.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link 
                  href="/relay-points" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-orange-600/20 hover:shadow-xl transition-all hover:-tranorange-y-0.5 group"
                >
                  Trouver un Point Relais
                  <MapPin className="h-5 w-5 group-hover:tranorange-x-0.5 transition-transform" />
                </Link>
                <Link 
                  href="/become-rp" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-orange-500 border border-orange-200 font-bold px-8 py-4 rounded-2xl shadow-sm transition-all"
                >
                  Devenir Partenaire
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 border-t border-orange-200">
                <div>
                  <p className="text-2xl font-black text-orange-500">50+</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Points Relais</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-orange-500">10k+</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Colis Livrés</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-orange-500">99.8%</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Taux de Réussite</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-teal-500 rounded-3xl blur-3xl opacity-20 -rotate-6 scale-95"></div>
              <div className="relative bg-white border border-orange-200 rounded-3xl p-6 shadow-xl space-y-6">
                
                {/* Header of Mockup */}
                <div className="flex items-center justify-between border-b border-orange-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 rounded-full bg-red-400"></div>
                    <div className="h-3.5 w-3.5 rounded-full bg-yellow-400"></div>
                    <div className="h-3.5 w-3.5 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-xs font-mono text-gray-400">tii-b-n-tick_v2.0_running</span>
                </div>

                {/* Simulated Map Visualizer */}
                <div className="bg-orange-100 h-48 rounded-2xl flex items-center justify-center relative overflow-hidden border border-orange-200">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Pin Point A */}
                  <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                    <span className="bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">Hub Principal</span>
                    <div className="h-2 w-2 bg-orange-600 rounded-full animate-ping absolute -bottom-1"></div>
                  </div>

                  {/* Pin Point B */}
                  <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
                    <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">Point Relais</span>
                    <div className="h-2 w-2 bg-orange-500 rounded-full animate-ping absolute -bottom-1"></div>
                  </div>

                  {/* Route Vector Line */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M 120 60 Q 200 90 280 130" 
                      fill="none" 
                      stroke="#f97316" 
                      strokeWidth="3" 
                      strokeDasharray="6,4" 
                      className="animate-[dash_2s_linear_infinite]"
                    />
                  </svg>
                </div>

                {/* Simulated Delivery Status */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-gray-500">
                    <span>Statut de l&apos;expédition</span>
                    <span className="text-orange-600">EN ROUTE</span>
                  </div>
                  <div className="w-full bg-orange-100 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full w-2/3"></div>
                  </div>
                  <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Truck className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-orange-500 truncate">Livreur #4023 (Arnaud K.)</p>
                      <p className="text-[10px] text-gray-400">Arrivée estimée : 14 mins</p>
                    </div>
                    <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-md">OTP Actif</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="features" className="py-20 bg-orange-100 border-y border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-orange-500 tracking-tight">
              Comment fonctionne notre écosystème ?
            </h2>
            <p className="text-lg text-gray-600">
              Une chaîne logistique simplifiée au maximum pour garantir la tranquillité d&apos;esprit de l&apos;expéditeur et du destinataire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-sm hover:shadow-md transition-all space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-orange-500">Préparation & Dépôt</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Configurez votre expédition en ligne, payez via Mobile Money, puis déposez votre colis dans le Point Relais le plus proche.
              </p>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> Calcul automatique du volume</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> Étiquette PDF générée</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-sm hover:shadow-md transition-all space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-orange-500">Acheminement Sécurisé</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nos coursiers partenaires récupèrent le paquet. Vous suivez sa position GPS en temps réel grâce à notre lien de tracking dynamique.
              </p>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> Signature numérique de prise en charge</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> Lien de partage en un clic</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-sm hover:shadow-md transition-all space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-orange-500">Retrait par OTP unique</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Le colis arrive au Point Relais de destination. Le destinataire reçoit un code de sécurité temporaire pour valider le retrait.
              </p>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> Zéro fraude ou usurpation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> Notifications SMS instantanées</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Become Partner CTA Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-500 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
            
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-orange-400 font-bold uppercase tracking-wider text-sm">Gagnez des revenus complémentaires</span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                  Faites grandir votre commerce en devenant Point Relais
                </h2>
                <p className="text-gray-300 text-base leading-relaxed">
                  Attirez un flux constant de nouveaux clients locaux dans votre magasin et percevez une commission sur chaque colis réceptionné et distribué.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 bg-orange-800 px-4 py-2 rounded-xl text-xs font-semibold">
                    <Users className="h-4 w-4 text-orange-400" /> Trafic client accru
                  </div>
                  <div className="flex items-center gap-2 bg-orange-800 px-4 py-2 rounded-xl text-xs font-semibold">
                    <ShieldCheck className="h-4 w-4 text-orange-400" /> Gestion simplifiée
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Link 
                  href="/become-rp" 
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-center px-8 py-4 rounded-2xl transition-all shadow-lg shadow-orange-600/10"
                >
                  Postuler maintenant
                </Link>
                <Link 
                  href="/relay-points" 
                  className="bg-orange-800 hover:bg-orange-700 text-gray-100 font-bold text-center px-8 py-4 rounded-2xl transition-all border border-orange-700"
                >
                  Voir la carte des hubs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-500 text-gray-400 pt-16 pb-12 border-t border-orange-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-orange-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Layers className="h-6 w-6 text-orange-500" />
              <span className="text-xl font-black">TiiBnTick</span>
            </div>
            <p className="text-xs leading-relaxed">
              La passerelle logistique moderne connectant commerçants, clients et transporteurs de confiance pour la gestion de colis du dernier kilomètre.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Pour les expéditeurs</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/relay-points" className="hover:text-orange-400 transition-colors">Trouver un Point Relais</Link></li>
              <li><Link href="/inscription" className="hover:text-orange-400 transition-colors">Créer un compte</Link></li>
              <li><Link href="/login" className="hover:text-orange-400 transition-colors">Suivi d&apos;expédition</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Pour les commerçants</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/become-rp" className="hover:text-orange-400 transition-colors">Devenir Point Relais</Link></li>
              <li><Link href="/login" className="hover:text-orange-400 transition-colors">Espace Propriétaire</Link></li>
              <li><Link href="/relay-points" className="hover:text-orange-400 transition-colors">Critères de sélection</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Sécurité & Support</h4>
            <p className="text-xs leading-relaxed mb-4">
              Tous nos colis sont couverts contre les dommages physiques durant la phase d&apos;attribution et de stockage intermédiaire.
            </p>
            <span className="inline-flex items-center gap-1.5 bg-orange-950 text-orange-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-orange-500">
              <ShieldCheck className="h-3 w-3" /> Protection Intégrale 100%
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs">
          <p>© {new Date().getFullYear()} TiiBnTick. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-orange-400">Mentions légales</a>
            <a href="#" className="hover:text-orange-400">Confidentialité</a>
            <a href="#" className="hover:text-orange-400">Conditions d&apos;utilisation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}