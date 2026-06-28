import { useState, useEffect, useCallback } from "react";

// 100 words across 10 levels (10 per level), each with etymology
const WORD_BANK = [
  // ── LEVEL 1 ──────────────────────────────────────────────────────────────
  { level: 1, word: "Vivid", pronunciation: "/ˈvɪvɪd/", partOfSpeech: "adjective", category: "Perception", definition: "Producing powerful feelings or strong, clear images in the mind; intensely bright.", etymology: "Latin vivus (alive) → vivid. Root viv- means 'life'. Also in: survive, revive, vivacious.", example: "She had a vivid memory of the morning her father left — the smell of coffee, the creak of the door." },
  { level: 1, word: "Benign", pronunciation: "/bɪˈnaɪn/", partOfSpeech: "adjective", category: "Character", definition: "Gentle and kindly; not harmful or threatening.", etymology: "Latin bene (well) + genus (born, kind) → benign. Root bene- means 'good'. Also in: benefit, benevolent, benefactor.", example: "The old professor had a benign smile that immediately put nervous students at ease." },
  { level: 1, word: "Lucid", pronunciation: "/ˈluːsɪd/", partOfSpeech: "adjective", category: "Intelligence", definition: "Expressed clearly; easy to understand. Also: showing clear thinking.", etymology: "Latin lux, lucis (light) → lucidus → lucid. Root luc- means 'light'. Also in: translucent, elucidate, illuminate.", example: "Even in his final years, his writing remained remarkably lucid and precise." },
  { level: 1, word: "Arid", pronunciation: "/ˈærɪd/", partOfSpeech: "adjective", category: "Nature", definition: "Having little or no rain; too dry or dull.", etymology: "Latin aridus (dry) from arere (to be dry) → arid. Root ar- means 'to burn/dry'. Also in: aridity, arete (Greek: virtue — unrelated but a false friend).", example: "The travellers crossed an arid plateau where nothing but dust and rock extended to the horizon." },
  { level: 1, word: "Serene", pronunciation: "/səˈriːn/", partOfSpeech: "adjective", category: "Emotions", definition: "Calm, peaceful, and untroubled; tranquil.", etymology: "Latin serenus (clear, cloudless) → serene. The Romans used it of weather first, then of mood. Also in: serenity, serene Highness (a royal title).", example: "The lake at dawn was perfectly serene — a mirror for the pale sky above." },
  { level: 1, word: "Candid", pronunciation: "/ˈkændɪd/", partOfSpeech: "adjective", category: "Character", definition: "Truthful and straightforward; frank.", etymology: "Latin candidus (white, pure, sincere) from candere (to shine) → candid. Root cand- means 'to glow white'. Also in: candidate (Romans wore white togas), incandescent, candour.", example: "She gave a candid account of her mistakes, which won her more respect than any polished excuse." },
  { level: 1, word: "Mundane", pronunciation: "/mʌnˈdeɪn/", partOfSpeech: "adjective", category: "Time", definition: "Lacking interest or excitement; dull; of this world rather than spiritual.", etymology: "Latin mundus (world) → mundanus → mundane. Root mund- means 'world'. Also in: monde (French: world), demimonde.", example: "He found beauty in the mundane — a cracked pavement, a flickering street lamp, the hiss of a kettle." },
  { level: 1, word: "Temperate", pronunciation: "/ˈtɛmp(ə)rət/", partOfSpeech: "adjective", category: "Nature", definition: "Moderate; not extreme. Showing self-restraint.", etymology: "Latin temperare (to mix in due proportion, restrain) → temperatus → temperate. Root temper- means 'to mix/time'. Also in: temper, temperature, temperament, contemporary.", example: "She kept a temperate tone throughout the argument, which disarmed her opponent completely." },
  { level: 1, word: "Astute", pronunciation: "/əˈstjuːt/", partOfSpeech: "adjective", category: "Intelligence", definition: "Having the ability to assess situations accurately; mentally sharp and shrewd.", etymology: "Latin astutus (crafty) from astus (craft, cunning) → astute. Possibly linked to Greek asty (city) — the 'smart city-dweller' versus the naive rustic.", example: "An astute investor, she spotted the company's potential three years before anyone else did." },
  { level: 1, word: "Pensive", pronunciation: "/ˈpɛnsɪv/", partOfSpeech: "adjective", category: "Emotions", definition: "Engaged in, involving, or reflecting deep or serious thought.", etymology: "Latin pensare (to weigh, consider) → Old French pensif → pensive. Root pens-/pend- means 'to hang/weigh'. Also in: ponder, expend, compensate, pension.", example: "She stood at the window, pensive, watching the rain trace crooked lines down the glass." },

  // ── LEVEL 2 ──────────────────────────────────────────────────────────────
  { level: 2, word: "Ebullient", pronunciation: "/ɪˈbʌliənt/", partOfSpeech: "adjective", category: "Emotions", definition: "Cheerful and full of energy; overflowing with enthusiasm.", etymology: "Latin ebullire (to bubble up) from ex- (out) + bullire (to boil) → ebullient. Root bull- means 'bubble/boil'. Also in: bulletin, bull (seal), boil.", example: "Her ebullient personality lit up every room she entered." },
  { level: 2, word: "Petrichor", pronunciation: "/ˈpɛtrɪkɔːr/", partOfSpeech: "noun", category: "Nature", definition: "The pleasant, earthy smell produced when rain falls on dry soil.", etymology: "Greek petra (rock/stone) + ichor (the fluid in the veins of the gods) → petrichor. Coined in 1964. Root petr- also in: petroleum, petrify, Peter (the 'rock').", example: "After months of drought, the petrichor rising from the first rainfall was intoxicating." },
  { level: 2, word: "Loquacious", pronunciation: "/ləˈkweɪʃəs/", partOfSpeech: "adjective", category: "Social", definition: "Tending to talk a great deal; talkative.", etymology: "Latin loqui (to speak) + -acious (inclined to) → loquacious. Root loqu-/locu- means 'to speak'. Also in: eloquent, soliloquy, ventriloquist, colloquial.", example: "The loquacious tour guide never paused long enough to let anyone ask a question." },
  { level: 2, word: "Ephemeral", pronunciation: "/ɪˈfɛmərəl/", partOfSpeech: "adjective", category: "Time", definition: "Lasting for a very short time; fleeting.", etymology: "Greek epi (on) + hemera (day) → ephemeros → ephemeral. Root hemer- means 'day'. Also in: ephemeris (daily astronomical tables).", example: "Cherry blossoms are ephemeral — their beauty lasts barely a week." },
  { level: 2, word: "Convivial", pronunciation: "/kənˈvɪviəl/", partOfSpeech: "adjective", category: "Social", definition: "Relating to or fond of feasting and good company; warm and friendly.", etymology: "Latin con- (together) + vivere (to live) → convivialis → convivial. Root viv- means 'life'. Also in: vivid, revive, survive.", example: "The convivial atmosphere of the dinner party made strangers feel like old friends." },
  { level: 2, word: "Liminal", pronunciation: "/ˈlɪmɪnəl/", partOfSpeech: "adjective", category: "Time", definition: "Relating to a transitional or in-between state; occupying a threshold.", etymology: "Latin limen, liminis (threshold, doorway) → liminalis → liminal. Root limin- means 'threshold'. Also in: eliminate (literally 'to push out of the doorway'), subliminal.", example: "Midnight on New Year's Eve is a liminal moment — suspended between what was and what might be." },
  { level: 2, word: "Sylvan", pronunciation: "/ˈsɪlvən/", partOfSpeech: "adjective", category: "Nature", definition: "Relating to or characteristic of woods; pleasantly wooded and rural.", etymology: "Latin silva (forest, woodland) → silvanus → sylvan. Root silv- means 'forest'. Also in: Sylvia (a name meaning 'forest'), Pennsylvania ('Penn's woodland').", example: "They found a sylvan glade where sunlight filtered through ancient oaks." },
  { level: 2, word: "Equanimity", pronunciation: "/ˌɛkwəˈnɪmɪti/", partOfSpeech: "noun", category: "Emotions", definition: "Mental calmness and composure, especially in difficult situations.", etymology: "Latin aequus (equal, even) + animus (mind, spirit) → aequanimitas → equanimity. Root anim- means 'mind/breath'. Also in: aequus → equal, adequate; animus → animate, animal.", example: "He faced the diagnosis with remarkable equanimity, focusing on what he could control." },
  { level: 2, word: "Crepuscular", pronunciation: "/krɪˈpʌskjʊlər/", partOfSpeech: "adjective", category: "Nature", definition: "Relating to or active during twilight; dim and shadowy.", etymology: "Latin crepusculum (twilight, dusk) from creper (dusky, uncertain) → crepuscular. The Romans felt twilight was the 'uncertain' time between day and night.", example: "Deer are crepuscular creatures, most active at dawn and dusk." },
  { level: 2, word: "Mellifluous", pronunciation: "/mɛˈlɪfluəs/", partOfSpeech: "adjective", category: "Perception", definition: "Sweet or musical; pleasant to hear; flowing with honey.", etymology: "Latin mel, mellis (honey) + fluere (to flow) → mellifluus → mellifluous. Root mel- also in: molasses, marmalade (via Greek melimelon); flu- means 'flow' — also in: fluid, flux, influence.", example: "The cellist had a mellifluous tone that made the audience close their eyes and drift." },

  // ── LEVEL 3 ──────────────────────────────────────────────────────────────
  { level: 3, word: "Perspicacious", pronunciation: "/ˌpɜːspɪˈkeɪʃəs/", partOfSpeech: "adjective", category: "Intelligence", definition: "Having a ready insight into things; shrewd and discerning.", etymology: "Latin perspicere (to see through) from per- (through) + specere (to look) → perspicax → perspicacious. Root spec- means 'to look'. Also in: spectacle, inspect, aspect, conspicuous.", example: "Her perspicacious reading of the negotiation saved the deal from collapse." },
  { level: 3, word: "Susurrus", pronunciation: "/suːˈsʌrəs/", partOfSpeech: "noun", category: "Nature", definition: "A whispering or murmuring sound.", etymology: "Latin susurrus (a murmur, hum, whisper) — an onomatopoeic word; the sound mimics the thing it names. Also in: susurrate (to whisper). Compare: buzz, hiss, murmur — all onomatopoeia.", example: "She fell asleep to the susurrus of wind moving through tall grass." },
  { level: 3, word: "Effervescent", pronunciation: "/ˌɛfəˈvɛs(ə)nt/", partOfSpeech: "adjective", category: "Emotions", definition: "Vivacious and enthusiastic; giving off bubbles; fizzing with life.", etymology: "Latin ex- (out) + fervere (to boil, to be hot) → effervescere → effervescent. Root ferv- means 'to boil/glow'. Also in: fervent, fervour, fever.", example: "The crowd was effervescent, cheering and laughing long after the show ended." },
  { level: 3, word: "Recondite", pronunciation: "/ˈrɛkəndaɪt/", partOfSpeech: "adjective", category: "Intelligence", definition: "Not known by many people; abstruse or obscure.", etymology: "Latin recondere (to hide away) from re- (back) + condere (to put, store) → reconditus → recondite. Root cond- means 'to put/build'. Also in: abscond, condition, found (to establish).", example: "The professor's lectures on recondite medieval philosophy attracted only the most dedicated students." },
  { level: 3, word: "Sonder", pronunciation: "/ˈsɒndər/", partOfSpeech: "noun", category: "Emotions", definition: "The realization that each passerby has a life as vivid and complex as your own.", etymology: "Coined by John Koenig (2012) in 'The Dictionary of Obscure Sorrows'. Likely from German sondern (to separate/distinguish) and French sonder (to probe/sound). A neologism built on real roots.", example: "Walking through the airport, she felt a deep sonder — every stranger rushing past carried invisible worlds." },
  { level: 3, word: "Solipsism", pronunciation: "/ˈsɒlɪpsɪz(ə)m/", partOfSpeech: "noun", category: "Intelligence", definition: "The philosophical view that only one's own mind is certain to exist; extreme self-absorption.", etymology: "Latin solus (alone) + ipse (self) + -ism → solipsism. Root sol- means 'alone/only'. Also in: solo, sole, solitary. Root ipse means 'self' — also in: ipso facto ('by the fact itself').", example: "His solipsism made it hard for him to accept that others might see the world differently." },
  { level: 3, word: "Perspicuous", pronunciation: "/pəˈspɪkjuəs/", partOfSpeech: "adjective", category: "Intelligence", definition: "Clearly expressed and easily understood; transparent and lucid.", etymology: "Latin perspicuus (transparent, clear) from perspicere (to see through) → perspicuous. Same root as perspicacious (spec- = to look), but different suffix: -acious means 'inclined to', -uous means 'having the quality of'.", example: "The physicist had a gift for perspicuous explanations that made quantum theory feel intuitive." },
  { level: 3, word: "Fugacious", pronunciation: "/fjuːˈɡeɪʃəs/", partOfSpeech: "adjective", category: "Time", definition: "Tending to disappear; fleeting or transitory.", etymology: "Latin fugere (to flee) + -acious → fugacious. Root fug- means 'to flee'. Also in: fugitive, refuge (a place to flee to), centrifugal, febrifuge.", example: "Youth is fugacious — you barely notice it slipping away until it's gone." },
  { level: 3, word: "Numinous", pronunciation: "/ˈnjuːmɪnəs/", partOfSpeech: "adjective", category: "Perception", definition: "Having a strong religious or spiritual quality; indicating the presence of a divinity.", etymology: "Latin numen (divine power, nod of a god's head) + -ous → numinous. From nuere (to nod, give a sign). Root nu- suggests 'a divine gesture'. Popularised by Rudolf Otto in 'The Idea of the Holy' (1917).", example: "Standing inside the ancient cathedral, even the atheists felt something numinous in the stone and light." },
  { level: 3, word: "Veracious", pronunciation: "/vəˈreɪʃəs/", partOfSpeech: "adjective", category: "Character", definition: "Speaking or representing the truth; truthful.", etymology: "Latin verax, veracis (truthful) from verus (true) → veracious. Root ver- means 'true'. Also in: verify, verdict (true saying), aver, verisimilitude. Don't confuse with voracious (ver- = true vs. vor- = to devour).", example: "She was known as a veracious witness — no embellishment, no omission, just what she saw." },

  // ── LEVEL 4 ──────────────────────────────────────────────────────────────
  { level: 4, word: "Sagacious", pronunciation: "/səˈɡeɪʃəs/", partOfSpeech: "adjective", category: "Intelligence", definition: "Having or showing keen mental discernment and good judgment; wise.", etymology: "Latin sagax, sagacis (keen-scented, quick to perceive) from sagire (to perceive keenly) → sagacious. Root sag- means 'to sense/perceive'. Related to: seek (Germanic cognate), presage.", example: "The sagacious investor knew that panic-selling was a mistake — he'd seen this pattern twice before." },
  { level: 4, word: "Propitious", pronunciation: "/prəˈpɪʃəs/", partOfSpeech: "adjective", category: "Time", definition: "Giving or indicating a good chance of success; favourable.", etymology: "Latin propitius (favourable, gracious) from pro- (before/for) + petere (to seek) → propitious. Root pet-/pit- means 'to rush toward'. Also in: petition, compete, perpetual, appetite.", example: "The calm sea and clear sky offered propitious conditions for the crossing." },
  { level: 4, word: "Palimpsest", pronunciation: "/ˈpælɪmpsɛst/", partOfSpeech: "noun", category: "Time", definition: "A manuscript where writing has been erased and overwritten; something altered but still bearing traces of an earlier form.", etymology: "Greek palin (again) + psestos (scraped) from psen (to scrape) → palimpsest. Root palin- means 'again, back'. Also in: palindrome (palin + dromos = running back). Psest- is rare outside this word.", example: "The old city is a palimpsest — Roman walls underpin medieval streets, which carry Georgian facades." },
  { level: 4, word: "Tendentious", pronunciation: "/tɛnˈdɛnʃəs/", partOfSpeech: "adjective", category: "Character", definition: "Expressing a particular point of view; promoting a cause; biased.", etymology: "Medieval Latin tendentia (tendency) from Latin tendere (to stretch, aim toward) → tendentious. Root tend- means 'to stretch'. Also in: tend, tension, extend, contend, attend, tendon.", example: "The documentary was widely criticised as tendentious — the evidence was real, but the framing was one-sided." },
  { level: 4, word: "Lugubrious", pronunciation: "/luːˈɡuːbriəs/", partOfSpeech: "adjective", category: "Emotions", definition: "Looking or sounding sad and dismal; mournful, often to an exaggerated degree.", etymology: "Latin lugere (to mourn) → lugubris → lugubrious. Root lug-/luc- (mourning) is ancient and isolated. Also in: elegy (via Greek elegia, a song of mourning).", example: "The basset hound stared up at him with those lugubrious eyes, as if the world itself were ending." },
  { level: 4, word: "Tenacious", pronunciation: "/tɪˈneɪʃəs/", partOfSpeech: "adjective", category: "Character", definition: "Keeping a firm hold; persistent; not giving up easily.", etymology: "Latin tenere (to hold) + -acious → tenacious. Root ten- means 'to hold'. Also in: tenant, retain, contain, abstain, entertain, lieutenant (literally 'holding in place of').", example: "A tenacious litigator, she pursued justice for her client through seven years of appeals." },
  { level: 4, word: "Vicarious", pronunciation: "/vɪˈkɛːriəs/", partOfSpeech: "adjective", category: "Emotions", definition: "Experienced in the imagination through the feelings or actions of another person.", etymology: "Latin vicarius (substitute, deputy) from vicis (change, turn, place) → vicarious. Root vic- means 'change/substitution'. Also in: vicar, vice (as in vice-president = substitute president), vicissitude.", example: "She lived vicariously through travel blogs during the years she couldn't afford to go anywhere herself." },
  { level: 4, word: "Pellucid", pronunciation: "/pɛˈluːsɪd/", partOfSpeech: "adjective", category: "Perception", definition: "Translucently clear; easily understood; limpid.", etymology: "Latin per- (through) + lucere (to shine) → pellucidus → pellucid. Root luc- means 'light'. Also in: lucid, translucent, elucidate, illuminate. The per- became pel- through sound change.", example: "The mountain stream was pellucid — every pebble on the bed visible from the bank above." },
  { level: 4, word: "Inveterate", pronunciation: "/ɪnˈvɛt(ə)rət/", partOfSpeech: "adjective", category: "Character", definition: "Having a particular habit, activity, or interest deeply established over a long period.", etymology: "Latin inveterare (to make old, to root in) from in- (in) + vetus, veteris (old) → inveteratus → inveterate. Root veter- means 'old'. Also in: veteran, veterinarian (originally treating old/working animals).", example: "An inveterate traveller, he had slept in forty-seven countries and could not imagine stopping." },
  { level: 4, word: "Limpid", pronunciation: "/ˈlɪmpɪd/", partOfSpeech: "adjective", category: "Perception", definition: "Completely clear and transparent; free from complexity.", etymology: "Latin limpidus (clear, pure) → limpid. Possibly related to lympha (clear water, spring) → lymph. Root limpid- suggests transparent purity; lymph shares the water-clarity idea.", example: "Her prose was limpid — not a wasted word, not a cloudy phrase, everything perfectly transparent." },

  // ── LEVEL 5 ──────────────────────────────────────────────────────────────
  { level: 5, word: "Sanguine", pronunciation: "/ˈsæŋɡwɪn/", partOfSpeech: "adjective", category: "Emotions", definition: "Optimistic, especially in a difficult situation; blood-red in colour.", etymology: "Latin sanguis, sanguinis (blood) → sanguineus → sanguine. Medieval doctors believed a blood-dominant 'humour' made people cheerful. Root sanguin- means 'blood'. Also in: consanguineous (of the same blood), sanguinary (bloody).", example: "Despite the setbacks, she remained sanguine — certain that the right path would reveal itself." },
  { level: 5, word: "Melancholy", pronunciation: "/ˈmɛlənkɒli/", partOfSpeech: "noun/adjective", category: "Emotions", definition: "A feeling of pensive sadness; a deep, reflective gloom.", etymology: "Greek melas (black) + khole (bile) → melankolia. Medieval humour theory: too much 'black bile' caused sadness. Root melan- means 'black'. Also in: melanin, melanoma, Melania. Khole also in: cholera, cholesterol, melancholia.", example: "There was a beautiful melancholy to the last days of autumn — everything releasing its colour at once." },
  { level: 5, word: "Acrimony", pronunciation: "/ˈækrɪməni/", partOfSpeech: "noun", category: "Social", definition: "Bitterness or ill-feeling, especially in speech or manner.", etymology: "Latin acer, acris (sharp, keen, bitter) → acrimonia → acrimony. Root acr-/ac- means 'sharp'. Also in: acid, acerbic, acumen, exacerbate, acute (all sharing the 'sharp' sense).", example: "The divorce was settled, but the acrimony between them lingered for years in every custody exchange." },
  { level: 5, word: "Phlegmatic", pronunciation: "/flɛɡˈmætɪk/", partOfSpeech: "adjective", category: "Character", definition: "Having an unemotional and stolidly calm disposition; not easily excited.", etymology: "Greek phlegma (inflammation, the 'cool, moist' humour) from phlegein (to burn). Paradoxically, the 'cool' humour made people calm. Root phleg- means 'to burn'. Also in: phlegm, phlogiston (early chemistry's 'fire element').", example: "A phlegmatic man by nature, he received both good news and bad with the same measured nod." },
  { level: 5, word: "Penumbra", pronunciation: "/pɪˈnʌmbrə/", partOfSpeech: "noun", category: "Perception", definition: "The partially shaded outer region of a shadow; the area of partial illumination at the edge.", etymology: "Latin paene (almost) + umbra (shadow) → penumbra. Root paen- means 'almost'. Also in: peninsula (paene + insula = 'almost an island'). Umbra also in: umbrella, adumbrate, sombrero.", example: "The eclipse cast the city into penumbra — not dark, not light, but an eerie in-between dusk." },
  { level: 5, word: "Inimical", pronunciation: "/ɪˈnɪmɪk(ə)l/", partOfSpeech: "adjective", category: "Character", definition: "Tending to obstruct or harm; hostile and unfavourable.", etymology: "Latin inimicus (enemy) from in- (not) + amicus (friend) → inimicalis → inimical. Root amic- means 'friend'. Also in: amicable, amity, amiable, enemy (via French ennemi from inimicus).", example: "The damp, cold conditions were inimical to recovery — the hospital had to move the patients." },
  { level: 5, word: "Truculent", pronunciation: "/ˈtrʌkjʊlənt/", partOfSpeech: "adjective", category: "Character", definition: "Eager or quick to argue or fight; aggressively defiant.", etymology: "Latin trux, trucis (fierce, grim) → truculentus → truculent. Root truc- means 'savage'. A rare root found mainly in this word. Related mood: atrocious (atrox from ater 'black' + trux).", example: "The truculent toddler refused every suggestion and met each new idea with a theatrical scowl." },
  { level: 5, word: "Voluble", pronunciation: "/ˈvɒljʊb(ə)l/", partOfSpeech: "adjective", category: "Social", definition: "Speaking or spoken incessantly and fluently; easy and unrestrained in speech.", etymology: "Latin volvere (to roll, turn) → volubilis → voluble. Root volv-/volu- means 'to roll'. Also in: revolve, involve, evolve, volume (a scroll that rolls), vault, waltz.", example: "Her grandmother was wonderfully voluble — you came for a cup of tea and stayed for three hours." },
  { level: 5, word: "Insouciant", pronunciation: "/ɪnˈsuːsiənt/", partOfSpeech: "adjective", category: "Emotions", definition: "Showing a casual lack of concern; carefree and nonchalant.", etymology: "French in- (not) + soucier (to worry) from Latin sollicitare (to agitate) → insouciant. Root sollicit- means 'to stir up'. Also in: solicit, solicitor, solicitude — all suggest worry or care.", example: "He shrugged with insouciant grace, as if the whole catastrophe were someone else's problem." },
  { level: 5, word: "Evanescent", pronunciation: "/ˌɛvəˈnɛs(ə)nt/", partOfSpeech: "adjective", category: "Time", definition: "Soon passing out of sight, memory, or existence; quickly fading.", etymology: "Latin evanescere (to vanish) from ex- (out) + vanescere (to become empty) from vanus (empty, vain) → evanescent. Root van- means 'empty'. Also in: vain, vanity, vanish, evanish.", example: "The morning mist was evanescent, burning off the moment the first real sun hit the valley." },

  // ── LEVEL 6 ──────────────────────────────────────────────────────────────
  { level: 6, word: "Ossified", pronunciation: "/ˈɒsɪfaɪd/", partOfSpeech: "adjective", category: "Character", definition: "Turned into bone; or (figuratively) rigid and unable to change.", etymology: "Latin os, ossis (bone) + facere (to make) → ossificare → ossified. Root oss- means 'bone'. Also in: osseous, ossuary (a bone repository). Root fac- also in: fact, manufacture, affect.", example: "The committee's thinking had ossified over decades — new ideas bounced off it like stones off marble." },
  { level: 6, word: "Pusillanimous", pronunciation: "/ˌpjuːsɪˈlænɪməs/", partOfSpeech: "adjective", category: "Character", definition: "Showing a lack of courage or determination; timid and cowardly.", etymology: "Latin pusillus (very small, petty) + animus (mind, spirit) → pusillanimis → pusillanimous. Root pusill- means 'tiny'; anim- means 'spirit'. Also in: animosity, magnanimous (magn- = great + anim- = spirit).", example: "A pusillanimous refusal to take sides in the crisis cost the minister every ally he had." },
  { level: 6, word: "Perfidious", pronunciation: "/pəˈfɪdiəs/", partOfSpeech: "adjective", category: "Character", definition: "Deceitful and untrustworthy; guilty of betrayal.", etymology: "Latin per- (through, wrongly) + fides (faith, trust) → perfidiosus → perfidious. Root fid- means 'faith/trust'. Also in: fidelity, fiancé (betrothed in faith), confide, diffident, infidel.", example: "History remembers him as a perfidious ally — smiling at summits while supplying the enemy." },
  { level: 6, word: "Pulchritude", pronunciation: "/ˈpʌlkrɪtjuːd/", partOfSpeech: "noun", category: "Perception", definition: "Beauty, especially of a person; physical attractiveness.", etymology: "Latin pulcher (beautiful) + -tudo (state of) → pulchritudo → pulchritude. Root pulchr- means 'beautiful'. A rare root, mainly surviving in this word and the adjective pulchritudinous. The word's ugliness is often noted ironically.", example: "The portrait celebrated not just the subject's pulchritude but the intelligence behind her eyes." },
  { level: 6, word: "Expiate", pronunciation: "/ˈɛkspiɛɪt/", partOfSpeech: "verb", category: "Character", definition: "To atone for (guilt or sin); to make amends.", etymology: "Latin ex- (out) + piare (to appease, atone) from pius (dutiful, pious) → expiare → expiate. Root pi- means 'dutiful/religious'. Also in: pious, piety, pity (via compassion), impious.", example: "He spent years volunteering in the neighbourhood he'd once robbed, quietly trying to expiate his past." },
  { level: 6, word: "Nefarious", pronunciation: "/nɪˈfɛːriəs/", partOfSpeech: "adjective", category: "Character", definition: "Wicked or criminal; flagrantly evil.", etymology: "Latin ne- (not) + fas (divine law, that which is right) → nefarius → nefarious. Root fas means 'divinely permitted'. Also in: nefas (a sin against divine law). The opposite: fas est (it is lawful/right).", example: "The scheme was nefarious in every detail — false identities, forged documents, and stolen charity funds." },
  { level: 6, word: "Torpid", pronunciation: "/ˈtɔːpɪd/", partOfSpeech: "adjective", category: "Emotions", definition: "Mentally or physically inactive; lethargic; sluggish.", etymology: "Latin torpere (to be numb, stiff) → torpidus → torpid. Root torp- means 'to be numb'. Also in: torpedo (originally a 'numbfish' or electric ray), torpor.", example: "The long winter and grey skies left him torpid — days vanished without a single completed task." },
  { level: 6, word: "Mellisonant", pronunciation: "/mɛˈlɪsənənt/", partOfSpeech: "adjective", category: "Perception", definition: "Pleasing and sweet to the ear; sweetly sounding.", etymology: "Latin mel, mellis (honey) + sonare (to sound) → mellisonant. Root mel- means 'honey'; son- means 'sound'. Also in: sonata, sonic, resonant, consonant, dissonant. Contrast mellifluous (flowing honey) vs. mellisonant (sounding like honey).", example: "The choir's mellisonant harmonies drifted through the stone corridor and into the courtyard beyond." },
  { level: 6, word: "Querulous", pronunciation: "/ˈkwɛrʊləs/", partOfSpeech: "adjective", category: "Social", definition: "Complaining in a whining or petulant manner; habitually finding fault.", etymology: "Latin queri (to complain, to lament) + -ulous (tending to) → querulosus → querulous. Root quer- means 'to complain'. Also in: quarrel, query, querulent, inquest (an inquiry into complaints).", example: "A querulous editor, he returned every draft with margins thick with grievances." },
  { level: 6, word: "Vituperate", pronunciation: "/vɪˈtjuːpəreɪt/", partOfSpeech: "verb", category: "Social", definition: "To blame or insult in strong or violent language; to berate savagely.", etymology: "Latin vituperare from vitium (fault, vice) + parare (to prepare/arrange) → to find fault → vituperate. Root viti- means 'fault/flaw'. Also in: vitiate, vice, vicious. Root par- also in: prepare, repair.", example: "The critic vituperated the production with such ferocity that the theatre company's publicist wept." },

  // ── LEVEL 7 ──────────────────────────────────────────────────────────────
  { level: 7, word: "Apocryphal", pronunciation: "/əˈpɒkrɪf(ə)l/", partOfSpeech: "adjective", category: "Intelligence", definition: "Of doubtful authenticity; fictitious but widely circulated.", etymology: "Greek apo- (away, from) + kryptein (to hide) → apokryphos (hidden) → apocryphal. Root krypt- means 'hidden'. Also in: crypt, cryptic, cryptography, encrypt. The Apocrypha were 'hidden' books excluded from the Bible.", example: "The story of Newton's apple may be apocryphal, but it captures something true about sudden insight." },
  { level: 7, word: "Enervate", pronunciation: "/ˈɛnəveɪt/", partOfSpeech: "verb", category: "Emotions", definition: "To make (someone) feel drained of energy or vitality; to weaken.", etymology: "Latin e- (out of) + nervus (sinew, nerve) → enervare → enervate. Root nerv- means 'sinew/strength'. Also in: nerve, nervous, innervate (to supply with nerves), enervation. Note: enervate means to drain energy, not to energize.", example: "The relentless heat enervated the whole team; by noon, no one could make a decision." },
  { level: 7, word: "Sycophant", pronunciation: "/ˈsɪkəfant/", partOfSpeech: "noun", category: "Social", definition: "A person who acts obsequiously to gain advantage; a flatterer or toady.", etymology: "Greek sykon (fig) + phainein (to show) → sykophantes. Origin debated: possibly 'one who shows the fig' (an obscene gesture used by informers). Root phain- means 'to show'. Also in: phenomenon, fantasy, emphasis, phase.", example: "The board room was full of sycophants — no one dared tell the CEO that the strategy was failing." },
  { level: 7, word: "Inscrutable", pronunciation: "/ɪnˈskruːtəb(ə)l/", partOfSpeech: "adjective", category: "Intelligence", definition: "Impossible to understand or interpret; impenetrably mysterious.", etymology: "Latin in- (not) + scrutari (to examine, to search through rubbish) → inscrutabilis → inscrutable. Root scrut- means 'to sort through'. Also in: scrutiny, scrutinise (to look carefully through, like sorting rags).", example: "His expression was inscrutable — you could never tell if you'd impressed him or offended him." },
  { level: 7, word: "Meretricious", pronunciation: "/ˌmɛrɪˈtrɪʃəs/", partOfSpeech: "adjective", category: "Perception", definition: "Apparently attractive but having in reality no value or integrity; showy.", etymology: "Latin meretrix, meretricis (a prostitute, literally 'one who earns') from merere (to earn) → meretricius → meretricious. Root mer- means 'to earn/deserve'. Also in: merit, merit, mercenary, commerce.", example: "The awards ceremony was meretricious spectacle — all glitter and no substance." },
  { level: 7, word: "Opprobrium", pronunciation: "/əˈprəʊbriəm/", partOfSpeech: "noun", category: "Social", definition: "Harsh criticism or censure; public disgrace arising from shameful conduct.", etymology: "Latin ob- (against) + probrum (shameful act, reproach) → opprobrium. Root probr- means 'reproach/shame'. Also in: opprobrious (shameful). Contrast with probity (honesty), which shares no root — from probus (upright).", example: "The banker faced the opprobrium of an entire city after the fund collapsed and wiped out savings." },
  { level: 7, word: "Tendentiously", pronunciation: "/tɛnˈdɛnʃəsli/", partOfSpeech: "adverb", category: "Intelligence", definition: "In a way that promotes a particular cause or point of view; in a biased manner.", etymology: "From tendentious (see level 4) + -ly. Latin tendere (to stretch/aim). Root tend- means 'to stretch toward'. The adverb form extends the same root pattern.", example: "The statistics were tendentiously presented — accurate numbers arranged to mislead." },
  { level: 7, word: "Palaver", pronunciation: "/pəˈlɑːvə/", partOfSpeech: "noun/verb", category: "Social", definition: "Prolonged and idle discussion; tedious fuss; to talk excessively.", etymology: "Portuguese palavra (word, speech) from Latin parabola (comparison, parable) from Greek parabolē → palaver. Root parabol- means 'throwing alongside' (para = beside + ballein = to throw). Also in: parable, parabola, parlour, parliament, parole.", example: "After an hour of palaver about the font choice, the designer quietly saved the file and went home." },
  { level: 7, word: "Ineluctable", pronunciation: "/ˌɪnɪˈlʌktəb(ə)l/", partOfSpeech: "adjective", category: "Time", definition: "Unable to be resisted or avoided; inescapable.", etymology: "Latin in- (not) + eluctari (to struggle free) from ex- (out) + luctari (to wrestle) → ineluctabilis → ineluctable. Root luct- means 'to wrestle/struggle'. Also in: reluctant (re- = back + luct- = to struggle against).", example: "The tide of change felt ineluctable — no policy, no protest, no nostalgia could hold it back." },
  { level: 7, word: "Weltanschauung", pronunciation: "/ˈvɛltanʃaʊʊŋ/", partOfSpeech: "noun", category: "Intelligence", definition: "A particular philosophy or view of life; a comprehensive world view.", etymology: "German Welt (world) + Anschauung (view, perception) from anschauen (to look at). German compound meaning 'world-viewing'. Entered English through 19th-century philosophy. Compare: weltschmerz (world-pain).", example: "His entire political career expressed a single Weltanschauung — the belief that freedom and order were inseparable." },

  // ── LEVEL 8 ──────────────────────────────────────────────────────────────
  { level: 8, word: "Panegyric", pronunciation: "/ˌpænɪˈdʒɪrɪk/", partOfSpeech: "noun", category: "Social", definition: "A public speech or text in praise of someone or something; an elaborate compliment.", etymology: "Greek pan- (all) + agyris (assembly) → panegyris (a public festival) → panegyrikos (speech for a public assembly) → panegyric. Root pan- means 'all'. Also in: pandemic, panorama, panacea, pantheon.", example: "The retirement dinner was pleasant, but the panegyric from his deputy went on for forty-five uncomfortable minutes." },
  { level: 8, word: "Parsimonious", pronunciation: "/ˌpɑːsɪˈməʊniəs/", partOfSpeech: "adjective", category: "Character", definition: "Unwilling to spend money or use resources; extremely frugal to the point of meanness.", etymology: "Latin parcere (to spare, be sparing) → parsimonia (economy, frugality) → parsimonious. Root parc-/pars- means 'to spare'. Also in: parse (to spare apart/analyse), sparingly. In logic, 'parsimony' is economy of explanation — Occam's Razor.", example: "He was so parsimonious that he reused tea bags and turned off light switches before leaving the room." },
  { level: 8, word: "Mnemonic", pronunciation: "/nɪˈmɒnɪk/", partOfSpeech: "adjective/noun", category: "Intelligence", definition: "A system or pattern intended to assist memory; assisting or intended to assist the memory.", etymology: "Greek mnemonikos (of memory) from mnemon (mindful) from mnasthai (to remember) → mnemonic. Root mne- means 'memory'. Also in: amnesia (a- = without + mnesia = memory), Mnemosyne (Greek goddess of memory, mother of the Muses).", example: "'Every Good Boy Deserves Football' is a mnemonic for the lines of the treble clef." },
  { level: 8, word: "Sesquipedalian", pronunciation: "/ˌsɛskwɪpɪˈdeɪliən/", partOfSpeech: "adjective", category: "Intelligence", definition: "Relating to or characterised by long words; given to using long words.", etymology: "Latin sesqui- (one and a half) + pedalis (of a foot) → sesquipedalis (a foot and a half long) → sesquipedalian. Root sesqui- is a precise fraction; ped- means 'foot'. Also in: pedal, pedestrian, expedite (to free the feet), impede.", example: "His academic papers were famously sesquipedalian — students joked that you needed a dictionary just to read the abstract." },
  { level: 8, word: "Threnody", pronunciation: "/ˈθrɛnədi/", partOfSpeech: "noun", category: "Emotions", definition: "A lament; a song or poem of mourning.", etymology: "Greek threnos (lament, wailing) + oide (song) → threnodia → threnody. Root oid- means 'song'. Also in: ode, melody (melos + oide), comedy (komos + oide = revel-song), tragedy (tragos + oide = goat-song), rhapsody.", example: "The string quartet played a threnody for the victims — spare, bleak, and devastatingly right." },
  { level: 8, word: "Acumen", pronunciation: "/ˈækjʊmɛn/", partOfSpeech: "noun", category: "Intelligence", definition: "The ability to make good judgments and take quick decisions; sharpness of mind.", etymology: "Latin acuere (to sharpen) → acumen (a point, sharpness). Root acu- means 'sharp'. Also in: acute, acupuncture, acid, acrimony, exacerbate — all from the same 'sharp' sense.", example: "Her business acumen was evident from the first meeting — she saw the gap in the market instantly." },
  { level: 8, word: "Palliative", pronunciation: "/ˈpæliətɪv/", partOfSpeech: "adjective/noun", category: "Character", definition: "Relieving pain without treating the cause; (noun) a medicine or measure that relieves without curing.", etymology: "Latin pallium (a cloak) → palliare (to cloak, to conceal) → palliativus → palliative. Root palli- means 'cloak'. Also in: palliate, pallium. The word captures the idea of 'covering over' pain without removing it.", example: "The committee offered palliative measures — enough to quiet the protests but not to fix the underlying problem." },
  { level: 8, word: "Crepitate", pronunciation: "/ˈkrɛpɪteɪt/", partOfSpeech: "verb", category: "Nature", definition: "To make a crackling or rattling sound; to crackle.", etymology: "Latin crepare (to crack, rattle, creak) → crepitare → crepitate. Root crep- means 'to crack/rattle'. Also in: decrepit (worn down, crackling with age), crepuscular (the 'crackling' uncertain light of twilight shares no root — false friend).", example: "The dry logs crepitated satisfyingly in the hearth as the room slowly warmed." },
  { level: 8, word: "Solecism", pronunciation: "/ˈsɒlɪsɪz(ə)m/", partOfSpeech: "noun", category: "Social", definition: "A grammatical mistake; an error in etiquette or a social blunder.", etymology: "Greek Soloi — a city in Cilicia (modern Turkey) whose inhabitants were thought to speak corrupt Greek → soloikismos → solecism. A place-name that became a category of error. Like 'malapropism' (from Mrs Malaprop).", example: "Using 'literally' to mean 'figuratively' has gone from solecism to accepted usage in a single generation." },
  { level: 8, word: "Apothegm", pronunciation: "/ˈæpəθɛm/", partOfSpeech: "noun", category: "Intelligence", definition: "A short, pithy, and instructive saying or formulation; a maxim.", etymology: "Greek apo- (from) + phthengesthai (to speak out) → apophthegma → apothegm. Root phtheg- means 'to utter clearly'. Also in: diphthong (di = two + phthong = sound). The apo- prefix means 'away from' — 'to speak out from one's depths'.", example: "Franklin's apothegms — 'time is money', 'an ounce of prevention' — have outlasted most of his longer writings." },

  // ── LEVEL 9 ──────────────────────────────────────────────────────────────
  { level: 9, word: "Pleonasm", pronunciation: "/ˈpliːəˌnæz(ə)m/", partOfSpeech: "noun", category: "Intelligence", definition: "The use of more words than necessary to convey meaning; redundancy of expression.", etymology: "Greek pleon (more) + nasmós (the act of filling) from pleonazein (to be excessive) → pleonasmus → pleonasm. Root ple-/pleo- means 'more/full'. Also in: plethora (over-fullness), plenum, plenty, complement, complete.", example: "'A free gift' and 'end result' are classic pleonasms — one word in each phrase does all the work." },
  { level: 9, word: "Apophenia", pronunciation: "/ˌæpəˈfiːniə/", partOfSpeech: "noun", category: "Intelligence", definition: "The tendency to perceive meaningful connections between unrelated things.", etymology: "Greek apo- (away from) + phainein (to show) + -ia (condition) → apophenia. Coined by Klaus Conrad (1958). Root phain- means 'to show/appear'. Also in: phenomenon, fantasy, emphasis, diaphanous, sycophant.", example: "Seeing faces in clouds or patterns in random noise is apophenia — the brain hunting for signal in static." },
  { level: 9, word: "Desiderata", pronunciation: "/dɪˌzɪdəˈrɑːtə/", partOfSpeech: "noun (plural)", category: "Character", definition: "Things that are needed or wanted; essential requirements.", etymology: "Latin desiderare (to long for, to miss) → desideratum (thing desired) → desiderata (plural). Root desider- means 'to long for'. Possibly from de- + sidus, sideris (star) — 'to long for one's lost star'. Also in: consider (to examine the stars), desire.", example: "The job listing ran to two pages of desiderata, most of which contradicted the others." },
  { level: 9, word: "Kakistocracy", pronunciation: "/ˌkækɪˈstɒkrəsi/", partOfSpeech: "noun", category: "Social", definition: "Government by the worst or least qualified citizens.", etymology: "Greek kakistos (worst, superlative of kakos = bad) + kratos (rule, power) → kakistocracy. Root kak- means 'bad'. Also in: cacophony (kak + phone = bad sound). Root krat- means 'power/rule'. Also in: democracy, aristocracy, plutocracy, autocracy.", example: "Critics called it a kakistocracy — every competent official had been replaced with loyalists of no relevant experience." },
  { level: 9, word: "Logomachy", pronunciation: "/lɒˈɡɒməki/", partOfSpeech: "noun", category: "Social", definition: "An argument about words; a dispute turning on a point of terminology rather than substance.", etymology: "Greek logos (word, reason) + makhē (battle, fight) → logomachy. Root log- means 'word/reason'. Also in: logic, logarithm, monologue, prologue. Root makh- means 'battle'. Also in: machy (suffix) — theomachy, iconoclast (no — that's klass- = break).", example: "The committee's debate about whether the document was a 'policy' or a 'framework' was pure logomachy." },
  { level: 9, word: "Otiose", pronunciation: "/ˈəʊʃiəʊs/", partOfSpeech: "adjective", category: "Character", definition: "Serving no practical purpose; pointless; or (of a person) idle and indolent.", etymology: "Latin otium (leisure, idleness) → otiosus → otiose. Root oti- means 'leisure'. Also in: negotium (neg- = not + otium = not-leisure = business) → negotiate. Otium was the Romans' word for leisure; negotium was its opposite.", example: "Three of the report's recommendations were otiose — they described what was already happening." },
  { level: 9, word: "Anamnesis", pronunciation: "/ˌænæmˈniːsɪs/", partOfSpeech: "noun", category: "Intelligence", definition: "Recollection, especially of a supposed previous existence; the medical history of a patient.", etymology: "Greek ana- (again, back) + mnesis (memory) from mnasthai (to remember) → anamnesis. Root mne- means 'memory' (same root as mnemonic). Also in: amnesia (a- = without + mnesia). In Platonic philosophy, all learning is anamnesis — remembering what the soul already knows.", example: "The philosopher argued that great art works by anamnesis — not teaching us new things but revealing what we already knew." },
  { level: 9, word: "Casuistry", pronunciation: "/ˈkæʒjʊɪstri/", partOfSpeech: "noun", category: "Intelligence", definition: "The use of clever but false reasoning to justify actions; moral hair-splitting.", etymology: "Latin casus (a case, a falling, an event) from cadere (to fall) → casus + -istry → casuistry. Root cad-/cas- means 'to fall'. Also in: case, casual, occasion, accident, cadence, chance.", example: "The memo was a masterpiece of casuistry — technically correct and morally bankrupt in every line." },
  { level: 9, word: "Tmesis", pronunciation: "/ˈtmiːsɪs/", partOfSpeech: "noun", category: "Intelligence", definition: "The insertion of a word or words into the middle of another word, as in 'abso-bloody-lutely'.", etymology: "Greek tmesis (cutting) from temnein (to cut) → tmesis. Root tem-/tom- means 'to cut'. Also in: anatomy (ana + tomy = cutting up), appendectomy, atom (a- + tomos = un-cuttable), epitome (cutting to the surface).", example: "The footballer's post-match interview was famous for its creative tmesis — unprintable but linguistically fascinating." },
  { level: 9, word: "Noctilucent", pronunciation: "/ˌnɒktɪˈluːs(ə)nt/", partOfSpeech: "adjective", category: "Nature", definition: "Shining or luminous at night; specifically of the highest-altitude clouds visible in deep twilight.", etymology: "Latin nox, noctis (night) + lucere (to shine) → noctilucent. Root noct- means 'night'. Also in: nocturnal, equinox (aequi + nox = equal night), nocturn. Root luc- means 'light' (see lucid, pellucid, elucidate).", example: "On summer nights at high latitudes, noctilucent clouds glow electric blue long after the sun has set." },
  { level: 9, word: "Synecdoche", pronunciation: "/sɪˈnɛkdəki/", partOfSpeech: "noun", category: "Intelligence", definition: "A figure of speech in which a part is used to represent the whole, or vice versa.", etymology: "Greek syn- (together) + ekdoche (interpretation) from ek- (out) + dekhesthai (to receive) → synekdoche → synecdoche. Root dech-/doc- means 'to receive/understand'. Also in: orthodox (right-receiving), paradox, Docetism.", example: "'All hands on deck' uses synecdoche — 'hands' for the sailors to whom those hands belong." },

  // ── LEVEL 10 ─────────────────────────────────────────────────────────────
  { level: 10, word: "Apophatic", pronunciation: "/ˌæpəˈfætɪk/", partOfSpeech: "adjective", category: "Intelligence", definition: "Relating to a way of describing something by saying what it is not rather than what it is.", etymology: "Greek apo- (away from) + phanai (to speak) → apophatikos → apophatic. Root phan-/phat- means 'to speak'. Also in: prophet (pro + phat = speaking before), emphatic, aphasia (loss of speech). Opposite: cataphatic (defining by what a thing is).", example: "Apophatic theology holds that God can only be described by negation — not finite, not temporal, not comprehensible." },
  { level: 10, word: "Palingenesis", pronunciation: "/ˌpælɪnˈdʒɛnɪsɪs/", partOfSpeech: "noun", category: "Time", definition: "Rebirth or regeneration; the recurrence of ancestral characteristics.", etymology: "Greek palin (again) + genesis (origin, birth) → palingenesis. Root palin- means 'again/back' (also in palindrome, palimpsest). Root gen- means 'birth/origin'. Also in: genesis, generate, genus, gene, generous (originally 'of noble birth').", example: "Some political movements promise national palingenesis — a rebirth of former greatness through collective will." },
  { level: 10, word: "Apotropaic", pronunciation: "/ˌæpətrəˈpeɪɪk/", partOfSpeech: "adjective", category: "Perception", definition: "Supposedly having the power to avert evil influences or bad luck.", etymology: "Greek apo- (away from) + trepein (to turn) → apotropaios → apotropaic. Root trep-/trop- means 'to turn'. Also in: trope, trophy (turning the enemy), entropy (en + trope = a turning inward), heliotrope (turning toward the sun).", example: "The carved masks above the temple door were apotropaic — their grotesque expressions meant to frighten demons away." },
  { level: 10, word: "Parapraxis", pronunciation: "/ˌpærəˈpraksɪs/", partOfSpeech: "noun", category: "Intelligence", definition: "A slip of the tongue or pen, or a small forgetting, seen as revealing unconscious wishes.", etymology: "Greek para- (beside, amiss) + praxis (action, doing) from prassein (to do) → parapraxis. Root prax- means 'action'. Also in: practice, practical, chiropractic (kheir = hand + praxis = action). Root para- also in: paradox, parallel, parasite.", example: "He called his new boss by his ex-wife's name — a parapraxis the whole room pretended not to notice." },
  { level: 10, word: "Catachresis", pronunciation: "/ˌkætəˈkriːsɪs/", partOfSpeech: "noun", category: "Intelligence", definition: "The use of a word in a way that is not correct; an extension of a word's meaning beyond its proper application.", etymology: "Greek kata- (against, wrongly) + khresthai (to use) → katakhresis → catachresis. Root khre-/chre- means 'to use/need'. Also in: Euchrasia (good use), catechism (to sound down — kata + echo). The opposite: orthography, orthodox (ortho = right use).", example: "'The leg of a table' is catachresis — a leg belongs to a living creature, but we borrowed the word anyway." },
  { level: 10, word: "Heterodox", pronunciation: "/ˈhɛtərədɒks/", partOfSpeech: "adjective", category: "Intelligence", definition: "Not conforming with accepted or orthodox standards or beliefs; holding unorthodox opinions.", etymology: "Greek heteros (other, different) + doxa (opinion, glory) → heterodoxos → heterodox. Root heter- means 'other'. Also in: heterogeneous, heterosexual. Root dox- means 'opinion'. Also in: orthodox (ortho = right), paradox (para = beside), doxology.", example: "Her heterodox views on urban planning were mocked at conferences and implemented in five cities a decade later." },
  { level: 10, word: "Prolepsis", pronunciation: "/prəˈlɛpsɪs/", partOfSpeech: "noun", category: "Time", definition: "The anticipation and answering of objections before they are raised; or representing a future event as already complete.", etymology: "Greek pro- (before) + lepsis (a taking) from lambanein (to take) → prolepsis. Root lep-/lab- means 'to take/seize'. Also in: epilepsy (a seizing upon), catalepsy, syllable (syl + labe = taking together). Pro- means 'before' — also in: prologue, prophet, prognosis.", example: "His opening argument used prolepsis brilliantly — he dismantled the opposing case before opposing counsel had spoken." },
  { level: 10, word: "Aposiopesis", pronunciation: "/ˌæpəˌsaɪəˈpiːsɪs/", partOfSpeech: "noun", category: "Social", definition: "A rhetorical device in which a sentence is deliberately broken off and left incomplete for dramatic effect.", etymology: "Greek apo- (away from) + siope (silence) → aposiopesis. Root siop- means 'silence'. An isolated root found almost only in this word. Also in: siope (Greek for silence). The device is the moment when language literally stops.", example: "He raised his hand to speak, then saw the child's face, and his sentence ended in aposiopesis — some things couldn't be said." },
  { level: 10, word: "Kenosis", pronunciation: "/kɪˈnəʊsɪs/", partOfSpeech: "noun", category: "Character", definition: "The relinquishment of divine attributes by Christ in the Incarnation; by extension: a deliberate self-emptying of ego.", etymology: "Greek kenoo (to empty) from kenos (empty) + -sis (process of) → kenosis. Root ken-/keno- means 'empty'. Also in: cenotaph (keno + taphos = empty tomb), kenophobia (fear of empty spaces).", example: "The great artists often describe a kenosis before creation — emptying the self so something true can enter." },
  { level: 10, word: "Apocatastasis", pronunciation: "/ˌæpəˌkætəˈsteɪsɪs/", partOfSpeech: "noun", category: "Time", definition: "The restoration of all things to their original state; universal reconciliation at the end of time.", etymology: "Greek apo- (away, back) + kathistanai (to establish, restore) from kata- (down) + histanai (to stand) → apokatastasis. Root sta-/stasis means 'to stand'. Also in: static, stable, statue, establish, ecstasy (ex + stasis = standing outside oneself), apostasy.", example: "Origen taught apocatastasis — that even the devils would eventually be reconciled to God, nothing finally lost." },
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
