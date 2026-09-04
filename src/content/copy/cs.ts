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
      openSource: "Zdrojový kód na GitHubu →",
      signInRequired: "Vyžaduje přihlášení",
    },
    status: {
      live: "V provozu",
      "in-development": "Ve vývoji",
      "self-hosted": "Vlastní nasazení",
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
      "Běžnou náplní dne jsou React a TypeScript na seniorní úrovni — funkce, které vznikají a dál se udržují v kódu, se kterým musí žít i ostatní, stav řešený přes Redux a React Context a produkční problémy dohledané v CloudWatch logách a v SQL, ne odhadované.",
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
    "secure-llm": {
      summary:
        "Znalostní báze, které se dá ptát. Každá odpověď ukazuje zpátky na dokument, ze kterého pochází, a když na otázku vaše vlastní poznámky neodpovídají, aplikace to řekne, místo aby si vymýšlela.",
      role: "Sólo projekt — retrieval, ochrana údajů, identita, infrastruktura",
      highlights: [
        "Tři vyhledávací větve — vektorová, identifikátorová a BM25 nad prózou — spojené přes reciprocal rank fusion. Obě lexikální větve vznikly proto, že embedder měřitelně odmítl otázku, na kterou korpus odpověď má: „What are PL1 and PL2 set to?“ dostalo skóre 0,054 proti prahu 0,25, a to u dokumentu, který měla aplikace zaindexovaný.",
        "Citace odcházejí dřív než samotný text odpovědi. Model je v JSONu vrací jako první, pole se ověří v okamžiku, kdy se uzavře, a první slovo odpovědi jde ven až po kontrole zdroje — zamítnutá odpověď se tak odmítne ve chvíli, kdy na obrazovce pořád svítí kontrola zdrojů, místo aby se čtenáři brala zpátky, až si ji přečte.",
        "Jména, e-maily a telefonní čísla se ještě před odesláním nahradí zástupnými značkami a cestou zpátky se vrátí na místo. Embedder běží přímo v procesu, takže jediné, co vůbec překročí hranici sítě, je anonymizované volání modelu.",
        "Čtyři poskytovatelé odpovědí za jedním rozhraním — a není to jen tvrzení: stejný kód odpověděl přes OpenRouter na modelu od OpenAI a přes Anthropic SDK — jiná firma, jiný účet, jiný namespace modelů — beze změny promptu, kontroly citací, anonymizace i auditního záznamu.",
      ],
      metricLabels: [
        "testů, bez testovacího frameworku",
        "vyhledávací větve, spojené podle pořadí",
        "poskytovatelé odpovědí za jedním rozhraním",
      ],
      design: {
        notes: {
          embedders: "Přímo v procesu. Žádný text se kvůli embeddingu nikam neposílá.",
          providers: "Čtyři implementace: anthropic, openrouter, gateway, mock.",
          pgvector: "384 dimenzí, kosinová vzdálenost.",
          tsvector: "Generované sloupce: simple pro identifikátory, english pro prózu.",
          keycloak: "Realm je součástí compose souboru.",
        },
        pipelineTitle: "Jak se z otázky stane odpověď",
        steps: {
          route:
            "O tom, čí dokumenty se prohledávají, rozhoduje session — tělo requestu uživatele pojmenovat nemůže. Tady se kontrolují i oba stropy útraty, uživatelský i společný pro celé nasazení, ještě než cokoli začne stát peníze.",
          retrieve:
            "Otázka se zaembedduje přímo v procesu a pak běží tři hledání: vektorová podobnost, přesná shoda identifikátoru, pokud otázka obsahuje něco ve tvaru čísla dílu, a BM25 nad prózou. Každá větev si filtr na vlastníka a na model embeddingu opakuje ve vlastním SQL, místo aby spoléhala na tu vedlejší.",
          fuse:
            "Fúze jenom řadí — každý seznam přichází už odfiltrovaný, takže prázdný výsledek zůstane prázdný. Když se nenajde nic, request končí právě tady, hláškou „Not found in your knowledge base.“ a bez jediného volání modelu.",
          anonymize:
            "Jedna instance anonymizéru na request nahradí osoby, e-maily a telefonní čísla v otázce i v každém nalezeném úryvku. Obojí dělá ta samá instance, takže otázka na konkrétního člověka pořád sedne na poznámku o něm.",
          envelope:
            "Otázka i zdroje cestují uvnitř značek, které píše aplikace, a první pravidlo systémového promptu říká, že všechno uvnitř nich jsou data. Text, který vypadá jako jedna z těch značek, se escapuje, ne odstraní — věta, která to zkusila, je pořád obsahem poznámky.",
          call:
            "Jediné místo, kde text opouští proces. Vynucuje timeout a zapisuje auditní řádek — model, časy, počty tokenů, výsledek — a nikdy ne obsah.",
          citations:
            "Každé citované číslo musí ukazovat do sady, která se skutečně odeslala. Citace je pozice, ne id, takže model žádné existující vymyslet nemůže. Když neprojde ani jedna, následuje jeden přísnější pokus a pak se odpověď odmítne.",
          restore:
            "Ze zástupných značek se cestou ke čtenáři zase stanou skutečná jména. Mapování, které to umí, žije v rámci requestu a spolu s ním zaniká — nikdy se neukládá ani neloguje.",
        },
        decisions: [
          {
            choice: "Citace dřív než text, přímo ve formátu přenosu.",
            because:
              "V NDJSON streamu nikdy nepřijde delta před citations, takže ani klient, který by ignoroval všechna ostatní pravidla, nedokáže vykreslit text bez zdroje. Zisk na latenci je malý — čas do prvního tokenu je 84–94 % celého volání — a přesně o to jde: streamovat nejdřív text by vypadalo mnohem líp a ukazovalo by věty, které žádná kontrola neschválila.",
          },
          {
            choice: "Dva seamy, ne jeden.",
            because:
              "Anthropic embeddings endpoint nemá, takže jedno společné rozhraní pro poskytovatele by soubor pojmenovaný po nich nemohl implementovat. Odpovídání a embedding jsou oddělená rozhraní a embedder ve výchozím nastavení běží uvnitř kontejneru — díky tomu se indexovaný text do sítě vůbec nedostane.",
          },
          {
            choice: "Tři vyhledávací větve místo nižšího prahu skóre.",
            because:
              "Práh, který se snižuje tak dlouho, dokud chyby nezmizí, je práh nastavený od oka — a odmítnutí je to jediné, co na tom stát nesmí. Identifikátorová větev hledá každý výraz jako frázi a prózová se pouští podle pokrytí IDF a dvou shodných výrazů, takže větev buď má důkaz, nebo neběží.",
          },
        ],
      },
      posterAlt:
        "Obrazovka Ask s odpovědí na dotaz na dimenzování zdroje: odpověď se dopočítá od 142 W u procesoru a 320 W u grafiky k 850W zdroji a pod ní jsou tři citované zdroje, každý s odkazem na jiný dokument ve znalostní bázi.",
    },
    trader: {
      summary:
        "Obchodní terminál s vymyšlenými penězi: ceny přitékají dvakrát za sekundu a asistent si umí přečíst vaše portfolio a zadat obchody za vás.",
      role: "Sólo projekt — frontend, backend, infrastruktura",
      highlights: [
        "Asistent zadává obchody přes stejné API jako samotné UI a každé plnění ukazuje rovnou v konverzaci. Živé demo odpovídá ze skriptovaného klienta, ne z modelu, takže jeho provoz nic nestojí.",
        "Jedna kódová báze, dva tvary nasazení. Serverless nemá úlohu běžící na pozadí, takže se z ceny stává funkce času v uzavřeném tvaru — Brownův pohyb Lévyho konstrukcí, 22 kroků hashovaným stromem místo 172 800 sečtených půlsekundových přírůstků — a mezi ní a simulátorem se rozhoduje na jediném místě při startu. Routy, služby ani frontend se nemění.",
        "Tržní data jdou ve výchozím stavu ze simulátoru geometrického Brownova pohybu — volatilita zvlášť pro každý ticker, korelované pohyby sektorů, žádný API klíč. Reálné kurzy se musí zapnout a mezi oběma režimy záměrně není žádný tichý fallback.",
        "846 testů napříč stackem: 591 na backendu, 228 na frontendu a k tomu 27 Playwright testů proti sestavenému kontejneru.",
      ],
      metricLabels: ["streamované ceny", "testů napříč stackem", "ceny v uzavřeném tvaru"],
      design: {
        notes: {
          fastapi: "Jedna serverless funkce, api/index.py.",
          market: "Deterministické ceny, dva ticky za sekundu.",
          postgres: "Přes asyncpg.",
          openrouter: "Jen v kontejnerovém buildu.",
        },
        decisions: [
          {
            choice: "Jedna aplikace ve FastAPI, dvě nasazení.",
            because:
              "Kontejnerový build simuluje ceny přes numpy a odpovídá skutečným modelem; funkce na Vercelu je počítá uzavřeným vzorcem a běží s LLM_MOCK=true. Obě varianty mluví se stejným Postgresem a routy jsou stejné, takže frontend nepozná, ke které z nich se dostal.",
          },
          {
            choice: "SSE, ne WebSockety.",
            because:
              "Ceny tečou jen jedním směrem. STREAM_MAX_SECONDS je 55, takže se stream vejde do šedesátisekundového limitu funkce na Vercelu.",
          },
          {
            choice: "Frontend je statický export na CDN.",
            because:
              "Jediné, co vercel.json přepisuje na funkci v Pythonu, jsou cesty /api/*, takže vykreslení stránky nikdy neprochází funkcí.",
          },
        ],
      },
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
      design: {
        notes: {
          modules: "Katalog, procházení, detail, knihovna, účet.",
          steam: "Vlastní rate limiter a TTL cache.",
          drizzle: "Čtyři zaverzované migrace.",
          trgm: "Nad game.name.",
        },
        decisions: [
          {
            choice: "Vyhledávání běží na Postgresu, ne na vyhledávací službě.",
            because:
              "Jeden GIN index pg_trgm nad game.name pokrývá 245 025 řádků. Není co synchronizovat a není třeba platit druhé úložiště.",
          },
          {
            choice: "Migrace se generují a verzují.",
            because:
              "V db/migrations leží všechny čtyři SQL soubory a rozšíření pg_trgm zakládá migrace 0003 — ne ruční krok, který si někdo musí u nové databáze pamatovat.",
          },
          {
            choice: "Klient Steamu si nese vlastní rate limiter a cache.",
            because:
              "Vykreslení stránky se nemůže rozpadnout do neomezeného počtu volání na Steam Web API, ať si stránka řekne o cokoli.",
          },
        ],
      },
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
      design: {
        notes: {
          tmdb: "Typovaný klient, cache tagy podle endpointu.",
          auth: "Auth.js s adaptérem pro Drizzle.",
          watchlist: "Server Actions.",
        },
        decisions: [
          {
            choice: "Odpovědi z TMDB se cachují podle tagů v datové cache Nextu.",
            because:
              "Okna sahají od jednoho dne pro konfiguraci po pět minut pro vyhledávání, takže stránka s procházením žádné další volání na TMDB nespustí.",
          },
          {
            choice: "Relace leží ve stejném Postgresu jako watchlist.",
            because:
              "Jedna databáze a jedna historie migrací, přes adaptér Auth.js pro Drizzle.",
          },
        ],
      },
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
      design: {
        notes: {
          pdf: "PDF se sestavuje v prohlížeči.",
          fastapi: "Routy: auth, documents, chat, saved, demo.",
          templates: "Indexované přes catalog.json.",
        },
        decisions: [
          {
            choice: "Šablony jsou markdownové soubory v repozitáři.",
            because:
              "Indexuje je catalog.json, takže není potřeba CMS ani řádky s obsahem v databázi — změna šablony přijde jako diff, který jde zrevidovat.",
          },
          {
            choice: "PDF se vykresluje v prohlížeči.",
            because:
              "Server žádný dokument negeneruje, takže žádný požadavek nedrží otevřený vykreslovací proces.",
          },
        ],
      },
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
      design: {
        notes: {
          actions: "lib/actions — celá zapisovací plocha.",
          proxy: "Nepřihlášené požadavky na /boards/* posílá na přihlášení.",
          s3: "Dostupné přes předpodepsané URL.",
        },
        decisions: [
          {
            choice: "Zápisy jdou přes Server Actions, ne přes route handlery.",
            because:
              "V app/api zůstalo jen přihlášení, autorizace Pusheru, přesměrování příloh a health; všechno ostatní leží v lib/actions vedle svých testů.",
          },
          {
            choice: "Karty nesou zlomkové pořadí.",
            because:
              "Přetažení karty zapíše jeden řádek místo přečíslování celého sloupce, do kterého karta spadla.",
          },
          {
            choice: "Přílohy jdou rovnou do S3 přes předpodepsané URL.",
            because:
              "Bajty souboru nikdy neprocházejí aplikací, takže se nahrávání nezadrhne o limity požadavku ve funkci.",
          },
        ],
      },
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
        "full-text-search": {
          name: "Fulltextové vyhledávání",
          detail: "trigramy pg_trgm a generované tsvector sloupce indexované dvakrát — simple na identifikátory, english na běžný text",
        },
        "background-work": {
          name: "Práce na pozadí",
          detail: "měsíční cron, fronty jištěné advisory lockem, backfill s retry a backoffem, rozdělaná práce přežije pád",
        },
      },
    },
    "ai-and-retrieval": {
      title: "AI a vyhledávání",
      skills: {
        rag: {
          name: "Generování opřené o vyhledávání",
          detail: "tři větve — vektorová, identifikátorová a BM25 nad textem — spojené reciprocal rank fusion; když se nic nenajde, otázku odmítne, místo aby si odpověď domyslel",
        },
        "vector-search": {
          name: "Vektorové vyhledávání",
          detail: "pgvector s HNSW indexem na kosinovou vzdálenost nad 384rozměrnými embeddingy počítanými v procesu, takže indexovaný text nikdy neopustí kontejner",
        },
        "llm-integration": {
          name: "Integrace LLM",
          detail: "čtyři poskytovatelé odpovědí za jedním rozhraním, se stropem útraty na uživatele i na celé nasazení kontrolovaným dřív, než hovor může něco stát",
        },
        "prompt-security": {
          name: "Obrana proti prompt injection",
          detail: "nalezený text cestuje uvnitř značek, které píše aplikace, cokoli tvaru značky se escapuje místo mazání a citace se ověří dřív, než odteče první slovo odpovědi",
        },
        "pii-anonymisation": {
          name: "Anonymizace osobních údajů",
          detail: "jména, e-maily a telefonní čísla se změní v zástupné značky dřív, než cokoli překročí hranici sítě; mapa zpátky žije v požadavku a s ním i zaniká",
        },
      },
    },
    "backend-and-integrations": {
      title: "Backend a integrace",
      skills: {
        fastapi: { name: "FastAPI", detail: "typované routy, servisní vrstva" },
        "third-party-apis": {
          name: "API třetích stran",
          detail: "Steam, TMDB, OpenRouter, s invalidací cache podle tagů a endpointem pro okamžité vyprázdnění",
        },
        auth: {
          name: "Auth",
          detail: "přihlášení přes OAuth a session, a OIDC proti Keycloak realmu s rolemi čtenými z tokenu",
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
          detail: "server-sent events pro živé ceny, NDJSON pro odpovědi slovo po slovu",
        },
        "accessible-interaction": {
          name: "Přístupné ovládání",
          detail: "drag and drop ovladatelný klávesnicí, s ARIA rolemi, které ten vzor skutečně vyžaduje",
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
          detail: "unit, integrační a end-to-end v Playwrightu — a 170 testů na samotném Node runneru, bez nainstalovaného testovacího frameworku",
        },
        docker: {
          name: "Docker",
          detail: "vícefázové buildy, jeden origin, žádná CORS vrstva; compose soubor, který zvedne aplikaci, její databázi a identity providera pohromadě",
        },
        "ci-cd": {
          name: "CI/CD",
          detail: "typecheck, lint a obě sady testů u každého pull requestu",
        },
      },
    },
  },
} satisfies Copy;
