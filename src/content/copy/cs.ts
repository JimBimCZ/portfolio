import type { Copy } from "./types";

/**
 * The Czech dictionary. Written as Czech rather than translated word for word:
 * the tagline, intro and project summaries carry the same argument as `en.ts`
 * in sentences a Czech engineer would actually write. Job titles, employers,
 * periods, stack and tool names, project titles and metric values stay in
 * English, the way Czech CVs and job listings keep them.
 */
export const cs = {
  locale: "cs",
  ui: {
    nav: { work: "Projekty", about: "O mně", contact: "Kontakt" },
    navLabel: "Hlavní navigace",
    privacy: "Soukromí",
    languageSwitch: { label: "Jazyk", en: "English", cs: "Čeština" },
    carousel: {
      region: "Nasazené aplikace",
      tablist: "Vyberte aplikaci",
      previous: "Předchozí aplikace",
      next: "Další aplikace",
      openLiveApp: "Otevřít aplikaci →",
      signInRequired: "Vyžaduje přihlášení",
    },
    status: {
      live: "V provozu",
      "in-development": "Ve vývoji",
      archived: "V archivu",
    },
  },
  person: {
    role: "Full-stack a AI vývojář",
    location: "Brno, ČR",
    locationWithTimezone: "Brno, ČR — SEČ",
    tagline: "Vyvíjím software, na který je spoleh — a díky AI nástrojům ho dodávám v řádu dnů, ne měsíců.",
    intro:
      "Typovaný a otestovaný kód, který prošel review — vzniká ve workflow s podporou AI, díky kterému se iterační cyklus zkrátí z týdnů na hodiny nebo dny.",
    status: "Otevřen novým projektům",
    ogImageAlt:
      "Terminál Trader: watchlist se streamovanými cenami, otevřená pozice AAPL a panel s asistentem.",
    /** Rendered as the spec block on the home and about pages. Keys stay short. */
    manifest: [
      ["role", "Full-stack a AI vývojář"],
      ["hloubka", "Senior na frontendu, backend až do produkce"],
      ["zaměření", "LLM funkce s typovaným a testovatelným výstupem"],
      ["stack", "TypeScript, Next.js, React, FastAPI, Postgres"],
      ["sídlo", "Brno, ČR — SEČ"],
      ["stav", "Otevřen novým projektům"],
    ],
    /** The about page reads these as paragraphs, in order. */
    bio: [
      "Full-stack vývojář, senior na frontendu, cestou přes zvuk a světla na živých akcích v britském hudebním průmyslu. Je to netradiční cesta k téhle práci, ale zůstaly mi po ní dva návyky, které si stojí za to udržet: technická přesnost a komunikace, jakou si člověk osvojí v partě, kde musí všechno klapnout dřív, než do sálu pustí diváky.",
      "Běžnou náplní dne je React a TypeScript na seniorní úrovni — funkce, které vznikají a dál se udržují v kódu, se kterým musí žít i ostatní, stav řešený přes Redux a React Context a produkční problémy dohledané v CloudWatch logách a v SQL, ne odhadované.",
      "Aplikace v přehledu práce jsou sólo projekty od začátku do konce — schémata a migrace v Postgresu přes Drizzle, služby ve FastAPI, přihlášení přes OAuth a správa sessions, naplánované úlohy a k tomu Docker image a CI, které to všechno nasazují. Seniorita na frontendu je z běžné práce, zbytek stacku z toho, že tohle musím postavit a provozovat sám.",
      "Druhá polovina je agentic AI: workflow postavená kolem LLM, vlastní MCP servery a multiagentní systémy vyladěné tak, aby byly spolehlivé a zároveň dost levné na to, aby se daly reálně provozovat. Nejlíp mi to jde v úzké spolupráci s ostatními — dodávat řešení, které sedne na potřebu klienta, v termínu, na kterém jsme se domluvili.",
    ],
    /** Newest first. The about page renders this as a log. */
    experience: [
      {
        title: "Frontend Developer",
        org: "Three Pillar Global",
        period: "10/2025 – 05/2026",
        note: "Seniorní záskok za dlouhodobou nepřítomnost. Vývoj a údržba funkcí v React/TypeScript kódové bázi s Reduxem a React Contextem, dohledávání produkčních problémů přes AWS CloudWatch a dBeaver a nasazení agentic coding nástrojů na zrychlení dodávek, refaktoringu a ladění v zavedeném kódu.",
      },
      {
        title: "Team Leader / Frontend Developer",
        org: "Notino",
        period: "03/2023 – 09/2025",
        note: "Vedení frontend týmu s dvojím zadáním: lidé a technická dodávka. Úzká spolupráce s product ownerem na dodržení termínů a řízení frontend strategie napříč clusterem — odbourávání technického dluhu a nasazování správných lidí na správné úkoly.",
      },
      {
        title: "Frontend Developer",
        org: "Kinalisoft",
        period: "09/2020 – 02/2023",
        note: "Jediný frontend vývojář na celém FE platformy pro monitoring strojů, kterou jsme dělali pro Mycronic. Dodal jsem MyCenterAnalysis, které získalo ocenění na veletrhu Productronica.",
      },
      {
        title: "Frontend Developer",
        org: "Axon Garside, Manchester UK",
        period: "01/2019 – 03/2020",
        note: "Práce po boku interního full-stack vývojáře na precizně odvedeném frontendu — single-page aplikace především v Reactu, k tomu čistý JavaScript, HTML5 a CSS3.",
      },
    ],
    /** Grouped for the about page. Keys stay short, same as the manifest. */
    toolkit: [
      [
        "frontend",
        "TypeScript, React 16–19, Next.js, Redux, React Context, Tailwind CSS, Material UI",
      ],
      [
        "backend",
        "Node.js / Express, FastAPI, REST a SSE, OAuth sessions, naplánované úlohy",
      ],
      [
        "data",
        "Postgres, SQLite, Drizzle ORM, návrh schématu a migrace, fulltext přes pg_trgm",
      ],
      [
        "agentic ai",
        "Agentic coding, návrh MCP serverů, orchestrace více agentů, optimalizace nákladů agentů, LLM evals, prompt engineering",
      ],
      ["testování", "Jest, React Testing Library, Playwright, AWS CloudWatch, SQL / dBeaver, Git"],
      ["infrastruktura", "Docker, Vercel, CI/CD"],
      ["jazyky", "Čeština — rodilý mluvčí, angličtina — plynule"],
    ],
    /**
     * The privacy notice. Content lives here like everything else, so the page
     * holds no copy of its own. `updated` is an ISO year-month, same as
     * `shipped` on a project. Change it whenever a row or section below changes.
     */
    privacy: {
      updated: "2026-09",
      summary: [
        ["cookies", "Žádné se nenastavují ani nečtou"],
        ["analytika", "Žádná, ani jeden sledovací skript"],
        ["fonty", "Hostované u mě, na Google nejde žádný požadavek"],
        ["formuláře", "Žádné, kontakt je odkaz mailto"],
      ],
      sections: [
        {
          heading: "Proč tu není cookie lišta",
          body:
            "Souhlas je potřeba pro ukládání nebo čtení informací ve vašem zařízení. Tenhle web nedělá ani jedno: žádné cookies, žádné local storage, žádný vložený obsah třetích stran, žádná analytika. Není tedy nic, s čím byste museli souhlasit. Obě písma se stáhnou při sestavení webu a načítají se z této domény, takže tím, že si tu otevřete stránku, se Google nedozví nic.",
        },
        {
          heading: "Co zaznamenává server",
          body:
            "Web běží na Vercelu, který si každý požadavek loguje tak, jak to dělá každý webový server: IP adresa, vyžádaná stránka, časové razítko a identifikace prohlížeče (user agent). Vercel tyto logy drží jako můj zpracovatel, podle vlastních pravidel pro dobu uchování, a slouží k tomu, aby se stránky doručily a platforma běžela. Neexportuji je, nespojuji je s ničím dalším a nepoužívám je k tomu, abych zjišťoval, kdo jste.",
        },
        {
          heading: "Když mi napíšete",
          body:
            "Pak mám to, co jste se rozhodli poslat, ve své poštovní schránce po dobu, po kterou je konverzace k něčemu — u pozice nebo projektu obvykle po dobu, po kterou trvají, a rozumnou chvíli po nich. Není tu žádný mailing list, do kterého byste se mohli dostat.",
        },
        {
          heading: "Vaše práva",
          body:
            "Můžete se zeptat, co o vás mám, požádat o opravu nebo výmaz a proti tomu, že to vůbec mám, vznést námitku. Napište na adresu výše a já odpovím. Pokud vás moje odpověď neuspokojí, můžete si stěžovat u dozorového úřadu, kterým je Úřad pro ochranu osobních údajů, na uoou.gov.cz.",
        },
      ],
    },
  },
  pages: {
    home: {
      viewWork: "Zobrazit projekty",
      getInTouch: "Ozvěte se",
      whatEachOneIs: "Co která aplikace doopravdy dělá",
      allProjects: "Všechny projekty →",
      trackRecord: "Co mám za sebou",
      fullHistory: "Celá historie →",
      skills: "Dovednosti, ke každé důkaz",
      contact: "Kontakt",
    },
    work: {
      title: "Na čem jsem naposledy dělal",
      lede: "Od nejnovějšího. U každé položky stojí, co jsem nasadil, kdy a co to změnilo.",
      more: "Další se chystá",
      liveDemo: "Živé demo",
      repo: "GitHub",
      // A colon, unlike the English "Shipped August 2026": `formatShipped`
      // returns a nominative month, and Czech would need a locative ("v
      // srpnu") to read as a sentence. Label and value sidestep the case.
      shipped: "Nasazeno:",
    },
    project: {
      back: "← Projekty",
      role: "Role",
      stack: "Stack",
      whatItBrings: "Co to přináší",
      visitSite: "Otevřít web",
      source: "Zdrojový kód",
    },
    about: {
      title: "O mně",
      experience: "Praxe",
      toolkit: "Nástroje",
    },
    contact: {
      title: "Nejrychleji mě zastihnete e-mailem.",
      body: "Napište mi, co stavíte a co vás brzdí. Čtu všechno a odpovídám do pár dnů.",
      phone: "telefon",
      based: "sídlo",
    },
    privacy: {
      title: "Ochrana osobních údajů",
      lede: "Tohle je portfolio, ne produkt. Nesbírá o vás nic a krátká verze se vejde do jednoho rámečku.",
      responsible: "Správce",
      contact: "Kontakt",
      // Label and value, for the same reason as `work.shipped` above.
      updated: "Naposledy upraveno:",
    },
    notFound: {
      code: "404",
      title: "Taková stránka neexistuje.",
      back: "← Zpět na úvod",
    },
  },
  meta: {
    titleTemplate: "%s — Vit Busek",
    home: {
      title: "Vit Busek — Full-stack a AI vývojář",
      description:
        "Typovaný a otestovaný kód, který prošel review — vzniká ve workflow s podporou AI, díky kterému se iterační cyklus zkrátí z týdnů na hodiny nebo dny.",
    },
    work: {
      title: "Projekty",
      description: "Projekty od nejnovějšího, s tím, co jsem nasadil a co to změnilo.",
    },
    about: {
      title: "O mně",
      description:
        "Full-stack vývojář, senior na frontendu, cestou přes zvuk a světla na živých akcích v britském hudebním průmyslu. Je to netradiční cesta k téhle práci, ale zůstaly mi po ní dva návyky, které si stojí za to udržet: technická přesnost a komunikace, jakou si člověk osvojí v partě, kde musí všechno klapnout dřív, než do sálu pustí diváky.",
    },
    contact: {
      title: "Kontakt",
      description: "Vit Busek — kontakt e-mailem nebo telefonem.",
    },
    privacy: {
      title: "Ochrana osobních údajů",
      description:
        "Co si tenhle web zaznamenává, což je skoro nic: žádné cookies, žádná analytika, žádné sledovací skripty.",
    },
  },
  architecture: {
    heading: "Technický návrh",
    diagramLabel: "Diagram architektury",
    bands: {
      client: "Klient",
      server: "Server",
      data: "Data",
      external: "Externí služby",
    },
  },
  projects: {
    trader: {
      summary:
        "Obchodní terminál s vymyšlenými penězi: ceny přitékají dvakrát za sekundu a asistent si umí přečíst vaše portfolio a zadat obchody za vás.",
      role: "Sólo projekt — frontend, backend, infrastruktura",
      highlights: [
        "Asistent zadává obchody přes stejné API jako samotné UI a každé plnění ukazuje rovnou v konverzaci. Živé demo odpovídá ze skriptovaného klienta, ne z modelu, takže jeho provoz nic nestojí.",
        "Jedna kódová báze, dva tvary nasazení. Serverless nemá úlohu běžící na pozadí ani disk, takže se z ceny stává funkce času v uzavřeném tvaru — Brownův pohyb Lévyho konstrukcí, 22 kroků hashovaným stromem místo 172 800 sečtených půlsekundových přírůstků — a Postgres sedí za stejným rozhraním jako SQLite. Routy, služby ani frontend se nemění.",
        "Tržní data jdou ve výchozím stavu ze simulátoru geometrického Brownova pohybu — volatilita zvlášť pro každý ticker, korelované pohyby sektorů, žádný API klíč. Reálné kurzy se musí zapnout a mezi oběma režimy záměrně není žádný tichý fallback.",
        "846 testů napříč stackem: 591 na backendu, 228 na frontendu a k tomu 27 Playwright testů proti sestavenému kontejneru.",
      ],
      metricLabels: ["streamované ceny", "testů napříč stackem", "ceny v uzavřeném tvaru"],
      posterAlt:
        "Terminál Trader po nákupu pěti akcií AAPL: vlevo watchlist s deseti tickery, uprostřed graf ceny AAPL nad otevřenou pozicí a graf zisku a ztráty za relaci, vpravo návrhy promptů pro asistenta.",
      liveNote:
        "Demo běží v serverless variantě bez připojené databáze, takže portfolio startuje na 10 000 $ a resetuje se pokaždé, když se instance recykluje.",
    },
    "games-db": {
      summary:
        "Osobní katalog PC her, který si celý obchod Steamu zaindexuje do Postgresu, takže procházení, filtrování ani vyhledávání rate-limitované API Steamu vůbec nepotřebují.",
      role: "Sólo projekt — frontend, backend, infrastruktura",
      highlights: [
        "Vlastní index katalogu Steamu — 245 025 appidů, 14 621 z nich načtených do plného detailu — protože Steam žádný endpoint /discover ani /trending k procházení nemá.",
        "Vyhledávání běží nad trigramovým indexem v Postgresu (pg_trgm), ne nad Steamem.",
        "Jedna plánovaná úloha — měsíční cron v GitHub Actions obnovuje ceny — a k tomu tři CLI úlohy (synchronizace katalogu, synchronizace seznamů, načtení detailů) spouštěné ručně. Načtení detailů, obnova cen i synchronizace seznamů si berou advisory lock v Postgresu, aby neběžely dvě kopie naráz; synchronizace katalogu ho nepotřebuje.",
        "Přihlášení přes GitHub OAuth kvůli osobní knihovně; procházení a vyhledávání funguje komukoli, přihlášenému i nepřihlášenému.",
      ],
      metricLabels: ["zaindexovaných appidů", "s načteným detailem", "trigramové vyhledávání"],
      posterAlt:
        "Úvodní stránka Games DB: banner s vybranou hrou nad mřížkou Top Sellers s obaly her, cenami a slevovými štítky.",
    },
    "my-movies": {
      summary:
        "Osobní katalog filmů a seriálů z TMDB v prohlížecím UI ve stylu Netflixu — s vyhledáváním, na jehož výsledky jde poslat odkaz, a watchlistem za přihlášením.",
      role: "Sólo projekt — frontend, backend, infrastruktura",
      highlights: [
        "Devět řad k procházení na úvodní stránce — trending, právě v kinech, připravované, nejlépe hodnocené, dnes vysílané a čtyři žánrové — každá streamovaná přes Suspense.",
        "Vyhledávání je řízené adresou: dotaz žije v URL, takže na výsledky jde poslat odkaz a tlačítko zpět funguje.",
        "Endpoint /api/revalidate na požádání zneplatní cache odpovědí z TMDB podle tagu, místo aby se čekalo na vypršení TTL.",
        "Přihlášení přes GitHub a Google OAuth kvůli osobnímu watchlistu; procházení, detaily i vyhledávání fungují bez účtu.",
      ],
      metricLabels: ["řad k procházení", "invalidace cache", "vyhledávání žije v URL"],
      posterAlt:
        "Úvodní stránka My Movies: přes celou šířku hero s právě populárním titulem, jeho anotací a tlačítkem More Info, pod ním řada Trending This Week s náhledy plakátů.",
    },
    legal: {
      summary:
        "Právní smlouva sepsaná konverzací. Vyberete jednu z 11 šablon Common Paper, odpovídáte běžnou řečí a dokument se plní před očima.",
      role: "Sólo projekt — frontend, backend, infrastruktura",
      highlights: [
        "Odpověď modelu se validuje proti Pydantic schématu vygenerovanému z polí konkrétní šablony, takže z jednoho kola můžou přijít jen validní typované hodnoty.",
        "Kolo se uloží až po úspěšném volání modelu — neúspěšný požadavek po sobě nic nenechá a jde ho bezpečně zopakovat.",
        "161 testů napříč stackem: 86 na backendu, 75 na frontendu.",
        "Jeden kontejner, jeden origin. Vícefázový build zkompiluje export Next.js a FastAPI ho servíruje, takže není potřeba nastavovat žádnou CORS vrstvu.",
      ],
      metricLabels: ["šablon Common Paper", "testů napříč stackem"],
      posterAlt:
        "Hotová Mutual NDA v Legal Document Creatoru: všechna pole vyplněná a dokument připravený ke stažení, vedle něj panel konverzace s detaily, ze kterých vznikl.",
    },
    "work-planner": {
      summary:
        "Sdílená kanbanová nástěnka ve stylu JIRA: víc nástěnek na uživatele, drag and drop ovladatelný klávesnicí, termíny a přihlášení jen přes OAuth.",
      role: "Sólo projekt — frontend, backend, infrastruktura",
      highlights: [
        "Nástěnky, sloupce a karty stojí na skutečném schématu v Postgresu — dávno za kostrou s health routou, kterou README pořád popisuje.",
        "Přetahování mezi sloupci ovladatelné klávesnicí, postavené na dnd-kit.",
        "Ke každé nástěnce se dá dostat jen přes přihlášení OAuth (Google a GitHub); hostovský ani demo účet neexistuje.",
        "291 testů napříč stackem: 211 unit a komponentových, 80 end-to-end v Playwrightu.",
      ],
      metricLabels: ["Drizzle + Neon", "testů napříč stackem"],
      posterAlt:
        "Přihlašovací obrazovka Work Planneru: název aplikace nad tlačítky Continue with Google a Continue with GitHub, žádný hostovský ani demo účet.",
    },
  },
  skills: {
    "databases-and-data": {
      title: "Databáze a data",
      skills: {
        postgres: { name: "Postgres", detail: "schéma, indexy, migrace" },
        drizzle: { name: "Drizzle ORM", detail: "typované schéma, generované migrace" },
        "full-text-search": { name: "Fulltextové vyhledávání", detail: "trigramový index pg_trgm" },
        "data-pipelines": {
          name: "Datové pipeliny",
          detail: "backfill, retry s backoffem, dávkové upserty",
        },
      },
    },
    "backend-and-integrations": {
      title: "Backend a integrace",
      skills: {
        fastapi: { name: "FastAPI", detail: "typované routy, servisní vrstva" },
        "third-party-apis": {
          name: "API třetích stran",
          detail: "Steam, TMDB, OpenRouter",
        },
        "scheduled-jobs": {
          name: "Plánované úlohy",
          detail: "měsíční cron, fronty jištěné advisory lockem, rozdělaná práce přežije pád",
        },
        auth: { name: "Auth", detail: "přihlášení přes OAuth a session" },
        caching: {
          name: "Cache",
          detail: "invalidace podle tagů s endpointem pro okamžité vyprázdnění",
        },
      },
    },
    frontend: {
      title: "Frontend",
      skills: {
        "react-and-nextjs": {
          name: "React a Next.js",
          detail: "App Router, server komponenty jako výchozí",
        },
        "streaming-ui": {
          name: "Streamované UI",
          detail: "server-sent events, živé ceny",
        },
        "drag-and-drop": {
          name: "Drag and drop",
          detail: "ovladatelné klávesnicí, správné ARIA role",
        },
        "design-systems": {
          name: "Design systémy",
          detail: "Tailwind v4, sémantické tokeny, žádné dark: varianty",
        },
      },
    },
    delivery: {
      title: "Dodávka",
      skills: {
        testing: {
          name: "Testování",
          detail: "unit, integrační a end-to-end v Playwrightu",
        },
        docker: {
          name: "Docker",
          detail: "vícefázové buildy, jeden origin, žádná CORS vrstva",
        },
        "ci-cd": {
          name: "CI/CD",
          detail: "typecheck, lint a obě sady testů u každého pull requestu",
        },
      },
    },
  },
} satisfies Copy;
