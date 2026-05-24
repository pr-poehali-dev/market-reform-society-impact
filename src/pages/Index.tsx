import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import Icon from "@/components/ui/icon";

// ── DATA ──────────────────────────────────────────────────────────────────────

const gdpData = [
  { year: "1990", gdp: 100 }, { year: "1991", gdp: 95 },
  { year: "1992", gdp: 81 }, { year: "1993", gdp: 74 },
  { year: "1994", gdp: 66 }, { year: "1995", gdp: 63 },
  { year: "1996", gdp: 61 }, { year: "1997", gdp: 62 },
  { year: "1998", gdp: 57 }, { year: "1999", gdp: 61 },
  { year: "2000", gdp: 66 },
];

const inflationData = [
  { year: "1991", rate: 161 }, { year: "1992", rate: 2608 },
  { year: "1993", rate: 840 }, { year: "1994", rate: 215 },
  { year: "1995", rate: 131 }, { year: "1996", rate: 22 },
  { year: "1997", rate: 11 },  { year: "1998", rate: 84 },
  { year: "1999", rate: 36 },  { year: "2000", rate: 20 },
];

const unemploymentData = [
  { year: "1990", rate: 5.6 }, { year: "1991", rate: 5.2 },
  { year: "1992", rate: 5.9 }, { year: "1993", rate: 8.9 },
  { year: "1994", rate: 10.6 }, { year: "1995", rate: 11.4 },
  { year: "1996", rate: 12.5 }, { year: "1997", rate: 12.8 },
  { year: "1998", rate: 13.3 }, { year: "1999", rate: 12.9 },
  { year: "2000", rate: 10.6 },
];

const povertyData = [
  { year: "1990", below: 2 },  { year: "1991", below: 12 },
  { year: "1992", below: 34 }, { year: "1993", below: 32 },
  { year: "1994", below: 33 }, { year: "1995", below: 26 },
  { year: "1996", below: 24 }, { year: "1997", below: 23 },
  { year: "1998", below: 24 }, { year: "1999", below: 29 },
  { year: "2000", below: 29 },
];

const realWagesData = [
  { year: "1990", index: 100 }, { year: "1991", index: 88 },
  { year: "1992", index: 57 }, { year: "1993", index: 63 },
  { year: "1994", index: 61 }, { year: "1995", index: 54 },
  { year: "1996", index: 55 }, { year: "1997", index: 60 },
  { year: "1998", index: 48 }, { year: "1999", index: 44 },
  { year: "2000", index: 50 },
];

const timelineEvents = [
  { year: 1991, month: "Декабрь", title: "Распад СССР", desc: "Подписание Беловежских соглашений. Ельцин, Кравчук и Шушкевич официально ликвидируют Советский Союз. Россия провозглашается правопреемником.", color: "#8B1A1A", icon: "Flag" },
  { year: 1992, month: "Январь", title: "Либерализация цен", desc: "«Шоковая терапия» Гайдара: снятие государственного контроля над ценами на большинство товаров. За месяц инфляция составила 245%. Население теряет сбережения.", color: "#8B1A1A", icon: "TrendingUp" },
  { year: 1992, month: "Август", title: "Ваучерная приватизация", desc: "Каждый гражданин России получает приватизационный чек номиналом 10 000 рублей. Запускается массовая передача государственной собственности в частные руки.", color: "#9A7B4F", icon: "FileText" },
  { year: 1993, month: "Октябрь", title: "Конституционный кризис", desc: "Противостояние Ельцина и Верховного Совета завершается расстрелом Белого дома. Принята новая Конституция, резко усиливающая президентскую власть.", color: "#8B1A1A", icon: "AlertTriangle" },
  { year: 1994, month: "Октябрь", title: "Чёрный вторник", desc: "Рубль падает к доллару на 27% за один день — с 2833 до 3926 рублей. Председатель ЦБ Геращенко отправлен в отставку.", color: "#8B1A1A", icon: "TrendingDown" },
  { year: 1995, month: "Ноябрь", title: "Залоговые аукционы", desc: "Правительство передаёт крупнейшие промышленные активы (ЮКОС, Норильский никель, Сибнефть) приближённым банкирам в обмен на займы. Рождение «семибанкирщины».", color: "#9A7B4F", icon: "Landmark" },
  { year: 1996, month: "Июль", title: "Переизбрание Ельцина", desc: "Президентские выборы при рейтинге 3–6% в начале кампании. Ельцин побеждает во втором туре. Олигархи сыграли ключевую роль в медиаподдержке.", color: "#4A5A6B", icon: "Vote" },
  { year: 1998, month: "Август", title: "Дефолт", desc: "Россия объявляет технический дефолт по ГКО. Рубль девальвирован в 4 раза. Крах большинства банков. ВВП в 1998 году — всего 57% от уровня 1990 года.", color: "#8B1A1A", icon: "Zap" },
  { year: 1999, month: "Декабрь", title: "Приход Путина", desc: "Ельцин досрочно слагает полномочия. Исполняющим обязанности президента становится Владимир Путин. Начинается новый этап в истории России.", color: "#4A5A6B", icon: "ArrowRight" },
  { year: 2000, month: "Март", title: "Начало стабилизации", desc: "Победа Путина на президентских выборах. Высокие нефтяные цены дают толчок восстановлению. ВВП начинает устойчивый рост, впервые с 1990 года.", color: "#5C7A5C", icon: "TrendingUp" },
];

const reformDetails = [
  {
    num: "01", title: "Либерализация цен", date: "Январь 1992",
    summary: "Единовременное снятие государственного контроля над ценами. За первые 2 месяца цены выросли в 5 раз.",
    details: `2 января 1992 года правительство Гайдара освободило цены на 90% товаров. Теоретически это должно было быстро сбалансировать спрос и предложение. На практике монополистическая структура советской экономики привела к взрывному росту цен без адекватного роста производства. Накопленные гражданами сбережения (около 400 млрд рублей) фактически обесценились за несколько месяцев. Реальные доходы населения упали в 1992 году на 43%.`,
    cite: "«Либерализация цен была необходима, но её последствия оказались катастрофическими для большинства граждан» — Е.Т. Гайдар, «Дни поражений и побед»",
    stats: [{ label: "Рост цен за 1992", value: "2608%" }, { label: "Падение реальных доходов", value: "−43%" }],
  },
  {
    num: "02", title: "Ваучерная приватизация", date: "1992–1994",
    summary: "140 000 предприятий приватизировано. Каждый гражданин получил ваучер номиналом 10 000 рублей.",
    details: `Программа разработана командой Чубайса при участии американских советников. Предполагалось, что ваучеры станут равным стартовым капиталом для всех граждан. Однако большинство населения продавало чеки за бесценок или вкладывало в мошеннические «чековые инвестиционные фонды» (ЧИФы). Директора предприятий скупали контроль через подставных лиц. К 1994 году около 70% промышленных активов перешло в частные руки, но концентрация собственности оказалась крайне неравномерной.`,
    cite: "«Каждый ваучер стоит две «Волги». На самом деле он стоил меньше бутылки водки» — народное выражение эпохи",
    stats: [{ label: "Приватизировано предприятий", value: "~140 000" }, { label: "Доля частного сектора в ВВП к 1995", value: "~55%" }],
  },
  {
    num: "03", title: "Залоговые аукционы", date: "1995–1996",
    summary: "12 крупнейших промышленных компаний переданы банкирам в обмен на кредиты государству.",
    details: `Схему предложил Владимир Потанин: банки кредитуют правительство под залог акций крупнейших госпредприятий. Когда государство ожидаемо не смогло вернуть кредиты, банки стали собственниками активов. За бесценок были приобретены ЮКОС (Михаил Ходорковский), «Норильский никель» (Потанин), «Сибнефть» (Березовский/Абрамович). Именно залоговые аукционы породили феномен российских олигархов и предопределили структуру экономики на десятилетия вперёд.`,
    cite: "«Залоговые аукционы — это была кража. Государственная собственность была продана за копейки» — А.Б. Чубайс, интервью 2004 г.",
    stats: [{ label: "ЮКОС куплен за", value: "$309 млн" }, { label: "Норникель куплен за", value: "$170 млн" }],
  },
  {
    num: "04", title: "Финансовая стабилизация и ГКО", date: "1995–1998",
    summary: "Введение «валютного коридора» и государственных краткосрочных облигаций. Пирамида рухнула в 1998 году.",
    details: `Для борьбы с инфляцией ЦБ ввёл «валютный коридор» — жёсткий контроль курса рубля. Бюджетный дефицит покрывался выпуском ГКО (государственных краткосрочных облигаций) с доходностью до 150–200% годовых. Иностранные инвесторы активно скупали ГКО. Когда в 1997–1998 годах упали цены на нефть и разразился азиатский финансовый кризис, правительство не смогло обслуживать долг. 17 августа 1998 года объявлен дефолт. Рубль рухнул с 6 до 24 рублей за доллар.`,
    cite: "«ГКО были финансовой пирамидой государственного масштаба» — Б.Г. Федоров, «10 безумных лет»",
    stats: [{ label: "Доходность ГКО в пике", value: "до 200%" }, { label: "Девальвация рубля за 1998", value: "×4" }],
  },
];

const quotes = [
  { text: "Мы знали, что реформы будут болезненными. Но мы не знали, насколько.", author: "Е.Т. Гайдар", year: "1994", source: "Дни поражений и побед" },
  { text: "Россия прошла путь от социализма к капитализму быстрее, чем любая страна в истории. Это стоило огромной цены.", author: "Е.Г. Ясин", year: "2003", source: "ГУ ВШЭ" },
  { text: "Приватизация создала не рыночную экономику, а систему, в которой выиграли немногие.", author: "А.Н. Илларионов", year: "1996", source: "Вопросы экономики" },
];

const navItems = [
  { id: "home", label: "Главная" },
  { id: "intro", label: "Введение" },
  { id: "timeline", label: "Хронология" },
  { id: "reforms", label: "Реформы" },
  { id: "consequences", label: "Последствия" },
  { id: "statistics", label: "Статистика" },
  { id: "bibliography", label: "Библиография" },
];

// ── TYPES & HELPERS ────────────────────────────────────────────────────────────

interface TooltipEntry { color: string; value: number | string; name?: string; }
interface TooltipProps { active?: boolean; payload?: TooltipEntry[]; label?: string; suffix?: string; }

const CustomTooltip = ({ active, payload, label, suffix = "" }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#F0E8D8", border: "1px solid #C8B89A", padding: "10px 14px", fontFamily: "IBM Plex Mono" }}>
        <p style={{ fontSize: 11, color: "#6B5E54", marginBottom: 4 }}>{label}</p>
        {payload.map((entry: TooltipEntry, i: number) => (
          <p key={i} style={{ fontSize: 13, fontWeight: 600, color: entry.color ?? "#8B1A1A" }}>
            {entry.value}{suffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function SectionHeader({ number, title, subtitle, light = false }: {
  number: string; title: string; subtitle: string; light?: boolean;
}) {
  return (
    <div className="border-b pb-6" style={{ borderColor: light ? "#4A3C34" : "#C8B89A" }}>
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: "#9A7B4F" }}>§{number}</span>
        <div className="h-px flex-1" style={{ background: light ? "#4A3C34" : "#E8E0CC" }} />
      </div>
      <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3" style={{ color: light ? "#F5F0E8" : "#1C1714" }}>
        {title}
      </h2>
      <p className="font-sans text-sm mt-2" style={{ color: light ? "#9A7B4F" : "#6B5E54" }}>{subtitle}</p>
    </div>
  );
}

function AnimatedNumber({ target, suffix = "", duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCurrent(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{current.toLocaleString("ru-RU")}{suffix}</span>;
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [navOpen, setNavOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(["home"]));
  const [activeChart, setActiveChart] = useState<"gdp" | "inflation" | "unemployment" | "poverty" | "wages">("gdp");
  const [expandedReform, setExpandedReform] = useState<number | null>(null);
  const [activeQuote, setActiveQuote] = useState(0);
  const [activeTimelineYear, setActiveTimelineYear] = useState<number | null>(null);

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
      { threshold: 0.08, rootMargin: "-80px 0px 0px 0px" }
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveQuote(q => (q + 1) % quotes.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const vis = (id: string) => visibleSections.has(id);

  const chartConfigs = {
    gdp: { label: "ВВП", data: gdpData, key: "gdp", color: "#8B1A1A", suffix: "%", note: "1990 = 100% · Источник: Росстат", type: "area" as const },
    inflation: { label: "Инфляция", data: inflationData, key: "rate", color: "#9A7B4F", suffix: "%", note: "Прирост цен, год к году · Источник: ЦБ РФ", type: "bar" as const },
    unemployment: { label: "Безработица", data: unemploymentData, key: "rate", color: "#C8B89A", suffix: "%", note: "% от экономически активного населения · МОТ", type: "line" as const },
    poverty: { label: "Бедность", data: povertyData, key: "below", color: "#5C7A5C", suffix: "%", note: "% населения за чертой бедности · Всемирный банк", type: "area" as const },
    wages: { label: "Реальные зарплаты", data: realWagesData, key: "index", color: "#4A5A6B", suffix: "%", note: "1990 = 100% · Источник: Росстат", type: "line" as const },
  };

  const cc = chartConfigs[activeChart];

  return (
    <div className="min-h-screen font-sans" style={{ background: "#F5F0E8", color: "#1C1714" }}>

      {/* ── HEADER ── */}
      <header style={{ background: "rgba(245,240,232,0.97)", borderBottom: "1px solid #C8B89A" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("home")}>
              <div style={{ width: 22, height: 22, border: "1px solid #8B1A1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 8, height: 8, background: "#8B1A1A" }} />
              </div>
              <span className="font-mono text-xs tracking-widest uppercase hidden sm:inline" style={{ color: "#6B5E54" }}>Научное издание</span>
            </div>
            <nav className="hidden lg:flex items-center gap-5">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)}
                  className="font-sans text-sm transition-all duration-200"
                  style={{
                    color: activeSection === item.id ? "#8B1A1A" : "#6B5E54",
                    borderBottom: activeSection === item.id ? "1px solid #8B1A1A" : "1px solid transparent",
                    paddingBottom: 2,
                  }}>
                  {item.label}
                </button>
              ))}
            </nav>
            <button className="lg:hidden p-2" style={{ color: "#6B5E54" }} onClick={() => setNavOpen(!navOpen)}>
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
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.025]" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #8B1A1A 0px, #8B1A1A 1px, transparent 0, transparent 50%)",
          backgroundSize: "12px 12px",
        }} />

        <div className="max-w-7xl mx-auto px-6 py-24 relative">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-4 mb-8">
              <div style={{ height: 1, width: 56, background: "#C8B89A" }} />
              <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: "#9A7B4F" }}>
                Экономическая история России · 1991–2000
              </span>
              <div style={{ height: 1, width: 56, background: "#C8B89A" }} />
            </div>

            <h1 className="font-serif font-bold leading-[1.05] mb-6" style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", color: "#1C1714" }}>
              Рыночные реформы<br />
              <em style={{ color: "#8B1A1A" }}>1990-х годов</em>
            </h1>

            <div style={{ height: 2, background: "linear-gradient(to right, #8B1A1A 0%, #C8B89A 40%, transparent 100%)", maxWidth: 560, marginBottom: 28 }} />

            <p className="font-sans leading-relaxed mb-12" style={{ fontSize: 18, color: "#6B5E54", maxWidth: 580 }}>
              Комплексный анализ экономических преобразований постсоветской России:
              от шоковой терапии 1992 года до дефолта 1998-го и начала стабилизации.
            </p>

            {/* Animated counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
              {[
                { label: "Падение ВВП к 1998", value: 43, suffix: "%", sign: "−", sub: "от уровня 1990 г." },
                { label: "Инфляция в 1992", value: 2608, suffix: "%", sign: "", sub: "рекордный показатель" },
                { label: "Безработица в 1998", value: 13.3, suffix: "%", sign: "", sub: "пик периода реформ" },
                { label: "Приватизировано", value: 140000, suffix: "", sign: "~", sub: "предприятий к 1994 г." },
              ].map((stat, i) => (
                <div key={i} className="animate-fade-in-up"
                  style={{ border: "1px solid #C8B89A", padding: "18px 20px", animationDelay: `${0.1 + i * 0.1}s`, opacity: 0, background: "rgba(237,231,216,0.5)" }}>
                  <div className="font-serif text-xl md:text-2xl font-bold" style={{ color: "#8B1A1A" }}>
                    {stat.sign}<AnimatedNumber target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="font-sans text-xs mt-1" style={{ color: "#6B5E54" }}>{stat.label}</div>
                  <div className="font-mono text-xs mt-0.5" style={{ color: "#9A7B4F" }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollTo("intro")}
                className="flex items-center gap-3 transition-colors"
                style={{ color: "#1C1714" }}>
                <span className="font-sans text-sm tracking-wider uppercase">Читать исследование</span>
                <div style={{ width: 32, height: 1, background: "currentColor" }} />
                <Icon name="ArrowDown" size={16} />
              </button>
              <button onClick={() => scrollTo("timeline")}
                className="flex items-center gap-2 px-4 py-2 font-sans text-sm transition-all"
                style={{ border: "1px solid #C8B89A", color: "#6B5E54" }}>
                <Icon name="Clock" size={14} />
                Хронология событий
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ВВЕДЕНИЕ ── */}
      <section id="intro" className="py-24 transition-all duration-700"
        style={{ borderTop: "1px solid #C8B89A", opacity: vis("intro") ? 1 : 0, transform: vis("intro") ? "none" : "translateY(24px)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader number="I" title="Введение" subtitle="Предпосылки и контекст реформ" />

          <div className="grid md:grid-cols-3 gap-12 mt-12">
            <div className="md:col-span-2 space-y-6">
              <p className="font-sans leading-[1.9] drop-cap" style={{ fontSize: 17, color: "#2C2420" }}>
                Распад Советского Союза в декабре 1991 года поставил Россию перед беспрецедентной
                задачей — в кратчайшие сроки осуществить переход от плановой к рыночной экономике.
                Масштаб и скорость этих преобразований не имели аналогов в мировой истории.
              </p>
              <p className="font-sans leading-[1.9]" style={{ fontSize: 17, color: "#2C2420" }}>
                Правительство под руководством Е.Т. Гайдара избрало стратегию «шоковой терапии»,
                опираясь на рекомендации МВФ и западных экономических советников. Предполагалось,
                что быстрая либерализация приведёт к стремительному росту, минуя долгий
                переходный период. Реальность оказалась иной.
              </p>
              <p className="font-sans leading-[1.9]" style={{ fontSize: 17, color: "#2C2420" }}>
                За десятилетие реформ ВВП страны сократился почти вдвое. Реальные доходы населения
                упали до уровня, не виданного со времён послевоенного восстановления. Вместе с тем
                именно в этот период были заложены институциональные основы современной
                российской экономики — частная собственность, рыночное ценообразование,
                конкурентная среда.
              </p>

              {/* Rotating quotes */}
              <div style={{ background: "#EDE7D8", border: "1px solid #C8B89A", borderLeft: "3px solid #8B1A1A", padding: "20px 24px", minHeight: 120 }}>
                {quotes.map((q, i) => (
                  <div key={i} style={{ display: i === activeQuote ? "block" : "none", transition: "opacity 0.5s" }}>
                    <p className="font-serif italic text-base leading-relaxed mb-3" style={{ color: "#2C2420" }}>
                      «{q.text}»
                    </p>
                    <p className="font-mono text-xs" style={{ color: "#9A7B4F" }}>
                      — {q.author} ({q.year}), {q.source}
                    </p>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  {quotes.map((_, i) => (
                    <button key={i} onClick={() => setActiveQuote(i)}
                      style={{ width: 24, height: 3, background: i === activeQuote ? "#8B1A1A" : "#C8B89A", border: "none", cursor: "pointer", transition: "background 0.3s" }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div style={{ background: "#EDE7D8", border: "1px solid #C8B89A", padding: 20 }}>
                <h4 className="font-serif text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#8B1A1A" }}>
                  Ключевые даты
                </h4>
                {[
                  { date: "Дек. 1991", event: "Распад СССР" },
                  { date: "Янв. 1992", event: "Либерализация цен" },
                  { date: "Авг. 1992", event: "Ваучерная приватизация" },
                  { date: "Окт. 1993", event: "Конституционный кризис" },
                  { date: "Окт. 1994", event: "«Чёрный вторник»" },
                  { date: "Ноя. 1995", event: "Залоговые аукционы" },
                  { date: "Авг. 1998", event: "Дефолт по ГКО" },
                  { date: "Дек. 1999", event: "Отставка Ельцина" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 py-2" style={{ borderBottom: "1px solid rgba(200,184,154,0.4)" }}>
                    <span className="font-mono text-xs whitespace-nowrap" style={{ color: "#9A7B4F" }}>{item.date}</span>
                    <span className="font-sans text-xs" style={{ color: "#2C2420" }}>{item.event}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "#EDE7D8", border: "1px solid #C8B89A", padding: 20 }}>
                <h4 className="font-serif text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#8B1A1A" }}>
                  Контекст
                </h4>
                {[
                  { label: "ВВП СССР в 1991", value: "$1.0 трлн" },
                  { label: "Внешний долг России", value: "$105 млрд" },
                  { label: "Дефицит бюджета 1992", value: "≈30% ВВП" },
                  { label: "Денежный навес к 1992", value: "≈400 млрд ₽" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(200,184,154,0.4)" }}>
                    <span className="font-sans text-xs" style={{ color: "#6B5E54" }}>{item.label}</span>
                    <span className="font-mono text-xs font-medium" style={{ color: "#1C1714" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ТАЙМЛАЙН ── */}
      <section id="timeline" className="py-24 transition-all duration-700"
        style={{ background: "#1C1714", borderTop: "1px solid #3A2E28", opacity: vis("timeline") ? 1 : 0, transform: vis("timeline") ? "none" : "translateY(24px)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader number="II" title="Хронология событий" subtitle="Ключевые события 1991–2000 годов" light />

          <div className="mt-12 relative">
            {/* Horizontal line */}
            <div className="hidden md:block absolute left-0 right-0 top-8" style={{ height: 1, background: "#3A2E28" }} />

            {/* Year markers */}
            <div className="hidden md:flex justify-between mb-0 relative">
              {timelineEvents.map((ev, i) => (
                <button key={i}
                  onClick={() => setActiveTimelineYear(activeTimelineYear === i ? null : i)}
                  className="flex flex-col items-center gap-0 group"
                  style={{ flex: 1 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%",
                    background: activeTimelineYear === i ? ev.color : "#3A2E28",
                    border: `2px solid ${activeTimelineYear === i ? ev.color : "#6B5E54"}`,
                    transition: "all 0.3s", zIndex: 2, position: "relative",
                    transform: activeTimelineYear === i ? "scale(1.4)" : "scale(1)",
                  }} />
                  <span className="font-mono mt-2 transition-colors" style={{
                    fontSize: 10, color: activeTimelineYear === i ? "#F5F0E8" : "#6B5E54",
                    writingMode: "horizontal-tb",
                  }}>
                    {ev.year}
                  </span>
                </button>
              ))}
            </div>

            {/* Active card */}
            {activeTimelineYear !== null && (
              <div className="mt-6 animate-fade-in-up" style={{ background: "#2C2420", border: `1px solid ${timelineEvents[activeTimelineYear].color}`, padding: 24 }}>
                <div className="flex items-start gap-4">
                  <div style={{ width: 40, height: 40, background: timelineEvents[activeTimelineYear].color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={timelineEvents[activeTimelineYear].icon as "Flag"} size={18} style={{ color: "#F5F0E8" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-xs" style={{ color: "#9A7B4F" }}>{timelineEvents[activeTimelineYear].month} {timelineEvents[activeTimelineYear].year}</span>
                      <h3 className="font-serif text-xl font-bold" style={{ color: "#F5F0E8" }}>
                        {timelineEvents[activeTimelineYear].title}
                      </h3>
                    </div>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: "#C8B89A" }}>
                      {timelineEvents[activeTimelineYear].desc}
                    </p>
                  </div>
                  <button onClick={() => setActiveTimelineYear(null)} style={{ color: "#6B5E54", flexShrink: 0 }}>
                    <Icon name="X" size={16} />
                  </button>
                </div>
              </div>
            )}

            {!activeTimelineYear && activeTimelineYear !== 0 && (
              <p className="font-mono text-xs text-center mt-6" style={{ color: "#4A3C34" }}>
                ↑ Нажмите на точку, чтобы узнать подробности события
              </p>
            )}

            {/* Mobile: vertical list */}
            <div className="md:hidden mt-8 space-y-4">
              {timelineEvents.map((ev, i) => (
                <div key={i} style={{ borderLeft: `2px solid ${ev.color}`, paddingLeft: 16 }}>
                  <span className="font-mono text-xs" style={{ color: "#9A7B4F" }}>{ev.month} {ev.year}</span>
                  <h4 className="font-serif text-base font-bold mt-1" style={{ color: "#F5F0E8" }}>{ev.title}</h4>
                  <p className="font-sans text-xs mt-1 leading-relaxed" style={{ color: "#C8B89A" }}>{ev.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── РЕФОРМЫ ── */}
      <section id="reforms" className="py-24 transition-all duration-700"
        style={{ background: "#EDE7D8", borderTop: "1px solid #C8B89A", opacity: vis("reforms") ? 1 : 0, transform: vis("reforms") ? "none" : "translateY(24px)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader number="III" title="Рыночные реформы 1990-х годов" subtitle="Нажмите на карточку для подробного описания" />

          <div className="space-y-4 mt-12">
            {reformDetails.map((card, i) => {
              const isOpen = expandedReform === i;
              return (
                <div key={i} style={{ background: "#F5F0E8", border: "1px solid #C8B89A", overflow: "hidden", transition: "all 0.3s" }}>
                  <button className="w-full text-left" onClick={() => setExpandedReform(isOpen ? null : i)}>
                    <div className="flex items-center gap-5 p-6">
                      <span className="font-mono font-bold" style={{ fontSize: 28, color: "#C8B89A", minWidth: 48 }}>{card.num}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-serif text-xl font-bold" style={{ color: "#1C1714" }}>{card.title}</h3>
                          <span className="font-mono text-xs px-2 py-1" style={{ border: "1px solid #9A7B4F", color: "#9A7B4F" }}>{card.date}</span>
                        </div>
                        <p className="font-sans text-sm mt-1" style={{ color: "#6B5E54" }}>{card.summary}</p>
                      </div>
                      <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={20} style={{ color: "#9A7B4F", flexShrink: 0 }} />
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid #C8B89A", padding: "24px 24px 24px 80px" }} className="animate-fade-in-up">
                      <p className="font-sans leading-[1.85] mb-5" style={{ fontSize: 15, color: "#2C2420" }}>{card.details}</p>

                      <div className="citation mb-5">{card.cite}</div>

                      <div className="flex flex-wrap gap-4">
                        {card.stats.map((s, j) => (
                          <div key={j} style={{ background: "#EDE7D8", border: "1px solid #C8B89A", padding: "12px 16px" }}>
                            <div className="font-serif text-lg font-bold" style={{ color: "#8B1A1A" }}>{s.value}</div>
                            <div className="font-mono text-xs mt-0.5" style={{ color: "#9A7B4F" }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ПОСЛЕДСТВИЯ ── */}
      <section id="consequences" className="py-24 transition-all duration-700"
        style={{ borderTop: "1px solid #C8B89A", opacity: vis("consequences") ? 1 : 0, transform: vis("consequences") ? "none" : "translateY(24px)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader number="IV" title="Социально-экономические последствия" subtitle="Трансформация общества и экономики в 1991–2000 годах" />

          {/* Big numbers strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-12 mb-14" style={{ border: "1px solid #C8B89A" }}>
            {[
              { value: 50, suffix: "%", label: "Падение промышленного производства", color: "#8B1A1A" },
              { value: 57.6, suffix: " лет", label: "Средняя продолжительность жизни мужчин в 1994 г.", color: "#9A7B4F" },
              { value: 40, suffix: "%", label: "Доля теневой экономики в ВВП", color: "#4A5A6B" },
              { value: 34, suffix: "%", label: "Население за чертой бедности в 1992 г.", color: "#5C7A5C" },
            ].map((item, i) => (
              <div key={i} className="p-6 text-center" style={{ borderRight: i < 3 ? "1px solid #C8B89A" : "none", borderBottom: "1px solid #C8B89A" }}>
                <div className="font-serif text-3xl font-bold" style={{ color: item.color }}>
                  <AnimatedNumber target={item.value} suffix={item.suffix} />
                </div>
                <div className="font-sans text-xs mt-2 leading-snug" style={{ color: "#6B5E54" }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { color: "#8B1A1A", title: "Имущественное расслоение", icon: "ArrowUpDown",
                text: "Коэффициент Джини вырос с 0.26 (1991) до 0.40 (1994). Доля 10% богатейших граждан в доходах поднялась с 21% до 38%. Возник феномен «новых русских» на фоне массового обнищания." },
              { color: "#9A7B4F", title: "Демографический кризис", icon: "Users",
                text: "С 1992 по 1999 год смертность устойчиво превышала рождаемость. «Сверхсмертность» среди мужчин трудоспособного возраста выросла в 1.5 раза. Средняя продолжительность жизни мужчин упала до 57.6 лет в 1994 году." },
              { color: "#5C7A5C", title: "Деиндустриализация", icon: "Factory",
                text: "Промышленное производство сократилось почти вдвое. Особенно пострадали наукоёмкие отрасли, оборонный комплекс и лёгкая промышленность, не выдержавшие конкуренции с импортом при открытии границ." },
              { color: "#4A5A6B", title: "Утечка мозгов", icon: "GraduationCap",
                text: "За 1990-е годы Россию покинули от 500 000 до 800 000 квалифицированных специалистов — учёные, инженеры, программисты, врачи. Академическая наука потеряла треть сотрудников." },
              { color: "#8B1A1A", title: "Кризис банковской системы", icon: "Landmark",
                text: "После дефолта 1998 года прекратили работу более 200 банков. Вкладчики потеряли сбережения. Доверие населения к банковской системе не восстанавливалось несколько лет." },
              { color: "#6B5E54", title: "Неформальная экономика", icon: "Shuffle",
                text: "Распространились бартерные схемы, задержки заработной платы (в 1998 году задолженность составляла 77 млрд рублей), «конвертные» выплаты. Теневой сектор достигал 40–50% ВВП." },
            ].map((item, i) => (
              <div key={i} className="group" style={{ borderTop: `2px solid ${item.color}`, paddingTop: 20 }}>
                <div className="flex items-center gap-3 mb-3">
                  <Icon name={item.icon as "Users"} size={16} style={{ color: item.color }} />
                  <h4 className="font-serif text-lg font-bold" style={{ color: "#1C1714" }}>{item.title}</h4>
                </div>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "#6B5E54" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── СТАТИСТИКА ── */}
      <section id="statistics" className="py-24 transition-all duration-700"
        style={{ background: "#1C1714", borderTop: "1px solid #C8B89A", opacity: vis("statistics") ? 1 : 0, transform: vis("statistics") ? "none" : "translateY(24px)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader number="V" title="Статистика и данные периода" subtitle="Визуализация ключевых макроэкономических показателей 1990–2000 гг." light />

          {/* Chart tabs */}
          <div className="flex flex-wrap gap-2 mt-10 mb-6">
            {(Object.keys(chartConfigs) as Array<keyof typeof chartConfigs>).map((key) => (
              <button key={key} onClick={() => setActiveChart(key)}
                className="font-mono text-xs px-4 py-2 transition-all duration-200"
                style={{
                  background: activeChart === key ? chartConfigs[key].color : "transparent",
                  color: activeChart === key ? "#F5F0E8" : "#9A7B4F",
                  border: `1px solid ${activeChart === key ? chartConfigs[key].color : "#4A3C34"}`,
                }}>
                {chartConfigs[key].label}
              </button>
            ))}
          </div>

          {/* Main chart */}
          <div style={{ background: "#2C2420", border: `1px solid ${cc.color}`, padding: 24, marginBottom: 8 }}>
            <p className="font-mono text-xs mb-6" style={{ color: "#9A7B4F" }}>{cc.note}</p>
            <ResponsiveContainer width="100%" height={280}>
              {cc.type === "area" ? (
                <AreaChart data={cc.data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={cc.color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={cc.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#3A2E28" />
                  <XAxis dataKey="year" tick={{ fill: "#9A7B4F", fontSize: 11, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9A7B4F", fontSize: 11, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip suffix={cc.suffix} />} />
                  <Area type="monotone" dataKey={cc.key} stroke={cc.color} strokeWidth={2} fill="url(#chartGrad)" dot={{ fill: cc.color, r: 3 }} />
                </AreaChart>
              ) : cc.type === "bar" ? (
                <BarChart data={cc.data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#3A2E28" />
                  <XAxis dataKey="year" tick={{ fill: "#9A7B4F", fontSize: 11, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9A7B4F", fontSize: 11, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip suffix={cc.suffix} />} />
                  <Bar dataKey={cc.key} fill={cc.color} radius={[2, 2, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={cc.data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#3A2E28" />
                  <XAxis dataKey="year" tick={{ fill: "#9A7B4F", fontSize: 11, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9A7B4F", fontSize: 11, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip suffix={cc.suffix} />} />
                  <ReferenceLine x="1998" stroke="#8B1A1A" strokeDasharray="4 4" label={{ value: "Дефолт", fill: "#8B1A1A", fontSize: 10, fontFamily: "IBM Plex Mono" }} />
                  <Line type="monotone" dataKey={cc.key} stroke={cc.color} strokeWidth={2} dot={{ fill: cc.color, r: 3 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Small context cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { year: "1992", label: "Инфляция", value: "2608%", color: "#9A7B4F" },
              { year: "1994", label: "Падение ВВП", value: "−34%", color: "#8B1A1A" },
              { year: "1998", label: "Дефолт ГКО", value: "−40% руб.", color: "#8B1A1A" },
              { year: "2000", label: "Рост ВВП", value: "+10%", color: "#5C7A5C" },
            ].map((c, i) => (
              <div key={i} style={{ background: "#2C2420", border: "1px solid #3A2E28", padding: 16 }}>
                <span className="font-mono text-xs" style={{ color: "#6B5E54" }}>{c.year}</span>
                <div className="font-serif text-xl font-bold mt-1" style={{ color: c.color }}>{c.value}</div>
                <div className="font-mono text-xs mt-1" style={{ color: "#6B5E54" }}>{c.label}</div>
              </div>
            ))}
          </div>

          <p className="font-mono text-xs text-center mt-6" style={{ color: "#4A3C34" }}>
            * Данные основаны на публикациях Росстата, ЦБ РФ, МВФ и Всемирного банка. Некоторые показатели являются оценочными.
          </p>
        </div>
      </section>

      {/* ── БИБЛИОГРАФИЯ ── */}
      <section id="bibliography" className="py-24 transition-all duration-700"
        style={{ borderTop: "1px solid #C8B89A", opacity: vis("bibliography") ? 1 : 0, transform: vis("bibliography") ? "none" : "translateY(24px)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader number="VI" title="Библиография и научные источники" subtitle="Монографии, статьи и статистические сборники на русском языке" />

          <div className="grid md:grid-cols-2 gap-x-16 mt-12">
            {[
              { authors: "Гайдар, Е.Т.", year: "1996", title: "Дни поражений и побед", pub: "Вагриус, Москва", type: "Монография" },
              { authors: "Гайдар, Е.Т.", year: "2009", title: "Гибель империи. Уроки для современной России", pub: "РОССПЭН, Москва", type: "Монография" },
              { authors: "Ясин, Е.Г.", year: "2003", title: "Российская экономика: истоки и панорама рыночных реформ", pub: "ГУ ВШЭ, Москва", type: "Учебное пособие" },
              { authors: "Аслунд, А.", year: "1995", title: "Россия: рождение рыночной экономики", pub: "Республика, Москва", type: "Монография" },
              { authors: "Илларионов, А.Н.", year: "1996", title: "Попытки проведения политики финансовой стабилизации в СССР и России", pub: "Вопросы экономики, №7", type: "Статья" },
              { authors: "Авен, П.О., Кох, А.Р.", year: "2013", title: "Революция Гайдара: история реформ 90-х из первых рук", pub: "Альпина Паблишер, Москва", type: "Монография" },
              { authors: "Федоров, Б.Г.", year: "1999", title: "10 безумных лет: почему в России не состоялись реформы", pub: "Совершенно секретно, Москва", type: "Монография" },
              { authors: "Росстат", year: "1995–2001", title: "Российский статистический ежегодник", pub: "Росстат, Москва", type: "Статистический сборник" },
              { authors: "Центральный банк Российской Федерации", year: "1993–2001", title: "Годовой отчёт Банка России", pub: "ЦБ РФ, Москва", type: "Официальный документ" },
              { authors: "Мау, В.А.", year: "2010", title: "Драма 2008 года: от экономического чуда к экономическому кризису", pub: "Вопросы экономики, №2", type: "Статья" },
            ].map((ref, i) => (
              <div key={i} className="flex gap-4 py-4 group" style={{ borderBottom: "1px solid #E8E0CC" }}>
                <span className="font-mono text-xs mt-1" style={{ color: "#C8B89A", minWidth: 22 }}>{i + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-sans text-sm" style={{ color: "#2C2420" }}>
                      <span style={{ fontWeight: 500 }}>{ref.authors}</span>{" "}
                      <span style={{ color: "#9A7B4F" }}>({ref.year})</span>{" "}
                      <em>{ref.title}</em>
                    </p>
                    <span className="font-mono text-xs px-2 py-0.5 whitespace-nowrap shrink-0"
                      style={{ border: "1px solid #E8E0CC", color: "#9A7B4F" }}>
                      {ref.type}
                    </span>
                  </div>
                  <p className="font-mono text-xs mt-1" style={{ color: "#9A7B4F" }}>{ref.pub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #C8B89A", background: "#EDE7D8", padding: "48px 24px" }}>
        <div className="max-w-7xl mx-auto text-center">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, justifyContent: "center" }}>
            <div style={{ height: 1, flex: 1, maxWidth: 120, background: "linear-gradient(to right, transparent, #C8B89A)" }} />
            <span className="font-mono text-xs" style={{ color: "#9A7B4F", letterSpacing: "0.2em" }}>◆</span>
            <div style={{ height: 1, flex: 1, maxWidth: 120, background: "linear-gradient(to left, transparent, #C8B89A)" }} />
          </div>
          <p className="font-serif italic mb-2" style={{ color: "#6B5E54", fontSize: 15 }}>
            Рыночные реформы 1990-х годов в России: анализ причин, механизмов и последствий
          </p>
          <p className="font-mono text-xs mb-5" style={{ color: "#9A7B4F" }}>Академическое издание · 2024</p>
          <div className="flex justify-center gap-6 flex-wrap">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="font-mono text-xs transition-colors"
                style={{ color: "#9A7B4F" }}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
