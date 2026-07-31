import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface Section {
  title: string;
  items: string[];
}

interface PolicyPageProps {
  title: string;
  badge: string;
  intro: string;
  lastUpdated: string;
  sections: Section[];
  icon: LucideIcon;
}

export function PolicyPage({
  title,
  badge,
  intro,
  lastUpdated,
  sections,
  icon: Icon,
}: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#fff8f2_0%,#fffdfb_100%)] text-slate-800">
      <main className="mx-auto flex max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au site
        </Link>

        <section className="rounded-[2rem] border border-orange-200 bg-white p-8 shadow-[0_25px_70px_-30px_rgba(249,115,22,0.45)] sm:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                {badge}
              </p>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{intro}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-slate-600">
            <ShieldCheck className="h-4 w-4 text-orange-500" />
            <span>Dernière mise à jour : {lastUpdated}</span>
          </div>

          <div className="mt-10 space-y-8">
            {sections.map((section, index) => (
              <section key={section.title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {index + 1}. {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                  {section.items.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
