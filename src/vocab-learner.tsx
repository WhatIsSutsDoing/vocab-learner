import { useState, useEffect, useCallback } from "react";

// 100 words across 10 levels (10 per level), each with etymology
const WORD_BANK = [
  // ── LEVEL 1 ──────────────────────────────────────────────────────────────
  { level: 1, word: "Ardent", pronunciation: "/ˈɑːdənt/", partOfSpeech: "adjective", category: "Emotions", definition: "Very enthusiastic or passionate; burning with feeling.", etymology: "Latin ardere (to burn) → ardens (burning) → ardent. Root ard- means 'to burn'. Also in: ardour, arson, arduous (fiery effort), arid (scorched dry).", example: "She was an ardent reader who went through three books a week and still felt behind." },
  { level: 1, word: "Terse", pronunciation: "/tɜːs/", partOfSpeech: "adjective", category: "Social", definition: "Sparing in words; brief and direct, sometimes to the point of rudeness.", etymology: "Latin tergere (to wipe clean) → tersus (wiped clean, polished) → terse. Root ters- means 'to wipe/polish'. Also in: deterge, detergent (wiping away dirt), terseness.", example: "His reply was terse — just two words — and she spent the rest of the day decoding them." },
  { level: 1, word: "Placid", pronunciation: "/ˈplæsɪd/", partOfSpeech: "adjective", category: "Emotions", definition: "Not easily upset or excited; calm and peaceful.", etymology: "Latin placere (to please) → placidus (calm, pleasing) → placid. Root plac- means 'to please/calm'. Also in: placate, complacent, implacable, please.", example: "The placid lake reflected the mountains so perfectly it was hard to know which was real." },
  { level: 1, word: "Cogent", pronunciation: "/ˈkəʊdʒənt/", partOfSpeech: "adjective", category: "Intelligence", definition: "Clear, logical, and convincing; powerfully persuasive.", etymology: "Latin cogere (to drive together, compel) from co- (together) + agere (to drive) → cogens → cogent. Root ag- means 'to drive/act'. Also in: agent, agile, cogitate, exact, navigate.", example: "Her cogent argument dismantled three years of policy in a single ten-minute presentation." },
  { level: 1, word: "Pristine", pronunciation: "/ˈprɪstiːn/", partOfSpeech: "adjective", category: "Perception", definition: "In its original condition; unspoiled; immaculately clean.", etymology: "Latin pristinus (former, original) from prior (before) → pristine. Root prist-/prior- means 'before/earlier'. Also in: prior, priority, primeval, primitive.", example: "The cabin had sat empty for a decade yet remained in pristine condition, as if time had forgotten it." },
  { level: 1, word: "Frugal", pronunciation: "/ˈfruːɡ(ə)l/", partOfSpeech: "adjective", category: "Character", definition: "Sparing or economical with money or food; avoiding waste.", etymology: "Latin frux, frugis (fruit, produce, profit) → frugalis (economical) → frugal. Root frug- means 'fruit/produce'. Also in: frugality, fruition, fruit (the productive result).", example: "Her frugal habits in her twenties meant she owned her flat outright before she was forty." },
  { level: 1, word: "Stoic", pronunciation: "/ˈstəʊɪk/", partOfSpeech: "adjective", category: "Character", definition: "Enduring pain or difficulty without complaint or emotional display.", etymology: "Greek Stoa (porch) → Stoikos → Stoic. Named after the painted Stoa in Athens where Zeno taught. Root stoa means 'porch/colonnade'. Also in: stoicism, hypostyle (under pillars), colonnade.", example: "He accepted the diagnosis with stoic grace, then quietly arranged everything so others wouldn't worry." },
  { level: 1, word: "Garrulous", pronunciation: "/ˈɡærʊləs/", partOfSpeech: "adjective", category: "Social", definition: "Excessively talkative, especially on trivial matters.", etymology: "Latin garrire (to chatter, to twitter like birds) + -ulous → garrulus → garrulous. Root garr- is onomatopoeic — the chattering sound itself. Also in: garrulity, garble (to distort speech).", example: "The garrulous barber turned every haircut into a two-hour lecture on his nephew's football ambitions." },
  { level: 1, word: "Sullen", pronunciation: "/ˈsʌlən/", partOfSpeech: "adjective", category: "Emotions", definition: "Bad-tempered and silently resentful; moody and withdrawn.", etymology: "Anglo-French solein (alone, singular) from Latin solus (alone) → sullen. Root sol- means 'alone'. Also in: solo, solitary, sole, desolate, solitude — all suggesting aloneness.", example: "He arrived sullen and sat in the corner, resisting every attempt at conversation until the cake appeared." },
  { level: 1, word: "Dauntless", pronunciation: "/ˈdɔːntləs/", partOfSpeech: "adjective", category: "Character", definition: "Showing fearlessness and determination; impossible to intimidate.", etymology: "Old French danter (to tame, subdue) from Latin domitare (to tame) + -less → dauntless. Root domt-/daunt- means 'to tame'. Also in: daunt, indomitable (unable to be tamed), dominate, domain.", example: "The dauntless climber pressed on through the whiteout, certain the summit was just an hour ahead." },

  // ── LEVEL 2 ──────────────────────────────────────────────────────────────
  { level: 2, word: "Laconic", pronunciation: "/ləˈkɒnɪk/", partOfSpeech: "adjective", category: "Social", definition: "Using very few words; brief to the point of seeming rude or mysterious.", etymology: "Greek Lakon (a Spartan, inhabitant of Laconia) → lakonikos → laconic. Spartans were famous for blunt, minimal speech. A place-name becoming a word-type, like 'solecism'. Also in: laconism, laconically.", example: "When asked how the battle had gone, the general's laconic reply was a single raised eyebrow." },
  { level: 2, word: "Ennui", pronunciation: "/ˈɒnwiː/", partOfSpeech: "noun", category: "Emotions", definition: "A feeling of listlessness and dissatisfaction arising from lack of occupation or excitement; world-weariness.", etymology: "Old French enui (annoyance) from Latin in odio esse (to be hateful) from odium (hatred) → ennui. Root od- means 'hate'. Also in: odious, odium, annoy (same Latin root via French).", example: "The ennui of her third week in the beachside resort was complete — sun and cocktails had lost all meaning." },
  { level: 2, word: "Wistful", pronunciation: "/ˈwɪstf(ə)l/", partOfSpeech: "adjective", category: "Emotions", definition: "Having or showing a feeling of vague or regretful longing.", etymology: "Possibly from whist (silent, attentive) + -ful, influenced by wishful. Root wist- may relate to Germanic wissen (to know) — the sadness of knowing what's gone. Also in: wishful, wistfully, listless (same mood, different root).", example: "She looked at the photograph with wistful eyes, recognising her younger self without quite claiming her." },
  { level: 2, word: "Blithe", pronunciation: "/blʌɪð/", partOfSpeech: "adjective", category: "Emotions", definition: "Showing a casual and cheerful indifference; carefree and lighthearted.", etymology: "Old English blīþe (joyful, cheerful, kind) from Proto-Germanic blithiz. Root blith- means 'gentle/joyful'. Also in: bliss (same Germanic root), blithely, blissful.", example: "He signed the contract with blithe disregard for the small print, and regretted it thoroughly by Thursday." },
  { level: 2, word: "Tenuous", pronunciation: "/ˈtɛnjʊəs/", partOfSpeech: "adjective", category: "Intelligence", definition: "Very weak or slight; lacking substance; too thin to hold together.", etymology: "Latin tenuis (thin, fine, slight) + -ous → tenuous. Root ten- means 'thin/stretched'. Also in: attenuate (to thin out), extenuate (to stretch out, make thinner — hence lesser), thin (Germanic cognate).", example: "The connection between the two crimes was tenuous at best — a colour, a calendar date, and nothing more." },
  { level: 2, word: "Volition", pronunciation: "/vəˈlɪʃ(ə)n/", partOfSpeech: "noun", category: "Character", definition: "The faculty or power of using one's will; a conscious choice or decision.", etymology: "Latin velle (to wish, to will) → volitio → volition. Root vol- means 'to will/wish'. Also in: volunteer (one who wills), benevolent (well-wishing), malevolent, involuntary.", example: "She left the company entirely of her own volition — no redundancy, no crisis, just a quiet decision to go." },
  { level: 2, word: "Hapless", pronunciation: "/ˈhapləs/", partOfSpeech: "adjective", category: "Emotions", definition: "Unlucky; unfortunate; having no luck.", etymology: "Old Norse happ (luck, chance) + -less → hapless. Root happ- means 'luck/fortune'. Also in: happy (originally 'lucky'), happen (to come by chance), mishap, haphazard, perhaps.", example: "The hapless tourist had lost his passport, his wallet, and his return ticket all in the same afternoon." },
  { level: 2, word: "Verdant", pronunciation: "/ˈvɜːd(ə)nt/", partOfSpeech: "adjective", category: "Nature", definition: "Green with grass or other rich vegetation; lush and growing.", etymology: "Old French verd (green) from Latin viridis (green) → verdant. Root virid-/verd- means 'green'. Also in: verdigris (green of Greece), verdure (lush greenness), vert (heraldic green), viridian.", example: "After a week of rain the valley was astonishingly verdant, every hillside bright as stained glass." },
  { level: 2, word: "Fervent", pronunciation: "/ˈfɜːv(ə)nt/", partOfSpeech: "adjective", category: "Emotions", definition: "Having or displaying passionate intensity of feeling.", etymology: "Latin fervere (to boil, to be hot) → fervens → fervent. Root ferv- means 'to boil'. Also in: fervour, ferment, effervescent (ex + fervere = boiling out), fever (related Germanic root).", example: "His fervent belief in the project carried the whole team through six months of setbacks and budget cuts." },
  { level: 2, word: "Penurious", pronunciation: "/pɪˈnjʊəriəs/", partOfSpeech: "adjective", category: "Character", definition: "Extremely poor; characterized by poverty; excessively unwilling to spend money.", etymology: "Latin penuria (want, scarcity) from pene (almost) + -uria (lacking) → penuriosus → penurious. Root pen-/penu- means 'scarcity'. Also in: penury (extreme poverty), paene (almost) — same prefix as peninsula, penumbra.", example: "The penurious scholar lived on lentils and library books, and considered this a perfectly reasonable arrangement." },

  // ── LEVEL 3 ──────────────────────────────────────────────────────────────
  { level: 3, word: "Mendacious", pronunciation: "/mɛnˈdeɪʃəs/", partOfSpeech: "adjective", category: "Character", definition: "Not telling the truth; lying habitually; given to falsehood.", etymology: "Latin mendax, mendacis (lying) from mendum (fault, error) → mendacious. Root mend- means 'fault/defect'. Also in: mendacity, emend (to correct faults), amend (to remove defects), mend (to fix).", example: "The memoir was exposed as mendacious — the author had placed herself at events she had only read about." },
  { level: 3, word: "Lurid", pronunciation: "/ˈlʊərɪd/", partOfSpeech: "adjective", category: "Perception", definition: "Unpleasantly bright or vivid; sensationally shocking; ghastly in colour.", etymology: "Latin luridus (pale yellow, wan, ghastly) from luror (a yellowish pallor) → lurid. Root lur- suggests sickly or ghastly light. Ancient meaning was pallid; the modern sense shifted toward garish.", example: "The tabloid ran the story under a lurid headline that bore almost no relation to the actual events." },
  { level: 3, word: "Ruminate", pronunciation: "/ˈruːmɪneɪt/", partOfSpeech: "verb", category: "Intelligence", definition: "To think deeply and at length; (of cattle) to chew the cud.", etymology: "Latin rumen (the throat, the first stomach of a cud-chewing animal) → ruminare (to chew the cud) → ruminate. Root rumin- means 'throat/gullet'. Also in: rumination, ruminant (cud-chewing mammal), ruminative.", example: "She sat ruminating over the letter for an hour before she understood what it was actually saying." },
  { level: 3, word: "Diaphanous", pronunciation: "/dʌɪˈæfənəs/", partOfSpeech: "adjective", category: "Perception", definition: "Light, delicate, and translucent; almost see-through.", etymology: "Greek dia- (through) + phainein (to show, to appear) → diaphanes → diaphanous. Root phain- means 'to show/appear'. Also in: phenomenon, emphasis, phase, fantasy, apophenia.", example: "She wore a diaphanous scarf that floated behind her in the sea breeze like a second shadow." },
  { level: 3, word: "Trepidation", pronunciation: "/ˌtrɛpɪˈdeɪʃ(ə)n/", partOfSpeech: "noun", category: "Emotions", definition: "A feeling of fear or agitation about something that may happen; trembling apprehension.", etymology: "Latin trepidare (to tremble, to be alarmed) + -tion → trepidatio → trepidation. Root trepid- means 'to tremble'. Also in: intrepid (not trembling, hence fearless), trepid (rare: timid), trepidatious.", example: "She opened the test results with considerable trepidation, having spent a week imagining every possible outcome." },
  { level: 3, word: "Prodigious", pronunciation: "/prəˈdɪdʒəs/", partOfSpeech: "adjective", category: "Perception", definition: "Remarkably great in extent, size, or degree; impressively enormous.", etymology: "Latin prodigium (a portent, an omen, something unnatural) → prodigiosus → prodigious. Root prodig- means 'an extraordinary sign'. Also in: prodigy (a wondrous person or thing), prodigal (wastefully extraordinary in spending).", example: "The young pianist showed prodigious talent — performing Chopin at eight with the memory and feel of a veteran." },
  { level: 3, word: "Incandescent", pronunciation: "/ˌɪnkænˈdɛs(ə)nt/", partOfSpeech: "adjective", category: "Perception", definition: "Emitting bright light as a result of intense heat; or extremely angry or brilliant.", etymology: "Latin in- (in) + candere (to glow, to be white-hot) → incandescere → incandescent. Root cand- means 'to glow white'. Also in: candid (white/sincere), candidate (white toga), candle, candour.", example: "The director was incandescent when she discovered the entire set had been painted the wrong shade of blue." },
  { level: 3, word: "Lassitude", pronunciation: "/ˈlæsɪtjuːd/", partOfSpeech: "noun", category: "Emotions", definition: "Physical or mental weariness; lack of energy; languid fatigue.", etymology: "Latin lassus (weary, tired) + -tudo (state of) → lassitudo → lassitude. Root lass- means 'weary'. Also in: alas (an exclamation of weariness or grief), lax (loose, weary), relax.", example: "A strange lassitude descended after the exam results — weeks of urgency vanished in a single afternoon." },
  { level: 3, word: "Sanguinary", pronunciation: "/ˈsæŋɡwɪn(ə)ri/", partOfSpeech: "adjective", category: "Nature", definition: "Involving or causing much bloodshed; bloodthirsty; bloody.", etymology: "Latin sanguis, sanguinis (blood) + -ary → sanguinarius → sanguinary. Root sanguin- means 'blood'. Also in: sanguine (blood-optimism from humour theory), consanguineous (of one blood), haemorrhage (Greek haima = blood).", example: "The battle was sanguinary beyond anything the commanders had anticipated — the field unrecognisable by dusk." },
  { level: 3, word: "Tortuous", pronunciation: "/ˈtɔːtʃʊəs/", partOfSpeech: "adjective", category: "Nature", definition: "Full of twists and turns; complex and indirect; deviously intricate.", etymology: "Latin torquere (to twist) → tortuosus → tortuous. Root tort-/torqu- means 'to twist'. Also in: torture (twisting pain), torque, contort, extort (to twist out of someone), distort, retort.", example: "The tortuous mountain road required full attention — hairpin after hairpin with a sheer drop on one side." },

  // ── LEVEL 4 ──────────────────────────────────────────────────────────────
  { level: 4, word: "Ineffable", pronunciation: "/ɪnˈɛfəb(ə)l/", partOfSpeech: "adjective", category: "Perception", definition: "Too great or extreme to be expressed in words; inexpressible and beyond language.", etymology: "Latin in- (not) + effabilis (that can be spoken) from ex- (out) + fari (to speak) → ineffabilis → ineffable. Root fa-/phat- means 'to speak'. Also in: fable, infant (unable to speak), famous, fate (what is spoken by the gods).", example: "The view from the ridge at first light produced an ineffable feeling that no photograph could hold." },
  { level: 4, word: "Pernicious", pronunciation: "/pəˈnɪʃəs/", partOfSpeech: "adjective", category: "Character", definition: "Having a harmful effect, especially in a gradual or subtle way; insidiously destructive.", etymology: "Latin pernicies (destruction, ruin) from per- (through) + nex, necis (death) → perniciosus → pernicious. Root nec-/nex- means 'death'. Also in: necromancy, internecine (mutually deadly), perniciousness.", example: "The pernicious rumour spread quietly through the office for months before anyone traced it to its source." },
  { level: 4, word: "Obsequious", pronunciation: "/əbˈsiːkwɪəs/", partOfSpeech: "adjective", category: "Social", definition: "Obedient or attentive to an excessive degree; fawningly compliant.", etymology: "Latin obsequi (to comply with, to follow) from ob- (toward) + sequi (to follow) → obsequiosus → obsequious. Root sequ- means 'to follow'. Also in: sequence, consequence, sequel, subsequent, obsequies (funeral rites).", example: "The obsequious assistant agreed with everything the boss said, even when the boss contradicted himself twice in one sentence." },
  { level: 4, word: "Contrite", pronunciation: "/ˈkɒntrʌɪt/", partOfSpeech: "adjective", category: "Emotions", definition: "Feeling or expressing deep remorse; affected by guilt for having done wrong.", etymology: "Latin conterere (to grind, to bruise) from con- (completely) + terere (to rub, grind) → contritus → contrite. Root ter- means 'to rub/grind'. Also in: trite (worn smooth by overuse), attrition, detriment.", example: "He arrived at the door contrite and carrying flowers, which she accepted without comment." },
  { level: 4, word: "Inured", pronunciation: "/ɪˈnjʊəd/", partOfSpeech: "adjective", category: "Character", definition: "Accustomed to something unpleasant through long exposure; hardened or desensitised.", etymology: "Old French en oeuvre (in use, in operation) → ure (use, practice) → inure. Root ure/oper- means 'work/use'. Also in: manure (literally 'hand-work', turning soil), operate, opus, opera.", example: "After two winters on the trawler, he was thoroughly inured to cold — indifferent to weather that stopped other people entirely." },
  { level: 4, word: "Paucity", pronunciation: "/ˈpɔːsɪti/", partOfSpeech: "noun", category: "Time", definition: "The presence of something only in small or insufficient quantities; scarcity.", etymology: "Latin paucus (few, little) + -ity → paucitas → paucity. Root pauc- means 'few'. Also in: pauper (one with few resources), few (Germanic cognate), poco (Italian: little), pauciloquent (using few words).", example: "The report highlighted a paucity of evidence for the claims — three footnotes citing a single discredited study." },
  { level: 4, word: "Munificent", pronunciation: "/mjuːˈnɪfɪs(ə)nt/", partOfSpeech: "adjective", category: "Character", definition: "Very generous; larger or more elaborate than necessary; lavishly bountiful.", etymology: "Latin munus (gift, duty) + facere (to make) → munificus → munificent. Root mun- means 'gift/duty'. Also in: municipal (civic duty), munitions (public supplies), community (shared duty), immune (exempt from duty).", example: "The munificent bequest funded the library wing, the scholarship endowment, and the new roof, with money left over." },
  { level: 4, word: "Dissemble", pronunciation: "/dɪˈsɛmb(ə)l/", partOfSpeech: "verb", category: "Character", definition: "To conceal one's true motives, feelings, or beliefs; to behave hypocritically.", etymology: "Latin dissimulare (to hide, to disguise) from dis- (apart) + simulare (to pretend, make like) → dissemble. Root simul- means 'to copy/make like'. Also in: simulate, simultaneous, semblance, similar, assemble.", example: "She managed to dissemble perfectly through the interview, betraying nothing of the fact she had already accepted another offer." },
  { level: 4, word: "Florid", pronunciation: "/ˈflɒrɪd/", partOfSpeech: "adjective", category: "Perception", definition: "Elaborately intricate and ornate; (of a complexion) ruddy; excessively flowery in style.", etymology: "Latin flos, floris (flower) + -id → floridus → florid. Root flor- means 'flower'. Also in: flora, floral, flourish (to flower), Florida (the 'flowery' land), flour (the finest flower of ground wheat).", example: "His prose style was florid to the point of parody — six adjectives where two would have served." },
  { level: 4, word: "Execrable", pronunciation: "/ˈɛksɪkrəb(ə)l/", partOfSpeech: "adjective", category: "Perception", definition: "Extremely bad or unpleasant; deserving to be cursed; detestably poor in quality.", etymology: "Latin ex- (out) + sacrare (to curse, to make sacred) → exsecrari (to curse) → execrabilis → execrable. Root sacr- means 'sacred/holy'. Also in: sacred, consecrate, desecrate, execrate (to curse), sacrament.", example: "The wine was execrable — thin, vinegary, and served at a temperature appropriate for consommé." },

  // ── LEVEL 5 ──────────────────────────────────────────────────────────────
  { level: 5, word: "Immutable", pronunciation: "/ɪˈmjuːtəb(ə)l/", partOfSpeech: "adjective", category: "Time", definition: "Unchanging over time or unable to be changed; fixed and permanent.", etymology: "Latin in- (not) + mutare (to change) → immutabilis → immutable. Root mut- means 'to change'. Also in: mutate, mutation, permutation (a thorough change), commute (to change one thing for another), transmute.", example: "She treated the lunchtime seating arrangement as immutable law, and woe to anyone who tried to rearrange it." },
  { level: 5, word: "Taciturn", pronunciation: "/ˈtæsɪtɜːn/", partOfSpeech: "adjective", category: "Social", definition: "Reserved or uncommunicative in speech; saying little; habitually silent.", etymology: "Latin tacere (to be silent) → taciturnus → taciturn. Root tac- means 'to be silent'. Also in: tacit (implied without being stated), reticent (keeping silence back), taciturnity.", example: "The new partner was profoundly taciturn in meetings but always submitted the clearest written analysis by Friday." },
  { level: 5, word: "Nugatory", pronunciation: "/ˈnjuːɡətəri/", partOfSpeech: "adjective", category: "Intelligence", definition: "Of no value or importance; useless and trifling; legally invalid.", etymology: "Latin nugari (to trifle, to play the fool) from nugae (trifles, jokes) → nugatorius → nugatory. Root nug- means 'trifle/nonsense'. Also in: nugacity (futility), nugacious (trivial). A vivid, rare root family.", example: "Three of the bill's seven clauses were struck down as nugatory — unenforceable and contradicting existing statutes." },
  { level: 5, word: "Abstruse", pronunciation: "/əbˈstruːs/", partOfSpeech: "adjective", category: "Intelligence", definition: "Difficult to understand; obscure and hard to follow; requiring deep study.", etymology: "Latin abstrudere (to thrust away, to conceal) from abs- (away) + trudere (to push) → abstrusus → abstruse. Root trud-/trus- means 'to push'. Also in: intrude (push in), extrude (push out), protrude, obtrude.", example: "The lecture was so abstruse that only three of the forty attendees could follow it past the introduction." },
  { level: 5, word: "Hypnagogic", pronunciation: "/ˌhɪpnəˈɡɒdʒɪk/", partOfSpeech: "adjective", category: "Perception", definition: "Relating to the transitional state immediately before falling asleep; of the threshold between waking and sleep.", etymology: "Greek hypnos (sleep) + agogos (leading) from agein (to lead) → hypnagogic. Root hypn- means 'sleep'. Also in: hypnosis, hypnotic, Hypnos (Greek god of sleep). Root agog-/ag- means 'to lead'.", example: "In the hypnagogic moments before sleep, whole symphonies sometimes played themselves out in his head." },
  { level: 5, word: "Inimitable", pronunciation: "/ɪˈnɪmɪtəb(ə)l/", partOfSpeech: "adjective", category: "Perception", definition: "So good or unusual as to be impossible to copy; unique and matchless.", etymology: "Latin in- (not) + imitari (to imitate, to copy) → inimitabilis → inimitable. Root imit- means 'to copy'. Also in: imitate, imitation, imitative, mime (Greek cognate: mimos = imitator).", example: "She had an inimitable way of summarising a three-hour meeting in one sentence that everyone immediately agreed was correct." },
  { level: 5, word: "Cadence", pronunciation: "/ˈkeɪd(ə)ns/", partOfSpeech: "noun", category: "Art", definition: "A modulation or inflection of the voice; the beat or measure of something rhythmic; a falling close.", etymology: "Latin cadere (to fall) → cadentia (a falling) → cadence. Root cad-/cas- means 'to fall'. Also in: case, casual, occasion, accident, decadence (a falling down), cascade.", example: "There was a cadence to her speech — a rise and fall that made even bus directions sound like poetry." },
  { level: 5, word: "Morbid", pronunciation: "/ˈmɔːbɪd/", partOfSpeech: "adjective", category: "Emotions", definition: "Having an unusual interest in disturbing or gloomy subjects; relating to disease.", etymology: "Latin morbus (disease, sickness) + -id → morbidus → morbid. Root morb- means 'disease'. Also in: morbidity, morbific (causing disease), comorbid (simultaneous conditions), morbus (medical Latin for disease).", example: "She had a cheerfully morbid streak — planning her own funeral playlist and finding it a calming exercise." },
  { level: 5, word: "Surreptitious", pronunciation: "/ˌsʌrəpˈtɪʃəs/", partOfSpeech: "adjective", category: "Character", definition: "Kept secret, especially because it would not be approved; done by stealth.", etymology: "Latin sub- (under) + rapere (to seize) → surripere (to seize secretly) → surreptitius → surreptitious. Root rap-/rept- means 'to seize'. Also in: rapacious, rapture, rapid (seizing speed), enrapture.", example: "He took a surreptitious photograph of the document and forwarded it to a journalist before anyone noticed." },
  { level: 5, word: "Pell-mell", pronunciation: "/ˌpɛlˈmɛl/", partOfSpeech: "adverb/adjective", category: "Social", definition: "In a confused, rushed, or disorderly manner; headlong and recklessly.", etymology: "French pêle-mêle (mixed-up, confused) from Old French mesler (to mix) with reduplication → pell-mell. Root mêl-/mel- means 'to mix'. Also in: meddle, medley, melee, mélange — all from the same 'mixing' root.", example: "The fire alarm cleared the building pell-mell, sending five hundred people into the courtyard in coats and confusion." },

  // ── LEVEL 6 ──────────────────────────────────────────────────────────────
  { level: 6, word: "Philippic", pronunciation: "/fɪˈlɪpɪk/", partOfSpeech: "noun", category: "Social", definition: "A bitter verbal attack or denunciation; an impassioned invective speech.", etymology: "Greek Philippos (Philip, father of Alexander the Great) → Philippika (Demosthenes' orations against Philip of Macedon). A proper name become a common noun. Root phil- means 'love'; hippos means 'horse' — Philip = lover of horses.", example: "The departing editor published a philippic against press ownership that named every proprietor by name." },
  { level: 6, word: "Obstreperous", pronunciation: "/əbˈstrɛpərəs/", partOfSpeech: "adjective", category: "Social", definition: "Noisy and difficult to control; loudly and stubbornly unruly.", etymology: "Latin ob- (against) + strepere (to make noise, to rattle) → obstreperus → obstreperous. Root strep- means 'to make a noise'. Also in: strepitous (noisy), strepitus (a clatter or din), strepitation.", example: "The obstreperous toddler refused all restraint, pulling her hand free and sprinting toward the ornamental pond." },
  { level: 6, word: "Vertiginous", pronunciation: "/vɜːˈtɪdʒɪnəs/", partOfSpeech: "adjective", category: "Perception", definition: "Causing or suffering from dizziness; extremely high or steep; whirling.", etymology: "Latin vertere (to turn) → vertigo (a spinning, dizziness) → vertiginosus → vertiginous. Root vert-/vers- means 'to turn'. Also in: verse (a turning of a line), university, convert, divert, subvert, revert.", example: "The vertiginous drop from the cliff path made even the most experienced walker hug the inner wall." },
  { level: 6, word: "Lachrymose", pronunciation: "/ˈlækrɪməʊs/", partOfSpeech: "adjective", category: "Emotions", definition: "Tearful or given to weeping; inducing tears; mournfully sentimental.", etymology: "Latin lacrima (a tear) + -ose → lacrimosus → lachrymose. Root lacrima means 'tear'. Also in: lacrimation (the production of tears), lachrymatory (a vessel for tears, found in Roman tombs), Lacrimosa (section of the Requiem Mass).", example: "The film was lachrymose in the extreme — she used her entire travel packet of tissues before the credits." },
  { level: 6, word: "Denouement", pronunciation: "/deɪˈnuːmɒ̃/", partOfSpeech: "noun", category: "Art", definition: "The final part of a narrative in which things are resolved; the outcome of a complex sequence of events.", etymology: "French dénouer (to unknot) from dé- (un-) + nouer (to knot) from Latin nodus (knot) → dénouement. Root nod- means 'knot'. Also in: node, nodule, connect, annex (a knotting-on).", example: "The novel's denouement arrived in a single paragraph — understated and devastating in equal measure." },
  { level: 6, word: "Recidivism", pronunciation: "/rɪˈsɪdɪvɪz(ə)m/", partOfSpeech: "noun", category: "Character", definition: "The tendency of a convicted criminal to reoffend; relapse into undesirable behaviour.", etymology: "Latin recidivus (falling back) from re- (back) + cadere (to fall) → recidivist → recidivism. Root cad-/cid- means 'to fall'. Also in: accident (falling toward), incident, coincide, cascade, cadence.", example: "The charity tackled the root causes of crime rather than incarceration alone, which did little to reduce recidivism." },
  { level: 6, word: "Tendentious", pronunciation: "/tɛnˈdɛnʃəs/", partOfSpeech: "adjective", category: "Intelligence", definition: "Promoting a particular cause or viewpoint; not impartial; slanted in a particular direction.", etymology: "Medieval Latin tendentia (tendency) from Latin tendere (to stretch, to aim toward) → tendentious. Root tend- means 'to stretch'. Also in: tend, tension, extend, contend, attend, tendon.", example: "The commission's report was tendentious — three pages of caveats burying the one conclusion that mattered." },
  { level: 6, word: "Mutable", pronunciation: "/ˈmjuːtəb(ə)l/", partOfSpeech: "adjective", category: "Time", definition: "Liable to change; inconsistent and fickle; subject to alteration.", etymology: "Latin mutare (to change) → mutabilis → mutable. Root mut- means 'to change'. Also in: mutate, mutation, commute, permute, transmute, immutable (unchanging — Level 5's opposite).", example: "His opinions were famously mutable — strong one Tuesday and entirely reversed by the following Monday." },
  { level: 6, word: "Otiose", pronunciation: "/ˈəʊʃiəʊs/", partOfSpeech: "adjective", category: "Character", definition: "Serving no practical purpose; futile and pointless; (of a person) idle and indolent.", etymology: "Latin otium (leisure, idleness) → otiosus → otiose. Root oti- means 'leisure'. Also in: negotium (neg- = not + otium = not-leisure = business) → negotiate. Otium was the Romans' valued leisure; negotium its opposite.", example: "Three of the report's recommendations were otiose — they described what was already happening." },
  { level: 6, word: "Dilatory", pronunciation: "/ˈdɪlət(ə)ri/", partOfSpeech: "adjective", category: "Time", definition: "Slow to act; intended to cause delay; habitually behind; procrastinating.", etymology: "Latin dilatus (deferred) from dis- (apart) + latus (carried, past participle of tollere/ferre) → dilatorius → dilatory. Root lat-/latus means 'carried'. Also in: legislate (to carry laws), translate, relate, collate.", example: "His dilatory approach to replying to emails meant that several opportunities simply expired while he deliberated." },

  // ── LEVEL 7 ──────────────────────────────────────────────────────────────
  { level: 7, word: "Atavistic", pronunciation: "/ˌætəˈvɪstɪk/", partOfSpeech: "adjective", category: "Nature", definition: "Relating to reversion to something ancient or ancestral; of primitive instincts resurfacing.", etymology: "Latin atavus (great-great-great-grandfather, ancestor) from at- (beyond) + avus (grandfather) → atavism → atavistic. Root av- means 'grandfather/ancestor'. Also in: avuncular (of an uncle — from avus), avus itself.", example: "There was something atavistic in the way the crowd fell silent at the cliff edge — a very old fear." },
  { level: 7, word: "Uxorious", pronunciation: "/ʌkˈsɔːriəs/", partOfSpeech: "adjective", category: "Social", definition: "Having or showing an excessive or submissive fondness for one's wife.", etymology: "Latin uxor (wife) + -ious → uxorius → uxorious. Root uxor- means 'wife'. Also in: uxoricide (killing of a wife), uxorial (of or relating to a wife), uxoriously.", example: "His uxorious devotion was touching until it became apparent that he couldn't make any decision without her approval." },
  { level: 7, word: "Ignominious", pronunciation: "/ˌɪɡnəˈmɪniəs/", partOfSpeech: "adjective", category: "Social", definition: "Deserving or causing public disgrace or shame; deeply humiliating.", etymology: "Latin in- (not) + gnomen/nomen (name, reputation) → ignominia → ignominious. Root nomin-/gnomen- means 'name'. Also in: nominal, nominate, nomenclature, ignominy, misnomer.", example: "The team's ignominious defeat — six goals, no possession — was replayed on sports shows for weeks." },
  { level: 7, word: "Capricious", pronunciation: "/kəˈprɪʃəs/", partOfSpeech: "adjective", category: "Emotions", definition: "Given to sudden, unpredictable changes of mood or behaviour; impulsive and arbitrary.", etymology: "Italian capriccio (a sudden start, a whim) possibly from capo (head) + riccio (hedgehog) — 'hair standing on end like a hedgehog' → capricious. Root capric- suggests a startled image. Also in: caprice, capriole.", example: "The weather was capricious — sunshine, hail, and warm drizzle all within a single afternoon." },
  { level: 7, word: "Fungible", pronunciation: "/ˈfʌndʒɪb(ə)l/", partOfSpeech: "adjective", category: "Intelligence", definition: "Interchangeable; (of goods or people) able to replace or be replaced by another identical item.", etymology: "Latin fungi (to perform, to enjoy) → fungibilis → fungible. Root fung- means 'to perform/discharge'. Also in: function, defunct (no longer functioning), perfunctory (performed merely as duty), fungicide.", example: "In his view, employees were fungible — each person just a replaceable unit performing a defined task." },
  { level: 7, word: "Recherché", pronunciation: "/rəˈʃɛʃeɪ/", partOfSpeech: "adjective", category: "Intelligence", definition: "Rare, exotic, or obscure; overly far-fetched or unusual to be of wide interest.", etymology: "French recherché (carefully sought out) from re- (again) + chercher (to seek) from Latin circare (to go round) → recherché. Root circum-/charch- means 'to go around/seek'. Also in: circle, search, research.", example: "His tastes ran to the recherché — wines from a single Slovenian hillside, operas performed once per decade." },
  { level: 7, word: "Sycophantic", pronunciation: "/ˌsɪkəˈfæntɪk/", partOfSpeech: "adjective", category: "Social", definition: "Behaving obsequiously toward someone powerful to gain advantage; fawningly complimentary.", etymology: "Greek sykon (fig) + phainein (to show) → sykophantes → sycophantic. Root phain- means 'to show/appear'. Also in: phenomenon, fantasy, diaphanous, emphasis.", example: "The sycophantic review called the album 'a masterpiece' before the journalist had clearly finished listening to it." },
  { level: 7, word: "Persiflage", pronunciation: "/ˈpɜːsɪflɑːʒ/", partOfSpeech: "noun", category: "Social", definition: "Light and slightly contemptuous mockery or banter; frivolous, empty talk.", etymology: "French persifler (to banter, to mock) from per- (through) + siffler (to whistle, to hiss) from Latin sibilare (to hiss) → persiflage. Root sibil- means 'to hiss'. Also in: sibilant (a hissing sound), sibilance.", example: "The dinner was enjoyable enough, though two hours of persiflage left her slightly empty — not a serious thought all evening." },
  { level: 7, word: "Divagate", pronunciation: "/ˈdʌɪvəɡeɪt/", partOfSpeech: "verb", category: "Intelligence", definition: "To stray from a subject; to wander or digress; to roam mentally.", etymology: "Latin di- (apart) + vagari (to wander) → divagatus → divagate. Root vag- means 'to wander'. Also in: vagrant, vague (wandering without fixity), extravagant (wandering beyond bounds), vagabond.", example: "The lecture had a tendency to divagate into unrelated anecdote — delightful, but the reading list remained uncovered." },
  { level: 7, word: "Fulgent", pronunciation: "/ˈfʌldʒ(ə)nt/", partOfSpeech: "adjective", category: "Perception", definition: "Gleaming brilliantly; radiantly and dazzlingly bright.", etymology: "Latin fulgere (to flash, to shine) → fulgens → fulgent. Root fulg- means 'to flash/shine'. Also in: fulgurant (lightning-like), effulge (to shine out), refulgent (shining back), fulguration (lightning used in surgery).", example: "The fulgent dome caught the last sun of the day and blazed above the darkening rooftops like a second star." },

  // ── LEVEL 8 ──────────────────────────────────────────────────────────────
  { level: 8, word: "Apocope", pronunciation: "/əˈpɒkəpi/", partOfSpeech: "noun", category: "Intelligence", definition: "The loss or omission of one or more sounds or letters at the end of a word.", etymology: "Greek apo- (away from) + koptein (to cut) → apokopē → apocope. Root kop-/cop- means 'to cut'. Also in: syncope (cutting in the middle of a word), apostrophe (cutting away), cornucopia (horn of plenty — no relation).", example: "'Gym' for 'gymnasium' and 'ad' for 'advertisement' are apocope — the word trimmed from the tail." },
  { level: 8, word: "Eponymous", pronunciation: "/ɪˈpɒnɪməs/", partOfSpeech: "adjective", category: "Intelligence", definition: "Of or relating to the person after whom something is named; giving one's own name to something.", etymology: "Greek epi- (upon) + onyma/onoma (name) → eponymos → eponymous. Root onom-/onym- means 'name'. Also in: anonymous (without a name), synonym (same name), pseudonym (false name), patronymic.", example: "The eponymous hero of the novel appears only on page one and page four hundred — a ghost in his own story." },
  { level: 8, word: "Hyperbole", pronunciation: "/hʌɪˈpɜːbəli/", partOfSpeech: "noun", category: "Art", definition: "Exaggerated statements not meant to be taken literally; deliberate overstatement for rhetorical effect.", etymology: "Greek hyper- (over, beyond) + ballein (to throw) → hyperbolē → hyperbole. Root bol-/bal- means 'to throw'. Also in: parabola (thrown alongside), symbol (thrown together), metabolism (thrown beyond), problem (thrown before).", example: "Saying the queue at the post office was 'a thousand years long' is hyperbole, but she wasn't entirely wrong." },
  { level: 8, word: "Hiraeth", pronunciation: "/ˈhɪraɪθ/", partOfSpeech: "noun", category: "Emotions", definition: "A Welsh concept: homesickness for a home one cannot return to, or which may never have existed; grief for lost places.", etymology: "Welsh hir (long) + aeth (pain, grief, departure) → hiraeth. Root hir- means 'long'; aeth suggests departure or loss. A Welsh loanword adopted into English for a particular quality of longing without exact equivalent.", example: "The emigrant felt hiraeth so acutely that every landscape reminded him of the one he had left behind." },
  { level: 8, word: "Panegyric", pronunciation: "/ˌpænɪˈdʒɪrɪk/", partOfSpeech: "noun", category: "Social", definition: "A public speech or written text in praise of someone or something; an elaborate compliment.", etymology: "Greek pan- (all) + agyris (assembly) → panegyris (a public festival) → panegyrikos → panegyric. Root pan- means 'all'. Also in: pandemic, panorama, panacea, pantheon.", example: "The retirement dinner was pleasant, but the panegyric from his deputy went on for forty-five uncomfortable minutes." },
  { level: 8, word: "Frangible", pronunciation: "/ˈfrandʒɪb(ə)l/", partOfSpeech: "adjective", category: "Perception", definition: "Fragile; easily broken; capable of being shattered or destroyed.", etymology: "Latin frangere (to break) → frangibilis → frangible. Root frang-/fract- means 'to break'. Also in: fragment, fracture, fraction, infraction (a breaking of a rule), refractory (breaking back against control), refraction.", example: "The frangible bone china was packed in so much tissue that the box weighed more than its contents." },
  { level: 8, word: "Diapason", pronunciation: "/ˌdʌɪəˈpeɪz(ə)n/", partOfSpeech: "noun", category: "Art", definition: "The full compass of a musical instrument or voice; a rich, swelling burst of harmonious sound.", etymology: "Greek dia (through) + pason (all, feminine genitive plural of pas) → dia pason chordon (through all the strings) → diapason. Root pas-/pan- means 'all'. Also in: pandemic, panorama, panacea.", example: "When the organ reached full diapason, the stone walls of the cathedral seemed to vibrate in sympathetic resonance." },
  { level: 8, word: "Solecism", pronunciation: "/ˈsɒlɪsɪz(ə)m/", partOfSpeech: "noun", category: "Social", definition: "A grammatical mistake; an error in etiquette or a social blunder.", etymology: "Greek Soloi — a city in Cilicia whose inhabitants were thought to speak impure Greek → soloikismos → solecism. A place-name that became a category of error. Like 'philippic' (Philip) and 'laconic' (Laconia).", example: "Using 'literally' to mean 'figuratively' has gone from solecism to accepted usage in a single generation." },
  { level: 8, word: "Vellichor", pronunciation: "/ˈvɛlɪkɔː/", partOfSpeech: "noun", category: "Emotions", definition: "The strange wistfulness of used bookshops; the sense that a book contains a whole life that will outlast its reader.", etymology: "Coined by John Koenig (Dictionary of Obscure Sorrows). Possibly from vellum (scraped sheepskin — writing material) + ichor (the fluid of the gods in Greek myth). Root vell- relates to skin and writing; ichor suggests a liquid beyond the ordinary.", example: "She spent three hours in the shop suffering vellichor — every spine a life she could enter, none of them hers." },

  // ── LEVEL 9 ──────────────────────────────────────────────────────────────
  { level: 9, word: "Pareidolia", pronunciation: "/ˌpærɪˈdəʊliə/", partOfSpeech: "noun", category: "Intelligence", definition: "The tendency to perceive a specific, often meaningful image in a random or ambiguous visual pattern.", etymology: "Greek para- (beside, alongside) + eidolon (image, form) from eidos (form) → pareidolia. Root eid-/id- means 'form/image'. Also in: idol, eidetic (relating to memory images), kaleidoscope (beautiful form-viewer).", example: "Pareidolia explains the Virgin Mary in toast, the man in the moon, and every face glimpsed in a wood-grain panel." },
  { level: 9, word: "Quiddity", pronunciation: "/ˈkwɪdɪti/", partOfSpeech: "noun", category: "Intelligence", definition: "The essential nature of something; what makes a thing what it is; a trifling point or quibble.", etymology: "Medieval Latin quidditas (whatness) from Latin quid (what) → quiddity. Root quid means 'what'. Also in: quid pro quo (what for what), quibble (an evasion), quodlibet (what pleases — a philosophical disputation).", example: "The philosopher spent a career on the quiddity of redness — what makes a thing red rather than seeming red." },
  { level: 9, word: "Enchiridion", pronunciation: "/ˌɛnkɪˈrɪdiən/", partOfSpeech: "noun", category: "Intelligence", definition: "A handbook or manual; a small reference book for use at hand.", etymology: "Greek en- (in) + kheir (hand) + -idion (diminutive) → enkheirdion → enchiridion. Root kheir- means 'hand'. Also in: chirography (handwriting), chiropractor (hand-practitioner), surgery (kheir + ergon = hand-work).", example: "Epictetus's Enchiridion distils Stoic philosophy into fifty-three short passages — a handbook for enduring whatever arrives." },
  { level: 9, word: "Syzygy", pronunciation: "/ˈsɪzɪdʒi/", partOfSpeech: "noun", category: "Nature", definition: "A straight-line configuration of three celestial bodies; the conjunction or opposition of the moon with the sun.", etymology: "Greek syn- (together) + zygon (yoke) → syzygia → syzygy. Root zyg- means 'yoke'. Also in: zygote (yoked cells), zygoma (cheekbone — the yoking bone), azygous (without a yoke — unpaired).", example: "At syzygy the tidal forces are at their greatest — sun and moon aligned, pulling the sea into its highest reach." },
  { level: 9, word: "Velleity", pronunciation: "/vɛˈliːɪti/", partOfSpeech: "noun", category: "Emotions", definition: "A wish or inclination not strong enough to lead to action; the very lowest degree of volition.", etymology: "Latin velle (to wish, to will) → velleitatem → velleity. Root vel-/vol- means 'to will/wish'. Also in: volunteer, benevolent, malevolent, volition (the stronger form of this very impulse).", example: "He had a velleity to learn Japanese every January, which faded by February without a single lesson taken." },
  { level: 9, word: "Tergiversate", pronunciation: "/ˈtɜːdʒɪvəseɪt/", partOfSpeech: "verb", category: "Character", definition: "To make evasive or conflicting statements; to change sides repeatedly; to be deliberately ambiguous.", etymology: "Latin tergum (the back) + vertere (to turn) → tergiversari (to turn the back on, to evade) → tergiversate. Root terg- means 'back'; vers- means 'to turn'. Also in: verse, divert, revert, perverse, avert.", example: "The minister tergiversated so thoroughly through the interview that journalists filed three contradictory stories from the same quotes." },
  { level: 9, word: "Nescience", pronunciation: "/ˈnɛsiəns/", partOfSpeech: "noun", category: "Intelligence", definition: "Lack of knowledge or awareness; ignorance; the philosophical position that nothing can be known.", etymology: "Latin ne- (not) + scire (to know) → nescientia → nescience. Root sci- means 'to know'. Also in: science, conscience (knowing with oneself), omniscient (knowing everything), prescient (knowing before).", example: "His nescience of the city's street layout was absolute — he handed strangers his phone and asked them to type the address." },
  { level: 9, word: "Hendiadys", pronunciation: "/hɛnˈdʌɪədɪs/", partOfSpeech: "noun", category: "Art", definition: "A figure of speech in which two words joined by a conjunction express a single idea, where one modifies the other.", etymology: "Greek hen dia duoin (one through two) from hen (one) + dia (through) + duo (two) → hendiadys. Root du-/di- means 'two'. Also in: dual, duplicate, duel, binary, diploma (two-tablet document).", example: "'Nice and warm' is hendiadys for 'nicely warm' — Shakespeare used it constantly, 'sound and fury' being the most famous example." },
  { level: 9, word: "Limerence", pronunciation: "/ˈlɪmərəns/", partOfSpeech: "noun", category: "Emotions", definition: "The involuntary, obsessive state of being romantically infatuated with another person; consuming one-directional longing.", etymology: "Coined by psychologist Dorothy Tennov (1979) from an invented stem; no classical etymology. Rhymes with adherence and deference — a modern psychological coinage without ancient roots but widely adopted by scholars.", example: "What she had felt for him for two years was not love exactly but limerence — consuming, one-directional, and fading the moment he actually called." },
  { level: 9, word: "Apophthegm", pronunciation: "/ˈæpəθɛm/", partOfSpeech: "noun", category: "Intelligence", definition: "A pithy, instructive saying; a concise and memorable formulation of a truth; a maxim.", etymology: "Greek apo- (from, away) + phthengesthai (to utter, to speak out clearly) → apophthegma → apophthegm. Root phtheg- means 'to utter clearly'. Also in: diphthong (two sounds). Apo- also in: apocryphal, apotropaic.", example: "Churchill's apophthegms colonise conversations decades after his death — almost every witty saying gets attributed to him eventually." },

  // ── LEVEL 10 ─────────────────────────────────────────────────────────────
  { level: 10, word: "Kenopsia", pronunciation: "/kɛˈnɒpsiə/", partOfSpeech: "noun", category: "Emotions", definition: "The eerie, unsettling atmosphere of a place that is usually busy but is now empty — an abandoned school, a shuttered park.", etymology: "Greek kenos (empty) + opsis (sight, appearance) → kenopsia. Coined by John Koenig. Root ken-/keno- means 'empty'. Also in: cenotaph (empty tomb), kenosis (self-emptying). Root ops- means 'sight'. Also in: synopsis, autopsy.", example: "Walking through the exam hall after everyone had left, she felt kenopsia sharply — the desks still warm, the silence total." },
  { level: 10, word: "Haecceity", pronunciation: "/hɛkˈsiːɪti/", partOfSpeech: "noun", category: "Intelligence", definition: "The property that makes something the particular individual that it is; the 'thisness' of a thing as opposed to its qualities.", etymology: "Medieval Latin haecceitas (thisness) from Latin haec (this — feminine), coined by Duns Scotus. Root haec means 'this'. A scholastic philosophical coinage designed to be unique, with no wider root family.", example: "The haecceity of a person is what remains when all describable qualities are subtracted — the pure fact of being that one." },
  { level: 10, word: "Enantiodromia", pronunciation: "/ɪˌnæntiəˈdrəʊmiə/", partOfSpeech: "noun", category: "Time", definition: "The tendency of things to change into their opposites, especially in psychology; the principle that extremes flip.", etymology: "Greek enantios (opposite) + dromos (running, course) → enantiodromia. Root enanti- means 'opposite'. Root drom- means 'running'. Also in: dromedary (built for running), velodrome, hippodrome (horse-running).", example: "Jung saw enantiodromia everywhere — the rigid moralist who becomes a libertine, the zealot who loses faith entirely." },
  { level: 10, word: "Mimesis", pronunciation: "/mɪˈmiːsɪs/", partOfSpeech: "noun", category: "Art", definition: "Imitative representation of the world in art and literature; the action of mimicking; the fundamental artistic impulse.", etymology: "Greek mimesis (imitation) from mimeisthai (to imitate) from mimos (mime, imitator) → mimesis. Root mim- means 'to imitate'. Also in: mime, mimic, mimicry, onomatopoeia (sound-making mimesis).", example: "Aristotle held that mimesis was the basis of all art — that humans are the most imitative of animals and learn by copying." },
  { level: 10, word: "Phronesis", pronunciation: "/frɒˈniːsɪs/", partOfSpeech: "noun", category: "Intelligence", definition: "Practical wisdom; the Aristotelian virtue of knowing how to act well in a particular situation — wisdom in action, not in theory.", etymology: "Greek phronein (to think, to be minded) → phronesis. Root phron- means 'mind/practical thought'. Also in: phrenology (skull-thought study — same root, different ambition), schizophrenia (split-mind).", example: "Aristotle distinguished phronesis from theoretical wisdom — you might know all moral philosophy and still not know what to do right now." },
  { level: 10, word: "Paracosm", pronunciation: "/ˈpærəkɒz(ə)m/", partOfSpeech: "noun", category: "Intelligence", definition: "A detailed imaginary world created by a child; an elaborate private universe with its own geography, history, and inhabitants.", etymology: "Greek para- (beside, alongside) + kosmos (order, world) → paracosm. Coined by Ben Vincent (1976). Root kos-/cosm- means 'world/order'. Also in: cosmos, cosmopolitan, microcosm, cosmology.", example: "The Brontë children's paracosm — the shared world of Gondal — fed their writing for decades into adulthood." },
  { level: 10, word: "Apophasis", pronunciation: "/əˈpɒfəsɪs/", partOfSpeech: "noun", category: "Art", definition: "A rhetorical device in which one draws attention to something by claiming not to mention it; raising a subject by denying it.", etymology: "Greek apo- (away, off) + phanai (to speak) → apophasis. Root phan-/phat- means 'to speak'. Also in: apophatic (defining by negation), prophet (speaking before), aphasia (speechlessness), emphasis.", example: "'I won't even mention the emails' is apophasis — the speaker has, of course, just mentioned them with full effect." },
  { level: 10, word: "Plerosis", pronunciation: "/plɪˈrəʊsɪs/", partOfSpeech: "noun", category: "Intelligence", definition: "The process of filling in or completing; in philosophy, the realisation of potentiality into actuality.", etymology: "Greek plērōsis (filling, fullness) from plēroun (to fill) from plērēs (full) → plerosis. Root plēr- means 'full'. Also in: plethora (over-fullness), plenary (fully attended), replenish, complete, complement.", example: "The director saw the final cut not as a finished object but as a plerosis — the gradual filling of a shape she'd seen from the start." },
  { level: 10, word: "Apocatastasis", pronunciation: "/ˌæpəˌkætəˈsteɪsɪs/", partOfSpeech: "noun", category: "Time", definition: "The restoration of all things to their original state; in theology, the ultimate reconciliation of all souls with God.", etymology: "Greek apo- (back) + kathistanai (to restore) from kata- (down) + histanai (to stand) → apokatastasis. Root sta-/stasis means 'to stand'. Also in: static, ecstasy (ex + stasis), apostasy, statue, establish.", example: "Origen's doctrine of apocatastasis was declared heretical — the idea that even demons would be returned to God proved too hopeful for the Church." },
  { level: 10, word: "Palingenesis", pronunciation: "/ˌpælɪnˈdʒɛnɪsɪs/", partOfSpeech: "noun", category: "Time", definition: "Rebirth or regeneration; the recurrence of ancestral characteristics; rebirth of a nation or civilisation.", etymology: "Greek palin (again) + genesis (origin, birth) → palingenesis. Root palin- means 'again/back' (also in palindrome, palimpsest). Root gen- means 'birth/origin'. Also in: genesis, generate, genus, gene.", example: "Some political movements promise national palingenesis — a rebirth of former greatness through collective will and sacrifice." },
  { level: 8, word: "Heterodoxy", pronunciation: "/ˈhɛtərədɒksi/", partOfSpeech: "noun", category: "Intelligence", definition: "The holding of opinions at variance with accepted or established doctrine; the state of being unorthodox.", etymology: "Greek heteros (other, different) + doxa (opinion, glory) → heterodoxia → heterodoxy. Root heter- means 'other'. Also in: heterogeneous, heterodox. Root dox- means 'opinion'. Also in: orthodox (right opinion), paradox, doxology.", example: "Her heterodoxy on urban planning was mocked at conferences and implemented in five cities a decade later." },
];

const LEVELS = [1,2,3,4,5,6,7,8,9,10];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const levelColors = {
  1: "#6B9E78", 2: "#5B8FA8", 3: "#A67C52",
  4: "#7B6FA0", 5: "#C97B4B", 6: "#3D7A6A",
  7: "#7A3D5C", 8: "#4D6FA8", 9: "#8A4D3D",
  10: "#2E2E2E",
};

const levelLabels = {
  1: "Foundational", 2: "Developing", 3: "Expanding",
  4: "Intermediate", 5: "Proficient", 6: "Advanced",
  7: "Scholarly", 8: "Erudite", 9: "Arcane",
  10: "Lexical Mastery",
};

export default function VocabLearner() {
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [mode, setMode] = useState("browse");
  const [cards, setCards] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showEtymology, setShowEtymology] = useState(false);
  const [quizPhase, setQuizPhase] = useState("question");
  const [quizOptions, setQuizOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showScore, setShowScore] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [screen, setScreen] = useState("home"); // home | learn

  const filteredWords = selectedLevel === "All"
    ? WORD_BANK
    : WORD_BANK.filter(w => w.level === Number(selectedLevel));

  const resetSession = useCallback((words) => {
    const shuffled = shuffle(words);
    setCards(shuffled);
    setCurrentIdx(0);
    setFlipped(false);
    setShowEtymology(false);
    setQuizPhase("question");
    setSelectedAnswer(null);
    setScore({ correct: 0, total: 0 });
    setShowScore(false);
    setStreak(0);
  }, []);

  const startSession = (level, m) => {
    setSelectedLevel(level);
    setMode(m);
    const words = level === "All" ? WORD_BANK : WORD_BANK.filter(w => w.level === Number(level));
    resetSession(words);
    setScreen("learn");
  };

  const current = cards[currentIdx];

  const generateOptions = useCallback((correctWord) => {
    const pool = selectedLevel === "All"
      ? WORD_BANK
      : WORD_BANK.filter(w => w.level === Number(selectedLevel));
    const distractors = shuffle(pool.filter(w => w.word !== correctWord.word)).slice(0, 3);
    return shuffle([correctWord, ...distractors]);
  }, [selectedLevel]);

  useEffect(() => {
    if (mode === "quiz" && current) {
      setQuizOptions(generateOptions(current));
    }
  }, [currentIdx, mode, current, generateOptions]);

  const nextCard = () => {
    if (currentIdx + 1 >= cards.length) {
      setShowScore(true);
    } else {
      setCurrentIdx(i => i + 1);
      setFlipped(false);
      setShowEtymology(false);
      setQuizPhase("question");
      setSelectedAnswer(null);
    }
  };

  const prevCard = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
      setFlipped(false);
      setShowEtymology(false);
    }
  };

  const handleAnswer = (option) => {
    if (quizPhase === "result") return;
    setSelectedAnswer(option);
    setQuizPhase("result");
    const isCorrect = option.word === current.word;
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    setBestStreak(s => Math.max(s, newStreak));
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
  };

  const accent = selectedLevel === "All" ? "#2E2E2E" : levelColors[Number(selectedLevel)] || "#2E2E2E";

  // ── HOME SCREEN ──────────────────────────────────────────────────────────
  if (screen === "home") {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F4EF", fontFamily: "'Georgia', serif", color: "#1A1A1A" }}>
        <div style={{ background: "#1A1A1A", padding: "24px 20px 20px" }}>
          <div style={{ color: "#F7F4EF", fontSize: "26px", fontWeight: "bold", letterSpacing: "0.5px" }}>Lexicon</div>
          <div style={{ color: "#888", fontSize: "11px", fontFamily: "sans-serif", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "3px" }}>100 Words · 10 Levels · Etymology</div>
        </div>

        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "20px 16px" }}>
          {/* Quick start all */}
          <div style={{ background: "#1A1A1A", borderRadius: "14px", padding: "20px", marginBottom: "20px", display: "flex", gap: "10px", flexDirection: "column" }}>
            <div style={{ color: "#F7C873", fontFamily: "sans-serif", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase" }}>Quick Start</div>
            <div style={{ color: "#F7F4EF", fontSize: "18px", fontWeight: "bold" }}>All 100 Words</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => startSession("All", "browse")} style={{ flex: 1, padding: "11px", border: "2px solid #444", borderRadius: "9px", background: "transparent", color: "#F7F4EF", cursor: "pointer", fontFamily: "sans-serif", fontSize: "13px", fontWeight: "600" }}>📖 Flashcards</button>
              <button onClick={() => startSession("All", "quiz")} style={{ flex: 1, padding: "11px", border: "none", borderRadius: "9px", background: "#F7C873", color: "#1A1A1A", cursor: "pointer", fontFamily: "sans-serif", fontSize: "13px", fontWeight: "700" }}>⚡ Quiz</button>
            </div>
          </div>

          <div style={{ fontFamily: "sans-serif", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "#999", marginBottom: "12px" }}>Choose a Level</div>

          {LEVELS.map(lvl => (
            <div key={lvl} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", marginBottom: "8px", borderLeft: `4px solid ${levelColors[lvl]}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div>
                  <span style={{ fontFamily: "sans-serif", fontSize: "10px", fontWeight: "700", color: levelColors[lvl], letterSpacing: "1px", textTransform: "uppercase" }}>Level {lvl}</span>
                  <div style={{ fontSize: "15px", fontWeight: "bold", marginTop: "1px" }}>{levelLabels[lvl]}</div>
                </div>
                <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#AAA" }}>10 words</span>
              </div>
              <div style={{ display: "flex", gap: "7px" }}>
                <button onClick={() => startSession(lvl, "browse")} style={{ flex: 1, padding: "8px", border: `2px solid ${levelColors[lvl]}33`, borderRadius: "8px", background: `${levelColors[lvl]}11`, color: levelColors[lvl], cursor: "pointer", fontFamily: "sans-serif", fontSize: "12px", fontWeight: "600" }}>📖 Flashcards</button>
                <button onClick={() => startSession(lvl, "quiz")} style={{ flex: 1, padding: "8px", border: "none", borderRadius: "8px", background: levelColors[lvl], color: "#fff", cursor: "pointer", fontFamily: "sans-serif", fontSize: "12px", fontWeight: "700" }}>⚡ Quiz</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── LEARN SCREEN ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F7F4EF", fontFamily: "'Georgia', serif", color: "#1A1A1A" }}>
      {/* Header */}
      <div style={{ background: "#1A1A1A", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontFamily: "sans-serif", fontSize: "13px", padding: "4px 0", display: "flex", alignItems: "center", gap: "5px" }}>
          ← Back
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#F7F4EF", fontSize: "14px", fontWeight: "bold" }}>
            {selectedLevel === "All" ? "All Words" : `Level ${selectedLevel} — ${levelLabels[Number(selectedLevel)]}`}
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#F7C873", fontSize: "16px", fontWeight: "bold", fontFamily: "sans-serif" }}>{streak}</div>
            <div style={{ color: "#888", fontSize: "9px", fontFamily: "sans-serif", textTransform: "uppercase" }}>Streak</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#7EC8A4", fontSize: "16px", fontWeight: "bold", fontFamily: "sans-serif" }}>{bestStreak}</div>
            <div style={{ color: "#888", fontSize: "9px", fontFamily: "sans-serif", textTransform: "uppercase" }}>Best</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "16px" }}>
        {/* Mode Toggle */}
        <div style={{ display: "flex", background: "#E8E3DB", borderRadius: "8px", padding: "3px", marginBottom: "14px", gap: "3px" }}>
          {["browse", "quiz"].map(m => (
            <button key={m} onClick={() => { setMode(m); resetSession(filteredWords); }} style={{ flex: 1, padding: "9px", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "sans-serif", fontSize: "13px", fontWeight: "600", background: mode === m ? "#1A1A1A" : "transparent", color: mode === m ? "#F7F4EF" : "#666", transition: "all 0.2s" }}>
              {m === "browse" ? "📖 Flashcards" : "⚡ Quiz"}
            </button>
          ))}
        </div>

        {/* Progress */}
        {!showScore && cards.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "sans-serif", fontSize: "11px", color: "#888", marginBottom: "5px" }}>
              <span>{currentIdx + 1} / {cards.length}</span>
              {mode === "quiz" && <span style={{ color: accent, fontWeight: "600" }}>{score.correct}/{score.total} correct</span>}
            </div>
            <div style={{ height: "3px", background: "#DDD", borderRadius: "2px" }}>
              <div style={{ height: "100%", width: `${((currentIdx + 1) / cards.length) * 100}%`, background: accent, borderRadius: "2px", transition: "width 0.3s ease" }} />
            </div>
          </div>
        )}

        {/* Score Screen */}
        {showScore ? (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "40px 24px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>{mode === "quiz" ? (score.correct / score.total >= 0.8 ? "🏆" : "📚") : "✨"}</div>
            <div style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "6px" }}>{mode === "quiz" ? `${score.correct} / ${score.total}` : "All Done!"}</div>
            <div style={{ color: "#666", fontFamily: "sans-serif", fontSize: "14px", marginBottom: "20px" }}>
              {mode === "quiz" ? (score.correct / score.total >= 0.8 ? "Excellent — your lexicon is growing." : "Keep reviewing and the patterns will stick.") : `You reviewed ${cards.length} words.`}
            </div>
            {mode === "quiz" && bestStreak > 1 && <div style={{ color: accent, fontFamily: "sans-serif", fontSize: "13px", marginBottom: "16px" }}>Best streak: {bestStreak} in a row 🔥</div>}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => resetSession(filteredWords)} style={{ flex: 1, padding: "12px", background: "#1A1A1A", color: "#F7F4EF", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "sans-serif", fontSize: "14px", fontWeight: "600" }}>Go Again</button>
              <button onClick={() => setScreen("home")} style={{ flex: 1, padding: "12px", background: "transparent", color: "#444", border: "2px solid #DDD", borderRadius: "8px", cursor: "pointer", fontFamily: "sans-serif", fontSize: "14px", fontWeight: "600" }}>Home</button>
            </div>
          </div>

        ) : current && mode === "browse" ? (
          <div>
            <div onClick={() => setFlipped(f => !f)} style={{ background: "#fff", borderRadius: "16px", padding: "26px 22px", minHeight: "200px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", cursor: "pointer", borderTop: `5px solid ${current.level ? levelColors[current.level] : accent}`, userSelect: "none", position: "relative" }}>
              {/* Level badge */}
              <div style={{ position: "absolute", top: "12px", right: "14px", background: `${levelColors[current.level]}22`, color: levelColors[current.level], borderRadius: "10px", padding: "2px 9px", fontFamily: "sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "0.8px" }}>
                Lv {current.level}
              </div>

              {!flipped ? (
                <div style={{ textAlign: "center", paddingTop: "16px" }}>
                  <div style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px", letterSpacing: "-0.5px" }}>{current.word}</div>
                  <div style={{ color: "#999", fontFamily: "sans-serif", fontSize: "13px", marginBottom: "6px" }}>{current.pronunciation}</div>
                  <div style={{ display: "inline-block", color: "#888", fontStyle: "italic", fontFamily: "sans-serif", fontSize: "11px", background: "#F5F5F5", padding: "3px 10px", borderRadius: "10px", marginTop: "4px" }}>{current.partOfSpeech}</div>
                  <div style={{ marginTop: "28px", color: "#CCC", fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "1px" }}>TAP TO REVEAL</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>{current.word}</div>
                  <div style={{ fontSize: "15px", lineHeight: "1.65", color: "#333", marginBottom: "16px" }}>{current.definition}</div>
                  <div style={{ borderLeft: `3px solid ${levelColors[current.level]}`, paddingLeft: "12px", color: "#666", fontStyle: "italic", fontSize: "13px", lineHeight: "1.6", marginBottom: "14px" }}>
                    "{current.example}"
                  </div>
                </div>
              )}
            </div>

            {/* Etymology panel */}
            {flipped && (
              <div>
                <button onClick={(e) => { e.stopPropagation(); setShowEtymology(s => !s); }} style={{ width: "100%", marginTop: "8px", padding: "10px", border: `2px solid ${levelColors[current.level]}44`, borderRadius: "10px", background: `${levelColors[current.level]}0D`, cursor: "pointer", fontFamily: "sans-serif", fontSize: "12px", fontWeight: "700", color: levelColors[current.level], letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  {showEtymology ? "▲ Hide Etymology" : "🌱 Show Etymology & Roots"}
                </button>
                {showEtymology && (
                  <div style={{ background: `${levelColors[current.level]}0D`, border: `2px solid ${levelColors[current.level]}33`, borderRadius: "10px", padding: "14px 16px", marginTop: "4px" }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: levelColors[current.level], marginBottom: "8px" }}>Etymology & Root Pattern</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: "13px", lineHeight: "1.7", color: "#333" }}>{current.etymology}</div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={prevCard} disabled={currentIdx === 0} style={{ flex: 1, padding: "12px", border: "2px solid #DDD", borderRadius: "10px", background: "transparent", cursor: currentIdx === 0 ? "not-allowed" : "pointer", fontFamily: "sans-serif", fontSize: "14px", color: currentIdx === 0 ? "#CCC" : "#444", fontWeight: "600" }}>← Prev</button>
              <button onClick={nextCard} style={{ flex: 2, padding: "12px", border: "none", borderRadius: "10px", background: "#1A1A1A", cursor: "pointer", fontFamily: "sans-serif", fontSize: "14px", color: "#F7F4EF", fontWeight: "600" }}>{currentIdx + 1 < cards.length ? "Next →" : "Finish"}</button>
            </div>
          </div>

        ) : current && mode === "quiz" ? (
          <div>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "24px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: "12px", borderTop: `5px solid ${levelColors[current.level] || accent}` }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: "#999", marginBottom: "10px" }}>Which word matches this definition?</div>
              <div style={{ fontSize: "16px", lineHeight: "1.65", color: "#1A1A1A", fontStyle: "italic" }}>"{current.definition}"</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "12px" }}>
              {quizOptions.map((option, i) => {
                let bg = "#fff", border = "2px solid #E0DBD3", color = "#1A1A1A";
                if (quizPhase === "result") {
                  if (option.word === current.word) { bg = "#EAF7EE"; border = "2px solid #4A7C59"; color = "#2C5F38"; }
                  else if (selectedAnswer?.word === option.word) { bg = "#FBE9E7"; border = "2px solid #E07A5F"; color = "#8B2500"; }
                }
                return (
                  <button key={i} onClick={() => handleAnswer(option)} style={{ padding: "13px 16px", border, borderRadius: "10px", background: bg, cursor: quizPhase === "result" ? "default" : "pointer", fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: "bold", color, textAlign: "left", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ display: "inline-block", width: "24px", height: "24px", borderRadius: "50%", background: "#F0EBE3", color: "#888", fontFamily: "sans-serif", fontSize: "10px", fontWeight: "700", textAlign: "center", lineHeight: "24px", flexShrink: 0 }}>{["A","B","C","D"][i]}</span>
                    {option.word}
                  </button>
                );
              })}
            </div>

            {quizPhase === "result" && (
              <div>
                <div style={{ background: selectedAnswer?.word === current.word ? "#EAF7EE" : "#FBE9E7", borderRadius: "10px", padding: "12px 14px", marginBottom: "10px", fontFamily: "sans-serif", fontSize: "12px", color: selectedAnswer?.word === current.word ? "#2C5F38" : "#8B2500", lineHeight: "1.5" }}>
                  <strong>{selectedAnswer?.word === current.word ? "✓ Correct!" : `✗ The answer was "${current.word}"`}</strong>
                  <div style={{ fontStyle: "italic", color: "#555", marginTop: "5px", fontFamily: "Georgia, serif", fontSize: "12px" }}>"{current.example}"</div>
                </div>
                {/* Show etymology in quiz after answering */}
                <div style={{ background: `${levelColors[current.level]}0D`, border: `2px solid ${levelColors[current.level]}33`, borderRadius: "10px", padding: "12px 14px", marginBottom: "10px" }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: "9px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: levelColors[current.level], marginBottom: "6px" }}>🌱 Etymology</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "12px", lineHeight: "1.65", color: "#444" }}>{current.etymology}</div>
                </div>
                <button onClick={nextCard} style={{ width: "100%", padding: "13px", border: "none", borderRadius: "10px", background: "#1A1A1A", cursor: "pointer", fontFamily: "sans-serif", fontSize: "14px", color: "#F7F4EF", fontWeight: "600" }}>{currentIdx + 1 < cards.length ? "Next Word →" : "See Results"}</button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
