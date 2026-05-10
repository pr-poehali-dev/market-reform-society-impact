import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import Icon from "@/components/ui/icon";

const gdpData = [
  { year: "1990", gdp: 100 },
  { year: "1991", gdp: 95 },
  { year: "1992", gdp: 81 },
  { year: "1993", gdp: 74 },
  { year: "1994", gdp: 66 },
  { year: "1995", gdp: 63 },
  { year: "1996", gdp: 61 },
  { year: "1997", gdp: 62 },
  { year: "1998", gdp: 57 },
  { year: "1999", gdp: 61 },
  { year: "2000", gdp: 66 },
];

const inflationData = [
  { year: "1991", rate: 161 },
  { year: "1992", rate: 2608 },
  { year: "1993", rate: 840 },
  { year: "1994", rate: 215 },
  { year: "1995", rate: 131 },
  { year: "1996", rate: 22 },
  { year: "1997", rate: 11 },
  { year: "1998", rate: 84 },
  { year: "1999", rate: 36 },
  { year: "2000", rate: 20 },
];

const unemploymentData = [
  { year: "1990", rate: 5.6 },
  { year: "1991", rate: 5.2 },
  { year: "1992", rate: 5.9 },
  { year: "1993", rate: 8.9 },
  { year: "1994", rate: 10.6 },
  { year: "1995", rate: 11.4 },
  { year: "1996", rate: 12.5 },
  { year: "1997", rate: 12.8 },
  { year: "1998", rate: 13.3 },
  { year: "1999", rate: 12.9 },
  { year: "2000", rate: 10.6 },
];

const povertyData = [
  { year: "1990", below: 2 },
  { year: "1991", below: 12 },
  { year: "1992", below: 34 },
  { year: "1993", below: 32 },
  { year: "1994", below: 33 },
  { year: "1995", below: 26 },
  { year: "1996", below: 24 },
  { year: "1997", below: 23 },
  { year: "1998", below: 24 },
  { year: "1999", below: 29 },
  { year: "2000", below: 29 },
];

const navItems = [
  { id: "home", label: "Главная" },
  { id: "intro", label: "Введение" },
  { id: "reforms", label: "Реформы" },
  { id: "consequences", label: "Последствия" },
  { id: "statistics", label: "Статистика" },
  { id: "bibliography", label: "Библиография" },
];

interface TooltipEntry { color: string; value: number | string; }
interface TooltipProps { active?: boolean; payload?: TooltipEntry[]; label?: string; suffix?: string; }

const CustomTooltip = ({ active, payload, label, suffix = "" }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#F0E8D8", border: "1px solid #C8B89A", padding: "10px 14px" }}>
        <p style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: "#6B5E54", marginBottom: 4 }}>{label}</p>
        {payload.map((entry: TooltipEntry, i: number) => (
          <p key={i} style={{ fontFamily: "IBM Plex Mono", fontSize: 13, fontWeight: 600, color: entry.color }}>
            {entry.value}{suffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function SectionHeader({
  number, title, subtitle, light = false,
}: {
  number: string; title: string; subtitle: string; light?: boolean;
}) {
  return (
    <div className="border-b pb-6" style={{ borderColor: light ? "#4A3C34" : "#C8B89A" }}>
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: "#9A7B4F" }}>
          §{number}
        </span>
        <div className="h-px flex-1" style={{ background: light ? "#4A3C34" : "#E8E0CC" }} />
      </div>
      <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3"
        style={{ color: light ? "#F5F0E8" : "#1C1714" }}>
        {title}
      </h2>
      <p className="font-sans text-sm mt-2" style={{ color: light ? "#9A7B4F" : "#6B5E54" }}>
        {subtitle}
      </p>
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [navOpen, setNavOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(["home"]));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-80px 0px 0px 0px" }
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: "#F5F0E8", color: "#1C1714" }}>

      {/* ── HEADER ── */}
      <header style={{ background: "rgba(245,240,232,0.97)", borderBottom: "1px solid #C8B89A" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div style={{ width: 22, height: 22, border: "1px solid #8B1A1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 8, height: 8, background: "#8B1A1A" }} />
              </div>
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#6B5E54" }}>
                Научное издание
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)}
                  className="font-sans text-sm transition-colors duration-200"
                  style={{
                    color: activeSection === item.id ? "#8B1A1A" : "#6B5E54",
                    borderBottom: activeSection === item.id ? "1px solid #8B1A1A" : "1px solid transparent",
                    paddingBottom: 2,
                  }}>
                  {item.label}
                </button>
              ))}
            </nav>

            <button className="md:hidden p-2" style={{ color: "#6B5E54" }} onClick={() => setNavOpen(!navOpen)}>
              <Icon name={navOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>
        {navOpen && (
          <div style={{ borderTop: "1px solid #C8B89A", background: "#F5F0E8" }}>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="block w-full text-left px-6 py-3 text-sm"
                style={{ color: "#1C1714", borderBottom: "1px solid #E8E0CC" }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="home" className="pt-16 min-h-screen flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: "linear-gradient(#1C1714 1px, transparent 1px), linear-gradient(90deg, #1C1714 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        <div className="max-w-6xl mx-auto px-6 py-24 relative">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-4 mb-8">
              <div style={{ height: 1, width: 56, background: "#C8B89A" }} />
              <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: "#9A7B4F" }}>
                Экономическая история России
              </span>
              <div style={{ height: 1, width: 56, background: "#C8B89A" }} />
            </div>

            <h1 className="font-serif font-bold leading-[1.1] mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#1C1714" }}>
              Рыночные реформы<br />
              <em style={{ color: "#8B1A1A" }}>1990-х годов</em>
            </h1>

            <div style={{ height: 1, background: "linear-gradient(to right, #8B1A1A, #C8B89A, transparent)", maxWidth: 560, marginBottom: 32 }} />

            <p className="font-sans leading-relaxed mb-12" style={{ fontSize: 18, color: "#6B5E54", maxWidth: 580 }}>
              Комплексный анализ экономических преобразований постсоветской России:
              либерализация цен, приватизация государственной собственности и
              макроэкономическая стабилизация.
            </p>

            <div className="flex flex-wrap gap-5 mb-16">
              {[
                { label: "Падение ВВП", value: "−43%", sub: "1990–1998 гг." },
                { label: "Инфляция", value: "2608%", sub: "1992 г." },
                { label: "Безработица", value: "13.3%", sub: "пик 1998 г." },
                { label: "Приватизировано", value: "~140 000", sub: "предприятий" },
              ].map((stat, i) => (
                <div key={i} className="animate-fade-in-up"
                  style={{ border: "1px solid #C8B89A", padding: "20px 24px", minWidth: 130, animationDelay: `${0.15 + i * 0.1}s`, opacity: 0 }}>
                  <div className="font-serif text-2xl font-bold" style={{ color: "#8B1A1A" }}>{stat.value}</div>
                  <div className="font-sans text-xs mt-1" style={{ color: "#6B5E54" }}>{stat.label}</div>
                  <div className="font-mono text-xs mt-0.5" style={{ color: "#9A7B4F" }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            <button onClick={() => scrollTo("intro")}
              className="flex items-center gap-3 transition-colors group"
              style={{ color: "#1C1714" }}>
              <span className="font-sans text-sm tracking-wider uppercase">Читать исследование</span>
              <div style={{ width: 32, height: 1, background: "currentColor", transition: "width 0.3s" }} />
              <Icon name="ArrowDown" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── ВВЕДЕНИЕ ── */}
      <section id="intro"
        className="py-24 transition-all duration-700"
        style={{ borderTop: "1px solid #C8B89A", opacity: visibleSections.has("intro") ? 1 : 0, transform: visibleSections.has("intro") ? "none" : "translateY(20px)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader number="I" title="Введение" subtitle="Предпосылки и контекст реформ" />

          <div className="grid md:grid-cols-3 gap-12 mt-12">
            <div className="md:col-span-2">
              <p className="font-sans leading-[1.9] mb-6 drop-cap" style={{ fontSize: 17, color: "#2C2420" }}>
                Распад Советского Союза в 1991 году поставил Россию перед беспрецедентной задачей —
                в кратчайшие сроки осуществить переход от плановой экономики к рыночной. Масштаб и
                скорость этих преобразований не имели аналогов в мировой истории.
              </p>
              <p className="font-sans leading-[1.9] mb-6" style={{ fontSize: 17, color: "#2C2420" }}>
                Правительство под руководством Е.Т. Гайдара избрало стратегию «шоковой терапии»,
                опираясь на рекомендации МВФ и западных экономических советников. Данный подход
                предполагал одновременное проведение либерализации цен, приватизации и финансовой
                стабилизации.
              </p>
              <div className="citation">
                «Россия проводит самую смелую экономическую реформу со времён Людвига Эрхарда
                в Западной Германии» — <em>Financial Times, 1992</em>
              </div>
            </div>

            <div>
              <div style={{ background: "#EDE7D8", border: "1px solid #C8B89A", padding: 20 }}>
                <h4 className="font-serif text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#8B1A1A" }}>
                  Ключевые даты
                </h4>
                {[
                  { date: "Дек. 1991", event: "Распад СССР" },
                  { date: "Янв. 1992", event: "Либерализация цен" },
                  { date: "Авг. 1992", event: "Ваучерная приватизация" },
                  { date: "Окт. 1993", event: "Конституционный кризис" },
                  { date: "Авг. 1998", event: "Дефолт по ГКО" },
                  { date: "Дек. 1999", event: "Начало стабилизации" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 py-2" style={{ borderBottom: "1px solid rgba(200,184,154,0.4)" }}>
                    <span className="font-mono text-xs whitespace-nowrap" style={{ color: "#9A7B4F" }}>{item.date}</span>
                    <span className="font-sans text-xs" style={{ color: "#2C2420" }}>{item.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── РЕФОРМЫ ── */}
      <section id="reforms"
        className="py-24 transition-all duration-700"
        style={{ background: "#EDE7D8", borderTop: "1px solid #C8B89A", opacity: visibleSections.has("reforms") ? 1 : 0, transform: visibleSections.has("reforms") ? "none" : "translateY(20px)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader number="II" title="Рыночные реформы 1990-х годов" subtitle="Механизмы и этапы преобразований" />

          <div className="grid md:grid-cols-2 gap-7 mt-12">
            {[
              {
                num: "01", title: "Либерализация цен", date: "Январь 1992",
                text: "Единовременная отмена государственного регулирования цен на большинство товаров и услуг. За первые месяцы потребительские цены выросли в 3–5 раз, что немедленно ликвидировало советский «денежный навес».",
              },
              {
                num: "02", title: "Ваучерная приватизация", date: "1992–1994",
                text: "Каждый гражданин России получил приватизационный чек номиналом 10 000 рублей. Было приватизировано около 140 000 предприятий. Критики указывали на концентрацию собственности в руках узкой группы.",
              },
              {
                num: "03", title: "Залоговые аукционы", date: "1995–1996",
                text: "Спорная схема, по которой крупнейшие промышленные активы были переданы банкирам в обмен на кредиты государству. Именно этот механизм породил феномен «олигархов».",
              },
              {
                num: "04", title: "Финансовая стабилизация", date: "1995–1998",
                text: "Введение «валютного коридора», выпуск ГКО для покрытия бюджетного дефицита, переговоры с МВФ о кредитах. Финансовая конструкция оказалась неустойчивой и рухнула в августе 1998 года.",
              },
            ].map((card, i) => (
              <div key={i} style={{ background: "#F5F0E8", border: "1px solid #C8B89A", padding: 28 }}>
                <div className="flex items-start justify-between mb-4">
                  <span className="font-mono font-bold" style={{ fontSize: 32, color: "#C8B89A" }}>{card.num}</span>
                  <span className="font-mono text-xs" style={{ border: "1px solid #9A7B4F", color: "#9A7B4F", padding: "3px 8px" }}>{card.date}</span>
                </div>
                <h3 className="font-serif text-xl font-bold mb-3" style={{ color: "#1C1714" }}>{card.title}</h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "#6B5E54" }}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПОСЛЕДСТВИЯ ── */}
      <section id="consequences"
        className="py-24 transition-all duration-700"
        style={{ borderTop: "1px solid #C8B89A", opacity: visibleSections.has("consequences") ? 1 : 0, transform: visibleSections.has("consequences") ? "none" : "translateY(20px)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader number="III" title="Социально-экономические последствия" subtitle="Трансформация общества и экономики" />

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { color: "#8B1A1A", title: "Имущественное расслоение", text: "Коэффициент Джини вырос с 0.26 в 1991 году до 0.40 в 1994-м. Сформировался тонкий слой «новых богатых» на фоне резкого обнищания основной массы населения." },
              { color: "#9A7B4F", title: "Демографический кризис", text: "Смертность превысила рождаемость. Средняя продолжительность жизни мужчин снизилась с 63.8 лет (1990) до 57.6 лет (1994) — феномен «сверхсмертности»." },
              { color: "#5C7A5C", title: "Деиндустриализация", text: "Промышленное производство упало на 50%. Особенно пострадали наукоёмкие отрасли, оборонный комплекс и лёгкая промышленность." },
              { color: "#4A5A6B", title: "Утечка мозгов", text: "За 1990-е годы Россию покинули сотни тысяч квалифицированных специалистов — учёные, инженеры, врачи." },
              { color: "#8B1A1A", title: "Кризис 1998 года", text: "Дефолт по государственным облигациям и девальвация рубля в 4 раза за несколько недель. Уничтожено множество банков, вкладчики потеряли сбережения." },
              { color: "#6B5E54", title: "Неформальная экономика", text: "Возникла масштабная теневая экономика — бартер, задержки зарплат, «серые» схемы. По оценкам, неформальный сектор достигал 40–50% ВВП." },
            ].map((item, i) => (
              <div key={i} className="pt-5" style={{ borderTop: `2px solid ${item.color}` }}>
                <h4 className="font-serif text-lg font-bold mb-3" style={{ color: "#1C1714" }}>{item.title}</h4>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "#6B5E54" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── СТАТИСТИКА ── */}
      <section id="statistics"
        className="py-24 transition-all duration-700"
        style={{ background: "#1C1714", borderTop: "1px solid #C8B89A", opacity: visibleSections.has("statistics") ? 1 : 0, transform: visibleSections.has("statistics") ? "none" : "translateY(20px)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader number="IV" title="Статистика и данные периода" subtitle="Визуализация ключевых макроэкономических показателей" light />

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* ВВП */}
            <div style={{ background: "#2C2420", border: "1px solid #4A3C34", padding: 24 }}>
              <h4 className="font-serif font-bold mb-1" style={{ color: "#F5F0E8" }}>Динамика ВВП России</h4>
              <p className="font-mono text-xs mb-5" style={{ color: "#9A7B4F" }}>1990 = 100% · Источник: Росстат</p>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={gdpData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B1A1A" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#8B1A1A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#3A2E28" />
                  <XAxis dataKey="year" tick={{ fill: "#9A7B4F", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9A7B4F", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip suffix="%" />} />
                  <Area type="monotone" dataKey="gdp" stroke="#8B1A1A" strokeWidth={2} fill="url(#gdpGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Инфляция */}
            <div style={{ background: "#2C2420", border: "1px solid #4A3C34", padding: 24 }}>
              <h4 className="font-serif font-bold mb-1" style={{ color: "#F5F0E8" }}>Инфляция (ИПЦ)</h4>
              <p className="font-mono text-xs mb-5" style={{ color: "#9A7B4F" }}>Прирост цен, % год к году · Источник: ЦБ РФ</p>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={inflationData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#3A2E28" />
                  <XAxis dataKey="year" tick={{ fill: "#9A7B4F", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9A7B4F", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip suffix="%" />} />
                  <Bar dataKey="rate" fill="#9A7B4F" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Безработица */}
            <div style={{ background: "#2C2420", border: "1px solid #4A3C34", padding: 24 }}>
              <h4 className="font-serif font-bold mb-1" style={{ color: "#F5F0E8" }}>Уровень безработицы</h4>
              <p className="font-mono text-xs mb-5" style={{ color: "#9A7B4F" }}>% от экономически активного населения · МОТ</p>
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={unemploymentData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#3A2E28" />
                  <XAxis dataKey="year" tick={{ fill: "#9A7B4F", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9A7B4F", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip suffix="%" />} />
                  <Line type="monotone" dataKey="rate" stroke="#C8B89A" strokeWidth={2} dot={{ fill: "#C8B89A", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Бедность */}
            <div style={{ background: "#2C2420", border: "1px solid #4A3C34", padding: 24 }}>
              <h4 className="font-serif font-bold mb-1" style={{ color: "#F5F0E8" }}>Население за чертой бедности</h4>
              <p className="font-mono text-xs mb-5" style={{ color: "#9A7B4F" }}>% населения · Источник: Всемирный банк</p>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={povertyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="povGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5C7A5C" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#5C7A5C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#3A2E28" />
                  <XAxis dataKey="year" tick={{ fill: "#9A7B4F", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9A7B4F", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip suffix="%" />} />
                  <Area type="monotone" dataKey="below" stroke="#5C7A5C" strokeWidth={2} fill="url(#povGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="font-mono text-xs text-center mt-6" style={{ color: "#6B5E54" }}>
            * Данные основаны на официальных публикациях Росстата, ЦБ РФ, МВФ и Всемирного банка
          </p>
        </div>
      </section>

      {/* ── БИБЛИОГРАФИЯ ── */}
      <section id="bibliography"
        className="py-24 transition-all duration-700"
        style={{ borderTop: "1px solid #C8B89A", opacity: visibleSections.has("bibliography") ? 1 : 0, transform: visibleSections.has("bibliography") ? "none" : "translateY(20px)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader number="V" title="Библиография и научные источники" subtitle="Избранные монографии, статьи и статистические сборники" />

          <div className="grid md:grid-cols-2 gap-x-16 mt-12">
            {[
              { authors: "Гайдар, Е.Т.", year: "1996", title: "Дни поражений и побед", pub: "Вагриус, Москва" },
              { authors: "Гайдар, Е.Т.", year: "2009", title: "Гибель империи. Уроки для современной России", pub: "РОССПЭН, Москва" },
              { authors: "Ясин, Е.Г.", year: "2003", title: "Российская экономика: истоки и панорама рыночных реформ", pub: "ГУ ВШЭ, Москва" },
              { authors: "Аслунд, А.", year: "1995", title: "Россия: рождение рыночной экономики", pub: "Республика, Москва" },
              { authors: "Илларионов, А.Н.", year: "1996", title: "Попытки проведения политики финансовой стабилизации в СССР и России", pub: "Вопросы экономики, №7" },
              { authors: "Авен, П.О., Кох, А.Р.", year: "2013", title: "Революция Гайдара: история реформ 90-х из первых рук", pub: "Альпина Паблишер, Москва" },
              { authors: "Федоров, Б.Г.", year: "1999", title: "10 безумных лет: почему в России не состоялись реформы", pub: "Совершенно секретно, Москва" },
              { authors: "Росстат", year: "1995–2001", title: "Российский статистический ежегодник", pub: "Росстат, Москва" },
              { authors: "Центральный банк Российской Федерации", year: "1993–2001", title: "Годовой отчёт Банка России", pub: "ЦБ РФ, Москва" },
              { authors: "Мау, В.А.", year: "2010", title: "Драма 2008 года: от экономического чуда к экономическому кризису", pub: "Вопросы экономики, №2" },
            ].map((ref, i) => (
              <div key={i} className="flex gap-4 py-4" style={{ borderBottom: "1px solid #E8E0CC" }}>
                <span className="font-mono text-xs mt-1" style={{ color: "#C8B89A", minWidth: 20 }}>{i + 1}.</span>
                <div>
                  <p className="font-sans text-sm" style={{ color: "#2C2420" }}>
                    <span style={{ fontWeight: 500 }}>{ref.authors}</span>{" "}
                    <span style={{ color: "#9A7B4F" }}>({ref.year})</span>{" "}
                    <em>{ref.title}</em>
                  </p>
                  <p className="font-mono text-xs mt-0.5" style={{ color: "#9A7B4F" }}>{ref.pub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #C8B89A", background: "#EDE7D8", padding: "40px 24px" }}>
        <div className="max-w-6xl mx-auto text-center">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, justifyContent: "center" }}>
            <div style={{ height: 1, flex: 1, maxWidth: 120, background: "linear-gradient(to right, transparent, #C8B89A)" }} />
            <span className="font-mono text-xs" style={{ color: "#9A7B4F", letterSpacing: "0.2em" }}>◆</span>
            <div style={{ height: 1, flex: 1, maxWidth: 120, background: "linear-gradient(to left, transparent, #C8B89A)" }} />
          </div>
          <p className="font-serif italic text-sm mb-2" style={{ color: "#6B5E54" }}>
            Рыночные реформы 1990-х годов в России: анализ причин, механизмов и последствий
          </p>
          <p className="font-mono text-xs" style={{ color: "#9A7B4F" }}>Академическое издание · 2024</p>
        </div>
      </footer>
    </div>
  );
}