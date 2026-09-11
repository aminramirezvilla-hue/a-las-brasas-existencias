import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Flame, MapPin, Phone, Radio, Shield } from "lucide-react";
import { BrandMark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/asset";
import {
  ADDRESS_LINE,
  CITY_LINE,
  FUGAS,
  WHATSAPP,
  WHATSAPP_DISPLAY,
} from "@/lib/catalog";

export const Route = createFileRoute("/")({ component: Proposal });

const MAPA = [
  ["Checklist conforme / no conforme / no aplica", "Hay / Bajo / Falta por cada insumo"],
  ["Tres bloques: apertura, operación, cierre", "Apertura de cocina, servicio y cierre de turno"],
  ["Seis vicios críticos de la bitácora", "Seis fugas de existencias de parrilla"],
  ["Semáforo físico-financiero", "Semáforo de existencias del turno"],
  ["Narración S.T.A.R.T.", "Incidentes de faltante y quiebre de menú"],
  ["Expediente exportable", "Acta de existencias y faltantes del día"],
  ["Estado único + localStorage", "PWA local-first en el dispositivo de cocina"],
  ["Uso en campo, offline", "Uso en parrilla y almacén, con las manos ocupadas"],
];

const MODULOS = [
  { n: "01", t: "Inventario", d: "Los 88 insumos reales de A las Brasas. Un toque: Hay, Bajo o Falta." },
  { n: "02", t: "Panel", d: "Semáforo del turno: cuántos hay, cuántos están bajos y qué falta pedir." },
  { n: "03", t: "Conteo", d: "Cantidad opcional cuando quieras pesar o contar. No es obligatorio para operar." },
  { n: "04", t: "Checklist", d: "Apertura, servicio y cierre — misma disciplina que la bitácora CATU." },
  { n: "05", t: "Acta", d: "Expediente imprimible del turno: faltantes, bajos y constancia de revisión." },
  { n: "06", t: "Carta", d: "Menú de referencia con la imagen de A las Brasas." },
];

const INSUMOS = [
  { t: "Cortes", d: "Arrachera, Back Rib, RibEye, New York, Porterhouse, T-bone, picaña, chistorra, tuétanos, sirloin y carne para hamburguesa." },
  { t: "Pollo", d: "Pechuga, alitas (orden de 6) y boneless en bolsa." },
  { t: "Papas y snacks", d: "Francesa 2.2 kg, gajo, aros, dedos de queso, guacamole, papas para rellenar y elote." },
  { t: "Salsas y sazón", d: "BBQ, búfalo, habanero, mango, tamarindo, sriracha, ranch, mesa y condimentos." },
  { t: "Pan y lácteos", d: "Pan de hamburguesa y hot dog, Chihuahua, americano y parmesano." },
  { t: "Barra, empaque y limpieza", d: "Cervezas, refresco, contenedores, vasos, servilletas, cloro y Mr. Músculo." },
];

export function Proposal() {
  return (
    <div className="bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <BrandMark className="size-9" />
            <span className="font-display text-[15px] uppercase tracking-wide text-bone">
              A las Brasas
            </span>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/carta">Carta</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/inventario">
                Inventario
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <img
          src={asset("brand/menu-ribs.jpg")}
          alt="Costillas back rib de A las Brasas"
          width={533}
          height={800}
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-top outline outline-1 -outline-offset-1 outline-white/10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/40" />
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-16 sm:pt-24">
          <BrandMark className="size-16 shadow-[var(--shadow-border)] sm:size-24" />
          <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-ember">
            Chilpancingo, Guerrero · Col. Viguri
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-[-0.03em] text-bone sm:text-6xl">
            Control de existencias y faltantes.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            PWA para la cocina de A las Brasas: el encargado marca Hay, Bajo o Falta en cada insumo
            del menú. Misma disciplina que una bitácora de obra — tres estados, semáforo y acta del
            turno — sin kardex contable ni recetas obligatorias.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/inventario">
                Abrir inventario
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/panel">Ver panel de control</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-ember" /> {ADDRESS_LINE}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5 text-ember" /> {WHATSAPP_DISPLAY}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Radio className="size-3.5 text-ember" /> Local-first · instalable
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="size-3.5 text-ember" /> 88 insumos del menú real
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <Kicker n="01">El problema</Kicker>
        <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-[-0.02em] text-bone">
          Lo que falta en cámara es lo que ya no se puede vender esta noche.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "“Creo que hay”",
              d: "El encargado no recorre el listado. A las 21:00 se acaba el pan o el guacamole y se caen las hamburguesas.",
            },
            {
              t: "Libreta o WhatsApp",
              d: "El faltante se anuncia en un mensaje que nadie guarda. Al día siguiente no hay prueba de qué se pidió.",
            },
            {
              t: "Solo se mira la carne",
              d: "Cortes sí, empaque y limpieza no. Quedarse sin contenedores o cloro también para el servicio.",
            },
          ].map((c) => (
            <article key={c.t} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <h3 className="font-display text-xl text-bone">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <Kicker n="02">Objetivo</Kicker>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-bone">
          Controlar de forma sistemática —y a mano, en un toque— la existencia o el faltante de
          cada insumo del menú de A las Brasas, en Chilpancingo.
        </p>
        <ul className="mt-6 grid gap-2 text-sm text-muted sm:grid-cols-2">
          {[
            "Hay / Bajo / Falta en los 88 insumos del listado real",
            "Semáforo del turno: qué pedir antes de encender la parrilla",
            "Cantidad opcional cuando sí se quiere contar",
            "Checklist de apertura, servicio y cierre",
            "Acta imprimible de existencias y faltantes",
            "PWA offline, instalable en el teléfono de cocina",
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-ember" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <Kicker n="03">Alcance de insumos</Kicker>
        <h2 className="mt-3 font-display text-3xl tracking-[-0.02em] text-bone">
          El listado que usa la sucursal, no un catálogo genérico.
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INSUMOS.map((i) => (
            <article key={i.t} className="rounded-lg bg-card p-4 shadow-[var(--shadow-border)]">
              <h3 className="text-sm font-medium text-fg">{i.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{i.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="arquitectura" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16">
        <Kicker n="04">Arquitectura</Kicker>
        <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-[-0.02em] text-bone">
          Lo que ya funciona en CATU, aplicado a la parrilla.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          El checklist de bitácora de obra del Centro de Auditoría Técnica y Urbana no es un
          formulario: es un sistema de control preventivo. Esta PWA copia esa disciplina —tres
          estados, semáforo, S.T.A.R.T. y expediente— sobre los insumos de A las Brasas.
        </p>
        <div className="mt-8 overflow-hidden rounded-xl shadow-[var(--shadow-border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-raised text-[11px] uppercase tracking-[0.16em] text-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">Artefacto CATU</th>
                <th className="px-4 py-3 font-medium">A las Brasas</th>
              </tr>
            </thead>
            <tbody>
              {MAPA.map(([a, b]) => (
                <tr key={a} className="border-t border-border bg-card">
                  <td className="px-4 py-3 text-muted">{a}</td>
                  <td className="px-4 py-3 text-fg">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <Kicker n="05">Seis fugas críticas</Kicker>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Equivalentes a los seis vicios de la bitácora. Si uno está presente, el inventario ya no
          sirve como prueba.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {FUGAS.map((f, i) => (
            <article key={f.id} className="flex gap-4 rounded-lg bg-card p-4 shadow-[var(--shadow-border)]">
              <span className="font-display text-2xl text-ember/80">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-sm font-medium text-fg">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <Kicker n="06">Módulos</Kicker>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {MODULOS.map((m) => (
            <article key={m.n} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-ember">{m.n}</p>
              <h3 className="mt-2 font-display text-xl text-bone">{m.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{m.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <Kicker n="07">Cómo se usa</Kicker>
        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            { n: "1", t: "Abrir inventario", d: "Al llegar, recorrer cortes, pollo, panes y barra. Un toque por rubro." },
            { n: "2", t: "Pedir lo que Falta", d: "El panel lista faltantes y bajos. Eso es el pedido del día, no un recado." },
            { n: "3", t: "Cerrar con acta", d: "Checklist de cierre + exportar expediente. El siguiente turno hereda el semáforo." },
          ].map((x) => (
            <article key={x.n} className="rounded-lg bg-card p-4 shadow-[var(--shadow-border)]">
              <p className="font-display text-2xl text-ember">{x.n}</p>
              <h3 className="mt-2 text-sm font-medium text-fg">{x.t}</h3>
              <p className="mt-1 text-sm text-muted">{x.d}</p>
            </article>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-2xl bg-card px-6 py-10 shadow-[var(--shadow-border)] sm:px-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Prototipo listo</p>
          <h2 className="mt-3 font-display text-3xl text-bone">Cargado con A las Brasas, Col. Viguri.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Datos de demostración: pechuga y lechuga en Falta; papas francesa, guacamole, pan de
            hamburguesa y papas para rellenar en Bajo. Toca Hay para regularizarlos o deja Falta
            para armar el pedido.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/inventario">
                Empezar por el inventario
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/panel">Abrir panel</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-subtle">
        A las Brasas · {ADDRESS_LINE} · {CITY_LINE} · Control de existencias
        <span className="mx-2">·</span>
        <Flame className="inline size-3 text-ember" />
      </footer>
    </div>
  );
}

function Kicker({ n, children }: { n: string; children: string }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.26em] text-ember">
      {n} · {children}
    </p>
  );
}
