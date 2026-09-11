import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { BrandMark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import {
  ADDRESS_LINE,
  CITY_LINE,
  MENU_SECTIONS,
  SABORES,
  WHATSAPP,
  WHATSAPP_DISPLAY,
} from "@/lib/catalog";
import { money } from "@/lib/format";

export const Route = createFileRoute("/carta")({ component: CartaPage });

function CartaPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandMark className="size-8" />
            <div className="leading-tight">
              <div className="font-display text-[15px] uppercase tracking-wide">A las Brasas</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Carnes & Grill</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/inventario"
              className="hidden text-xs font-medium uppercase tracking-wide text-ink/60 hover:text-ink sm:inline"
            >
              Inventario
            </Link>
            <Button asChild size="sm">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
                Pedir
              </a>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 pb-8 pt-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-banner">Menú</p>
        <h1 className="mt-3 font-display text-5xl uppercase tracking-wide text-ink sm:text-6xl">
          A las Brasas
        </h1>
        <p className="mt-2 font-display text-lg uppercase tracking-[0.2em] text-ink/55">Carnes & Grill</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/70">
          {ADDRESS_LINE}. {CITY_LINE}. Parrilla, costillas back rib, alitas y hamburguesas.
        </p>
        <nav className="mt-6 flex flex-wrap justify-center gap-2">
          {MENU_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="shrink-0 rounded-full bg-ink px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-paper"
            >
              {s.title}
            </button>
          ))}
        </nav>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-16">
        {MENU_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20 border-t border-ink/10 py-8">
            {section.kicker ? (
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink/45">{section.kicker}</p>
            ) : null}
            <h2 className="banner-stroke mt-2 text-xl sm:text-2xl">{section.title}</h2>
            {section.note ? (
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-ink/60">{section.note}</p>
            ) : null}
            <ul className="mt-5 divide-y divide-ink/10">
              {section.items.map((item) => (
                <li key={item.name} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="font-display text-lg uppercase tracking-wide text-ink">{item.name}</p>
                    {item.desc ? (
                      <p className="mt-0.5 text-xs leading-relaxed text-ink/55">{item.desc}</p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-lg tabular text-banner">{money(item.price)}</p>
                    {item.comboPrice ? (
                      <p className="text-[11px] uppercase tracking-wide text-ink/45">
                        Combo {money(item.comboPrice)}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="border-t border-ink/10 py-8">
          <h2 className="banner-stroke text-xl">Sabores a elegir</h2>
          <p className="mt-3 text-xs text-ink/60">Para alitas, boneless y costillas back rib.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SABORES.map((s) => (
              <span
                key={s}
                className="rounded-full border border-ink/15 px-3 py-1.5 text-[11px] uppercase tracking-wide text-ink/80"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-ink px-5 py-8 text-paper sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Pedidos</p>
          <h2 className="mt-2 font-display text-3xl uppercase">Haz tu pedido por WhatsApp</h2>
          <p className="mt-2 max-w-md text-sm text-paper/70">
            {ADDRESS_LINE}, {CITY_LINE}.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
                <Phone />
                {WHATSAPP_DISPLAY}
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/panel">
                Abrir kardex
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-paper/50">
            <MapPin className="size-3.5" /> {ADDRESS_LINE}
          </p>
        </section>
      </div>
    </div>
  );
}
