// Single source of content for the timeline. Each event renders one card.
//
// Schema (see SPEC.md): id, year, date, era, title, description, plus media
// fields (youtubeId/youtubeSearch, tweetUrl/xSearch, instagramUrl/instagramSearch)
// and an optional `tags` array. Tags power the achievement filter; allowed values
// are "ballon-dor" | "world-cup" | "trophy" | "record". Omit or leave [] when none
// apply — such cards still appear under "All" and their era filter.
//
// NEVER fabricate a youtubeId / tweetUrl / instagramUrl. Leave it "" and the UI
// falls back to a reliable search link built from the *Search field.

export const EVENTS = [
  {
    id: "debut-2004",
    year: 2004, date: "16 Oct 2004", era: "barca",
    title: "La Liga debut vs Espanyol (age 17)",
    description: "A 17-year-old Messi comes on as a substitute for Barcelona against Espanyol, becoming one of the club's youngest-ever La Liga players. The world gets its first glimpse of a generational talent.",
    youtubeId: "", youtubeSearch: "Messi first Barcelona La Liga debut Espanyol 2004",
    tweetUrl: "", xSearch: "Messi debut Barcelona Espanyol 2004",
    instagramUrl: "", instagramSearch: "MessiBarcelona2004",
    tags: []
  },
  {
    id: "first-goal-2005",
    year: 2005, date: "1 May 2005", era: "barca",
    title: "First senior goal, assisted by Ronaldinho",
    description: "Messi scores his first competitive goal for Barcelona against Albacete, set up by a sublime chip from Ronaldinho. At 17 years and 10 months, he becomes the youngest Barça scorer in La Liga history at the time.",
    youtubeId: "", youtubeSearch: "Messi first goal Barcelona Albacete Ronaldinho 2005",
    tweetUrl: "", xSearch: "Messi first Barcelona goal Ronaldinho 2005",
    instagramUrl: "", instagramSearch: "MessiFirstGoalBarcelona",
    tags: ["record"]
  },
  {
    id: "first-la-liga-title-2005",
    year: 2005, date: "May 2005", era: "barca",
    title: "First La Liga title with Barcelona",
    description: "Still a teenager, Messi wins his first La Liga medal as Barcelona claim the Spanish title. He contributes modestly — glimpses of the future, not the finished article — but it is the first chapter of a trophy haul that will become the most decorated club career in history.",
    youtubeId: "", youtubeSearch: "Barcelona La Liga champions 2004-05 title",
    tweetUrl: "", xSearch: "Barcelona La Liga 2005 title Messi",
    instagramUrl: "", instagramSearch: "BarcelonaLaLiga2005",
    tags: ["trophy"]
  },
  {
    id: "u20-world-cup-2005",
    year: 2005, date: "Jun 2005", era: "argentina",
    title: "FIFA U-20 World Cup — Golden Ball & Golden Boot",
    description: "Messi leads Argentina to the FIFA World Youth Championship title in the Netherlands, finishing as the tournament's top scorer and best player. It is the first major trophy of his career and a sign of things to come on the international stage.",
    youtubeId: "", youtubeSearch: "Messi FIFA U20 World Cup 2005 Argentina Golden Boot",
    tweetUrl: "", xSearch: "Messi U20 World Cup Argentina 2005 Golden Ball",
    instagramUrl: "", instagramSearch: "MessiU20WorldCup2005",
    tags: ["trophy", "world-cup"]
  },
  {
    id: "first-world-cup-2006",
    year: 2006, date: "Jun 2006", era: "argentina",
    title: "First FIFA World Cup — scores debut goal at age 18",
    description: "Messi makes his senior World Cup debut in Germany, coming off the bench to score against Serbia & Montenegro and become one of Argentina's youngest-ever World Cup scorers. Argentina reach the quarter-finals before losing to Germany on penalties — the first of many international heartbreaks.",
    youtubeId: "", youtubeSearch: "Messi first World Cup goal 2006 Germany Serbia Montenegro",
    tweetUrl: "", xSearch: "Messi World Cup debut 2006 Germany",
    instagramUrl: "", instagramSearch: "MessiWorldCup2006",
    tags: ["world-cup"]
  },
  {
    id: "maradona-goal-2007",
    year: 2007, date: "18 Apr 2007", era: "barca",
    title: "The 'Maradona Goal' vs Getafe",
    description: "Messi picks up the ball in his own half and dribbles past five Getafe players before rounding the goalkeeper — a goal so reminiscent of Maradona's 1986 World Cup masterpiece that it instantly enters football folklore.",
    youtubeId: "FtdoIg3Do-k", youtubeSearch: "Messi goal vs Getafe 2007 Maradona Copa del Rey",
    tweetUrl: "", xSearch: "Messi Maradona goal Getafe 2007",
    instagramUrl: "", instagramSearch: "MessiGetafe2007",
    tags: []
  },
  {
    id: "copa-america-runner-up-2007",
    year: 2007, date: "15 Jul 2007", era: "argentina",
    title: "Copa América runner-up — wins Best Young Player",
    description: "Argentina reach the Copa América final in Venezuela but are outclassed by Brazil 3–0. A 19-year-old Messi is named Best Young Player of the tournament — brilliant individually, but the pattern of international near-misses is already beginning to form.",
    youtubeId: "", youtubeSearch: "Messi Copa America 2007 Argentina Brazil final",
    tweetUrl: "", xSearch: "Messi Copa America 2007 runner-up",
    instagramUrl: "", instagramSearch: "MessiCopaAmerica2007",
    tags: []
  },
  {
    id: "olympic-gold-2008",
    year: 2008, date: "23 Aug 2008", era: "argentina",
    title: "Olympic Gold Medal — Beijing",
    description: "Messi helps Argentina win the gold medal at the Beijing Olympics, one of the few international trophies he would hold for the next 13 years. Ángel Di María scores the only goal in a 1–0 final win over Nigeria, with Messi — two goals and multiple assists across the tournament — a constant creative force.",
    youtubeId: "f29sq-5E5Q4", youtubeSearch: "Messi Argentina Olympic gold medal Beijing 2008 Nigeria",
    tweetUrl: "", xSearch: "Messi Olympic gold 2008 Beijing Argentina",
    instagramUrl: "", instagramSearch: "MessiOlympicGold2008",
    tags: ["trophy"]
  },
  {
    id: "first-treble-2009",
    year: 2009, date: "May 2009", era: "barca",
    title: "First treble, UCL final header & 1st Ballon d'Or",
    description: "Barcelona complete a historic treble under Pep Guardiola. Messi heads in the decisive second goal in the Champions League final against Manchester United in Rome, then claims his first Ballon d'Or — the beginning of an unprecedented era of individual dominance.",
    youtubeId: "", youtubeSearch: "Messi header Champions League final 2009 Barcelona Manchester United Rome",
    tweetUrl: "", xSearch: "Messi Ballon d'Or 2009 Barcelona treble",
    instagramUrl: "", instagramSearch: "MessiUCLFinal2009",
    tags: ["trophy", "ballon-dor"]
  },
  {
    id: "club-world-cup-2009",
    year: 2009, date: "19 Dec 2009", era: "barca",
    title: "FIFA Club World Cup — completing the sextuple",
    description: "Barcelona defeat Argentine club Estudiantes de La Plata 2–1 after extra time in Abu Dhabi to become world champions. Messi scores the winning goal and is named Player of the Tournament, capping a calendar year in which Barça won six trophies — a sextuple no club has matched since.",
    youtubeId: "", youtubeSearch: "Messi Club World Cup 2009 Barcelona Estudiantes Abu Dhabi",
    tweetUrl: "", xSearch: "Messi Club World Cup 2009 Barcelona sextuple",
    instagramUrl: "", instagramSearch: "BarcelonaClubWorldCup2009",
    tags: ["trophy", "record"]
  },
  {
    id: "world-cup-2010",
    year: 2010, date: "3 Jul 2010", era: "argentina",
    title: "World Cup quarter-final exit — Germany 4–0",
    description: "In a humbling quarter-final in Cape Town, Argentina are dismantled 4–0 by Germany despite being one of the pre-tournament favourites. Messi, carrying the weight of a nation's expectations, cannot find a way through. The defeat adds another chapter to his complicated relationship with the World Cup.",
    youtubeId: "", youtubeSearch: "Argentina Germany 4-0 World Cup 2010 quarter-final Cape Town",
    tweetUrl: "", xSearch: "Argentina Germany World Cup 2010 Messi",
    instagramUrl: "", instagramSearch: "MessiWorldCup2010",
    tags: ["world-cup"]
  },
  {
    id: "second-ballon-dor-2010",
    year: 2010, date: "2010", era: "barca",
    title: "2nd Ballon d'Or — 34 La Liga goals",
    description: "Messi wins his second Ballon d'Or for a season in which he scores 34 goals in La Liga alone, driving Barcelona to the Spanish title. At 23, the gap between him and every other player on the planet is already becoming difficult to quantify.",
    youtubeId: "", youtubeSearch: "Messi second Ballon d'Or 2010 award ceremony",
    tweetUrl: "", xSearch: "Messi 2nd Ballon d'Or 2010",
    instagramUrl: "", instagramSearch: "MessiBallonDor2010",
    tags: ["ballon-dor"]
  },
  {
    id: "ucl-wembley-2011",
    year: 2011, date: "28 May 2011", era: "barca",
    title: "Champions League win vs Man Utd at Wembley",
    description: "Barcelona dismantle Manchester United 3–1 at Wembley to claim their fourth European Cup. Messi scores a stunning long-range effort and orchestrates one of the greatest club performances ever seen, cementing this Barça side as one of history's finest.",
    youtubeId: "NRuGDGR4OrQ", youtubeSearch: "Messi goal Barcelona Manchester United Champions League final Wembley 2011",
    tweetUrl: "", xSearch: "Messi Champions League final Wembley 2011",
    instagramUrl: "", instagramSearch: "MessiUCLWembley2011",
    tags: ["trophy"]
  },
  {
    id: "third-ballon-dor-2011",
    year: 2011, date: "2011", era: "barca",
    title: "3rd consecutive Ballon d'Or",
    description: "A third straight Ballon d'Or confirms Messi's complete dominance of world football. He finishes the 2010–11 season with 53 goals in all competitions — a new personal record — and is the driving force behind Barça's Champions League triumph at Wembley.",
    youtubeId: "", youtubeSearch: "Messi third Ballon d'Or 2011 ceremony award",
    tweetUrl: "", xSearch: "Messi 3rd Ballon d'Or 2011",
    instagramUrl: "", instagramSearch: "MessiBallonDor2011",
    tags: ["ballon-dor"]
  },
  {
    id: "la-liga-50-goals-2012",
    year: 2012, date: "May 2012", era: "barca",
    title: "50 La Liga goals in one season — all-time record",
    description: "Messi finishes the 2011–12 La Liga campaign with 50 goals, obliterating the previous single-season record and becoming the first player in history to reach 50 in one Spanish top-flight season. Combined with his exploits in other competitions, he ends the calendar year with 91 goals in total.",
    youtubeId: "", youtubeSearch: "Messi 50 La Liga goals record 2011-12 season",
    tweetUrl: "", xSearch: "Messi 50 goals La Liga season record 2012",
    instagramUrl: "", instagramSearch: "Messi50GoalsLaLiga",
    tags: ["record"]
  },
  {
    id: "copa-del-rey-2012",
    year: 2012, date: "25 May 2012", era: "barca",
    title: "Copa del Rey final — scores twice vs Athletic Club",
    description: "Messi scores twice as Barcelona beat Athletic Club 3–0 in the Copa del Rey final in Madrid, adding yet another domestic cup to an already bulging trophy cabinet. The victory underlines just how total Barcelona's dominance of Spanish football has become during this golden era.",
    youtubeId: "", youtubeSearch: "Messi Copa del Rey final 2012 Barcelona Athletic Club goals",
    tweetUrl: "", xSearch: "Messi Copa del Rey 2012 final Barcelona Athletic Club",
    instagramUrl: "", instagramSearch: "MessiCopaDelRey2012",
    tags: ["trophy"]
  },
  {
    id: "91-goals-2012",
    year: 2012, date: "Dec 2012", era: "barca",
    title: "Record 91 goals in a calendar year",
    description: "Messi shatters Gerd Müller's 40-year-old record of 85 goals in a calendar year, finishing 2012 with an almost incomprehensible 91 goals in all competitions. The record still stands.",
    youtubeId: "", youtubeSearch: "Messi 91 goals calendar year 2012 record Gerd Muller",
    tweetUrl: "", xSearch: "Messi 91 goals 2012 record",
    instagramUrl: "", instagramSearch: "Messi91Goals2012",
    tags: ["record"]
  },
  {
    id: "fourth-ballon-dor-2012",
    year: 2012, date: "2012", era: "barca",
    title: "4th consecutive Ballon d'Or — first ever",
    description: "Messi wins his fourth consecutive Ballon d'Or, becoming the first player in history to win the award four times in a row. The 2009–2012 run of dominance remains unmatched in the award's history.",
    youtubeId: "", youtubeSearch: "Messi fourth Ballon d'Or 2012 award ceremony",
    tweetUrl: "", xSearch: "Messi 4th Ballon d'Or 2012",
    instagramUrl: "", instagramSearch: "MessiBallonDor2012",
    tags: ["ballon-dor", "record"]
  },
  {
    id: "barca-top-scorer-2014",
    year: 2014, date: "16 Mar 2014", era: "barca",
    title: "Becomes Barcelona's all-time top scorer",
    description: "With a hat-trick against Osasuna, Messi surpasses Paulino Alcántara's club record to become Barcelona's all-time leading goalscorer — a mark that had stood for the best part of a century. He would go on to extend the record beyond 670 goals before leaving the club.",
    youtubeId: "", youtubeSearch: "Messi Barcelona all-time top scorer record Osasuna hat-trick 2014 Alcantara",
    tweetUrl: "", xSearch: "Messi Barcelona all time top scorer record 2014 Alcantara",
    instagramUrl: "", instagramSearch: "MessiBarcaTopScorer2014",
    tags: ["record"]
  },
  {
    id: "world-cup-final-2014",
    year: 2014, date: "13 Jul 2014", era: "argentina",
    title: "World Cup final runner-up; wins Golden Ball",
    description: "Argentina reach the World Cup final in Brazil, losing 1–0 to Germany in extra time. Messi carries his nation through the tournament with a string of match-winning performances and is awarded the Golden Ball as the tournament's best player — though the outcome remains the bitterest chapter of his international career.",
    youtubeId: "", youtubeSearch: "Messi Argentina World Cup final 2014 Brazil Germany Golden Ball",
    tweetUrl: "", xSearch: "Messi World Cup final 2014 Argentina Golden Ball",
    instagramUrl: "", instagramSearch: "MessiWorldCupFinal2014",
    tags: ["world-cup"]
  },
  {
    id: "la-liga-all-time-record-2014",
    year: 2014, date: "Nov 2014", era: "barca",
    title: "Breaks Telmo Zarra's La Liga all-time scoring record",
    description: "Messi surpasses Telmo Zarra's seemingly unbreakable La Liga record, set across 15 years with Athletic Club in the 1940s and '50s. To score more than 251 La Liga goals by the age of 27 is an achievement that had seemed the stuff of fantasy — Messi makes it look inevitable.",
    youtubeId: "", youtubeSearch: "Messi breaks Telmo Zarra La Liga all time scoring record 2014",
    tweetUrl: "", xSearch: "Messi Zarra La Liga record 2014",
    instagramUrl: "", instagramSearch: "MessiZarraRecord",
    tags: ["record"]
  },
  {
    id: "second-treble-2015",
    year: 2015, date: "Jun 2015", era: "barca",
    title: "Second treble & 5th Ballon d'Or",
    description: "Barcelona win La Liga, the Copa del Rey, and the Champions League again under Luis Enrique, with Messi, Suárez, and Neymar forming the most feared attack in the world. A 5th Ballon d'Or follows, equalling Cristiano Ronaldo's tally at the time.",
    youtubeId: "", youtubeSearch: "Messi Barcelona treble 2015 Champions League Berlin",
    tweetUrl: "", xSearch: "Messi 5th Ballon d'Or 2015 Barcelona treble",
    instagramUrl: "", instagramSearch: "BarcelonaTreble2015",
    tags: ["trophy", "ballon-dor"]
  },
  {
    id: "copa-america-runner-up-2015",
    year: 2015, date: "4 Jul 2015", era: "argentina",
    title: "Copa América runner-up — second final defeat to Chile",
    description: "Argentina reach yet another Copa América final but lose to Chile on penalties in Santiago. Messi scores in the shootout but two teammates miss, and Argentina's international drought extends further. A second consecutive major final defeat intensifies the question of whether the trophy will ever arrive.",
    youtubeId: "", youtubeSearch: "Messi Argentina Copa America final 2015 Chile penalties",
    tweetUrl: "", xSearch: "Messi Copa America 2015 final Argentina Chile",
    instagramUrl: "", instagramSearch: "MessiCopaAmerica2015",
    tags: []
  },
  {
    id: "club-world-cup-2015",
    year: 2015, date: "20 Dec 2015", era: "barca",
    title: "Second FIFA Club World Cup — Golden Ball",
    description: "Barcelona beat River Plate 3–0 in Yokohama to win the Club World Cup for the second time, with Messi collecting the Golden Ball as player of the tournament. It is a fitting final chapter to a treble-winning year and Barcelona's most decorated era.",
    youtubeId: "", youtubeSearch: "Messi Club World Cup 2015 Barcelona River Plate Yokohama",
    tweetUrl: "", xSearch: "Messi Club World Cup 2015 Barcelona",
    instagramUrl: "", instagramSearch: "BarcelonaClubWorldCup2015",
    tags: ["trophy"]
  },
  {
    id: "copa-america-centenario-2016",
    year: 2016, date: "26 Jun 2016", era: "argentina",
    title: "Copa América Centenario runner-up — brief retirement",
    description: "Argentina lose a third consecutive final to Chile on penalties in New Jersey. Messi misses his spot-kick and announces his international retirement in tears. The football world reacts with an outpouring of support — 'Don't go, Leo' — and he reverses the decision within weeks, eventually fulfilling his destiny in Qatar.",
    youtubeId: "", youtubeSearch: "Messi Copa America Centenario 2016 final retirement announcement Argentina Chile",
    tweetUrl: "", xSearch: "Messi retirement announcement Copa America 2016",
    instagramUrl: "", instagramSearch: "MessiRetirement2016",
    tags: []
  },
  {
    id: "batistuta-record-2016",
    year: 2016, date: "Nov 2016", era: "argentina",
    title: "Breaks Batistuta's Argentina all-time scoring record",
    description: "Messi surpasses Gabriel Batistuta's long-standing record to become Argentina's all-time leading scorer. The milestone arrives in a World Cup qualifying match — quietly fitting for a record that had seemed safe, held by one of South America's most revered strikers for nearly two decades.",
    youtubeId: "", youtubeSearch: "Messi breaks Batistuta Argentina all time scoring record 2016",
    tweetUrl: "", xSearch: "Messi Batistuta Argentina scoring record 2016",
    instagramUrl: "", instagramSearch: "MessiBatiRecord",
    tags: ["record"]
  },
  {
    id: "bernabeu-shirt-2017",
    year: 2017, date: "23 Apr 2017", era: "barca",
    title: "Messi's 500th Barcelona goal at the Bernabéu — the shirt celebration",
    description: "Messi scores a stoppage-time winner at the Bernabéu to give Barcelona a 3–2 victory over Real Madrid in La Liga. The goal is his 500th for the club. In response to the crowd that had been baiting him all night, he strips off his shirt and holds it to face the stands — one of the most iconic moments of defiance in football history.",
    youtubeId: "", youtubeSearch: "Messi 500th goal Bernabeu shirt celebration El Clasico 2017",
    tweetUrl: "", xSearch: "Messi shirt Bernabeu El Clasico 2017 500th goal",
    instagramUrl: "", instagramSearch: "MessiBernabeu2017",
    tags: ["record"]
  },
  {
    id: "copa-del-rey-2017",
    year: 2017, date: "27 May 2017", era: "barca",
    title: "Copa del Rey final — stunning solo goal vs Alavés",
    description: "Messi produces a vintage individual goal in the Copa del Rey final against Alavés — collecting the ball wide, cutting inside and finishing with precision — as Barcelona win 3–1. Even at 29, the quality of his invention remains startling.",
    youtubeId: "", youtubeSearch: "Messi Copa del Rey final 2017 solo goal Alaves Barcelona",
    tweetUrl: "", xSearch: "Messi Copa del Rey final 2017 goal Alaves",
    instagramUrl: "", instagramSearch: "MessiCopaDelRey2017",
    tags: ["trophy"]
  },
  {
    id: "ecuador-hat-trick-2017",
    year: 2017, date: "10 Oct 2017", era: "argentina",
    title: "Hat-trick vs Ecuador at altitude saves World Cup qualification",
    description: "With Argentina on the brink of failing to qualify for Russia 2018, Messi produces one of the most dramatic individual performances in World Cup qualifying history — scoring a hat-trick in Quito at over 2,800 metres above sea level to seal a 3–1 win. Argentina qualify in third place; the rest of the world exhales.",
    youtubeId: "pT8lH3_tzsE", youtubeSearch: "Messi hat-trick Ecuador Quito World Cup qualifying 2017",
    tweetUrl: "", xSearch: "Messi hat trick Ecuador qualifying 2017 Quito",
    instagramUrl: "", instagramSearch: "MessiEcuadorHatTrick",
    tags: ["world-cup"]
  },
  {
    id: "world-cup-russia-2018",
    year: 2018, date: "30 Jun 2018", era: "argentina",
    title: "World Cup exit vs France — 4–3 classic",
    description: "Argentina face France in a breathless Round of 16 in Kazan — Messi scores and creates, but Kylian Mbappé's explosive double seals a 4–3 victory for France, who go on to win the tournament. Another World Cup ends without the ultimate prize, and the pressure mounts heading into what many expect to be Messi's final shot.",
    youtubeId: "", youtubeSearch: "Messi Argentina France 4-3 World Cup 2018 round of 16 Kazan",
    tweetUrl: "", xSearch: "Messi Argentina France World Cup 2018 4-3",
    instagramUrl: "", instagramSearch: "MessiWorldCup2018",
    tags: ["world-cup"]
  },
  {
    id: "ucl-semi-liverpool-2019",
    year: 2019, date: "30 Apr 2019", era: "barca",
    title: "UCL semi vs Liverpool — free-kick masterclass & Anfield collapse",
    description: "Messi scores twice in the first leg at the Camp Nou — including a stunning direct free-kick for his 600th Barcelona goal — as Barcelona lead 3–0 going to Anfield. But in one of football's most extraordinary nights, Liverpool win the second leg 4–0 to advance on aggregate. The result stands as one of the most painful defeats of Messi's career.",
    youtubeId: "xhGwjUKbiC4", youtubeSearch: "Messi free kick Barcelona Liverpool Champions League semi 2019",
    tweetUrl: "", xSearch: "Messi Liverpool UCL semi 2019 Anfield comeback",
    instagramUrl: "", instagramSearch: "MessiLiverpoolUCL2019",
    tags: []
  },
  {
    id: "copa-america-2019",
    year: 2019, date: "Jul 2019", era: "argentina",
    title: "Copa América 2019 — third place & CONMEBOL controversy",
    description: "Argentina finish third at the Copa América in Brazil, beating Chile in the play-off. Messi is furious at what he calls corrupt officiating throughout the tournament, publicly criticising CONMEBOL — remarks that earn him a three-month ban. The controversy only deepens his resolve to finally win with his country.",
    youtubeId: "", youtubeSearch: "Messi Copa America 2019 third place CONMEBOL criticism Argentina",
    tweetUrl: "", xSearch: "Messi CONMEBOL Copa America 2019 criticism ban",
    instagramUrl: "", instagramSearch: "MessiCopaAmerica2019",
    tags: []
  },
  {
    id: "sixth-ballon-dor-2019",
    year: 2019, date: "2019", era: "barca",
    title: "6th Ballon d'Or — a new record",
    description: "Messi claims his sixth Ballon d'Or, surpassing Cristiano Ronaldo's five to set a new record for the most wins in the award's history. He finishes La Liga as top scorer and drives Barcelona's domestic campaign almost single-handedly.",
    youtubeId: "", youtubeSearch: "Messi 6th Ballon d'Or 2019 record ceremony",
    tweetUrl: "", xSearch: "Messi 6th Ballon d'Or 2019",
    instagramUrl: "", instagramSearch: "MessiBallonDor2019",
    tags: ["ballon-dor", "record"]
  },
  {
    id: "bayern-8-2-2020",
    year: 2020, date: "14 Aug 2020", era: "barca",
    title: "The 8–2 humiliation by Bayern Munich",
    description: "In the Champions League quarter-final in Lisbon, Barcelona are torn apart 8–2 by Bayern Munich — one of the most shocking results in the competition's history. The defeat lays bare how far the club has fallen and becomes the catalyst for the upheaval that follows.",
    youtubeId: "", youtubeSearch: "Barcelona Bayern Munich 8-2 Champions League 2020 Lisbon",
    tweetUrl: "", xSearch: "Barcelona Bayern 8-2 2020 Champions League",
    instagramUrl: "", instagramSearch: "BarcaBayern82",
    tags: []
  },
  {
    id: "burofax-2020",
    year: 2020, date: "25 Aug 2020", era: "barca",
    title: "The burofax — Messi tells Barcelona he wants to leave",
    description: "Days after the Bayern collapse, Messi sends Barcelona a burofax stating his intention to leave the club he had served for two decades. A bitter standoff over a release clause follows; he ultimately stays for one more season rather than fight the club in court — but the relationship is never the same.",
    youtubeId: "", youtubeSearch: "Messi burofax Barcelona wants to leave 2020 release clause",
    tweetUrl: "", xSearch: "Messi burofax Barcelona leave 2020",
    instagramUrl: "", instagramSearch: "MessiBurofax2020",
    tags: []
  },
  {
    id: "copa-del-rey-2021",
    year: 2021, date: "17 Apr 2021", era: "barca",
    title: "Copa del Rey — Messi's final Barcelona trophy",
    description: "Messi scores twice as Barcelona thrash Athletic Club 4–0 in the Copa del Rey final in Seville. It proves to be the last of his record 35 trophies for the club — a fittingly emphatic farewell gift, months before his shock departure.",
    youtubeId: "", youtubeSearch: "Messi Copa del Rey final 2021 Barcelona Athletic Club 4-0 Seville",
    tweetUrl: "", xSearch: "Messi Copa del Rey 2021 final Barcelona Athletic",
    instagramUrl: "", instagramSearch: "MessiCopaDelRey2021",
    tags: ["trophy"]
  },
  {
    id: "copa-america-2021",
    year: 2021, date: "10 Jul 2021", era: "argentina",
    title: "Copa América — first senior international trophy",
    description: "After coming agonisingly close multiple times, Messi finally lifts a major trophy with Argentina, winning the Copa América in Brazil. He is named Player of the Tournament with four goals and five assists, ending years of heartbreak on the international stage.",
    youtubeId: "ntr5uMTasaU", youtubeSearch: "Messi Argentina Copa America 2021 champion trophy Brazil",
    tweetUrl: "", xSearch: "Messi Copa America 2021 Argentina trophy",
    instagramUrl: "https://www.instagram.com/p/CRUAkbbMR-w/", instagramSearch: "MessiCopaAmerica2021",
    tags: ["trophy"]
  },
  {
    id: "barca-farewell-2021",
    year: 2021, date: "8 Aug 2021", era: "psg",
    title: "Tearful Barcelona farewell; joins Paris Saint-Germain",
    description: "In an emotional press conference, a tearful Messi announces he is leaving Barcelona after 21 years — financial fair play regulations made his renewal impossible. Days later he signs for Paris Saint-Germain, ending the most celebrated club career in one city the sport has ever seen.",
    youtubeId: "RG5V4_QqTnE", youtubeSearch: "Messi farewell Barcelona press conference crying 2021",
    tweetUrl: "https://x.com/FCBarcelona/status/1423341016455819271", xSearch: "Messi farewell Barcelona 2021 PSG signing",
    instagramUrl: "", instagramSearch: "MessiBarcelonaFarewell",
    tags: []
  },
  {
    id: "seventh-ballon-dor-2021",
    year: 2021, date: "Nov 2021", era: "argentina",
    title: "7th Ballon d'Or",
    description: "Riding the wave of Argentina's Copa América triumph, Messi collects his seventh Ballon d'Or — extending his own world record and silencing those who had questioned his international legacy.",
    youtubeId: "", youtubeSearch: "Messi 7th Ballon d'Or 2021 ceremony",
    tweetUrl: "", xSearch: "Messi 7th Ballon d'Or 2021",
    instagramUrl: "", instagramSearch: "MessiBallonDor2021",
    tags: ["ballon-dor", "record"]
  },
  {
    id: "psg-ligue1-2022",
    year: 2022, date: "May 2022", era: "psg",
    title: "Ligue 1 title with PSG",
    description: "Messi wins his first and only Ligue 1 championship as Paris Saint-Germain seal the French title. His debut season in Paris is difficult by his own standards — hampered by injury and adaptation — but the league medal adds to a collection that now spans every major domestic league he has played in.",
    youtubeId: "", youtubeSearch: "Messi PSG Ligue 1 champion 2022",
    tweetUrl: "", xSearch: "Messi PSG Ligue 1 title 2022",
    instagramUrl: "", instagramSearch: "MessiPSGLigue1",
    tags: ["trophy"]
  },
  {
    id: "finalissima-2022",
    year: 2022, date: "1 Jun 2022", era: "argentina",
    title: "Finalissima — Argentina beat Italy 3–0 at Wembley",
    description: "Argentina face European champions Italy in the inaugural Finalissima at Wembley and win 3–0 in dominant fashion, confirming their status as the best national team in the world. Messi orchestrates throughout, and the result is a statement of intent ahead of the Qatar World Cup later that year.",
    youtubeId: "", youtubeSearch: "Messi Argentina Italy Finalissima 2022 Wembley 3-0",
    tweetUrl: "", xSearch: "Messi Finalissima 2022 Argentina Italy Wembley",
    instagramUrl: "", instagramSearch: "MessiFinalissima2022",
    tags: ["trophy"]
  },
  {
    id: "world-cup-2022",
    year: 2022, date: "18 Dec 2022", era: "argentina",
    title: "FIFA World Cup champion — scores in the final",
    description: "In what many call the greatest World Cup final ever played, Messi scores twice as Argentina beat France on penalties in Qatar. He finishes with seven goals and three assists across the tournament, claiming a second Golden Ball and completing the one trophy that had eluded him his entire career.",
    youtubeId: "zhEWqfP6V_w", youtubeSearch: "Messi World Cup final 2022 Qatar Argentina France goal",
    tweetUrl: "", xSearch: "Messi World Cup champion 2022 Argentina Qatar",
    instagramUrl: "https://www.instagram.com/p/CmUv48DLvxd/", instagramSearch: "MessiWorldCup2022",
    tags: ["world-cup", "trophy"]
  },
  {
    id: "miami-announcement-2023",
    year: 2023, date: "7 Jun 2023", era: "miami",
    title: "Chooses Inter Miami over a Barcelona return and Saudi riches",
    description: "Messi announces he will join Inter Miami, turning down both an emotional return to Barcelona and a reported nine-figure offer from Saudi Arabia's Al-Hilal. The decision reshapes the landscape of American soccer overnight and sets the stage for the most-hyped MLS arrival in history.",
    youtubeId: "", youtubeSearch: "Messi announces Inter Miami MLS decision 2023 Barcelona Al Hilal",
    tweetUrl: "", xSearch: "Messi Inter Miami announcement 2023 MLS",
    instagramUrl: "", instagramSearch: "MessiInterMiamiAnnouncement",
    tags: []
  },
  {
    id: "miami-debut-2023",
    year: 2023, date: "21 Jul 2023", era: "miami",
    title: "Inter Miami debut — free-kick winner vs Cruz Azul",
    description: "Messi makes his Inter Miami debut in the Leagues Cup and wins the match with a curling free-kick in stoppage time. The strike triggers delirious scenes at DRV PNK Stadium and announces the dawn of a new era for American soccer.",
    youtubeId: "PwMh7UGaDKM", youtubeSearch: "Messi Inter Miami debut free kick Cruz Azul Leagues Cup 2023",
    tweetUrl: "", xSearch: "Messi Inter Miami debut Cruz Azul 2023 free kick",
    instagramUrl: "", instagramSearch: "MessiInterMiamiDebut",
    tags: []
  },
  {
    id: "leagues-cup-2023",
    year: 2023, date: "19 Aug 2023", era: "miami",
    title: "Wins Leagues Cup — first Inter Miami trophy",
    description: "Inter Miami lift the Leagues Cup, their first-ever major trophy, with Messi as the architect. He scores in the final and finishes the tournament with 10 goals in 7 games, transforming a struggling club into a continental champion almost overnight.",
    youtubeId: "", youtubeSearch: "Messi Inter Miami Leagues Cup final 2023 trophy",
    tweetUrl: "", xSearch: "Messi Leagues Cup Inter Miami 2023",
    instagramUrl: "", instagramSearch: "MessiLeaguesCup2023",
    tags: ["trophy"]
  },
  {
    id: "eighth-ballon-dor-2023",
    year: 2023, date: "30 Oct 2023", era: "miami",
    title: "Record-extending 8th Ballon d'Or",
    description: "Messi claims an unprecedented eighth Ballon d'Or, recognised primarily for his World Cup-winning year with Argentina. At 36 years old, he continues to rewrite the history books in a sport that once seemed to have no more records left to break.",
    youtubeId: "rAO8xk2l05Q", youtubeSearch: "Messi 8th Ballon d'Or 2023 ceremony record",
    tweetUrl: "", xSearch: "Messi 8th Ballon d'Or 2023 record",
    instagramUrl: "", instagramSearch: "MessiBallonDor2023",
    tags: ["ballon-dor", "record"]
  },
  {
    id: "copa-america-2024",
    year: 2024, date: "14 Jul 2024", era: "argentina",
    title: "Copa América 2024 — champion despite injury",
    description: "Argentina retain the Copa América on US soil, with Messi hobbling off injured in the final. Despite his absence for much of the decisive match, his leadership through the tournament proves pivotal as La Albiceleste defend their continental crown.",
    youtubeId: "", youtubeSearch: "Messi Argentina Copa America 2024 champion final injury",
    tweetUrl: "", xSearch: "Messi Copa America 2024 Argentina champion",
    instagramUrl: "", instagramSearch: "MessiCopaAmerica2024",
    tags: ["trophy"]
  },
  {
    id: "supporters-shield-2024",
    year: 2024, date: "2024", era: "miami",
    title: "Supporters' Shield, record points & first MLS MVP",
    description: "Inter Miami win the Supporters' Shield with a record-breaking regular season points tally, and Messi is named MLS Most Valuable Player — the first time the award has gone to a player of his pedigree. He proves that MLS is not a retirement league.",
    youtubeId: "", youtubeSearch: "Messi MLS MVP 2024 Inter Miami Supporters Shield",
    tweetUrl: "", xSearch: "Messi MLS MVP 2024 Inter Miami Supporters Shield",
    instagramUrl: "", instagramSearch: "MessiMLSMVP2024",
    tags: ["trophy", "record"]
  },
  {
    id: "mls-golden-boot-2025",
    year: 2025, date: "18 Oct 2025", era: "miami",
    title: "MLS Golden Boot — 29 goals",
    description: "Messi finishes the 2025 MLS regular season as the league's top scorer with 29 goals, claiming the Golden Boot and reaffirming that even in his late 30s he remains a cut above every other player in Major League Soccer.",
    youtubeId: "", youtubeSearch: "Messi MLS Golden Boot 2025 top scorer 29 goals",
    tweetUrl: "", xSearch: "Messi MLS Golden Boot 2025",
    instagramUrl: "", instagramSearch: "MessiMLSGoldenBoot2025",
    tags: ["record"]
  },
  {
    id: "mls-cup-2025",
    year: 2025, date: "6 Dec 2025", era: "miami",
    title: "First MLS Cup title & 2nd straight MLS MVP",
    description: "Inter Miami beat Vancouver Whitecaps 3–1 to lift the MLS Cup — the club's first-ever league championship. Messi is named MLS MVP for the second consecutive year, completing an extraordinary transformation of American soccer's biggest stage.",
    youtubeId: "", youtubeSearch: "Messi Inter Miami MLS Cup 2025 champion Vancouver",
    tweetUrl: "", xSearch: "Messi MLS Cup 2025 Inter Miami champion",
    instagramUrl: "", instagramSearch: "MessiMLSCup2025",
    tags: ["trophy"]
  },
  {
    id: "world-cup-2026",
    year: 2026, date: "2026", era: "argentina",
    title: "Looking ahead: defending the World Cup",
    description: "With the FIFA World Cup taking place in North America in 2026, Messi has a chance to do what no player has ever done — defend the World Cup on home soil (for his adopted country). The football world watches and waits.",
    youtubeId: "", youtubeSearch: "Messi Argentina World Cup 2026 North America",
    tweetUrl: "", xSearch: "Messi Argentina World Cup 2026",
    instagramUrl: "", instagramSearch: "MessiWorldCup2026",
    tags: []
  }
];
