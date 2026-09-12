export interface TeamDefinition {
  name: string;
  abbr: string;
  logoUrl: string;
  gradients: [string, string];
  accent: string;
}

// =========================================================================
// HIGH-FIDELITY BROADCAST VECTOR LOGOS FOR ALL 32 NFL TEAMS & CUSTOM LEAGUE
// =========================================================================

// --- AFC EAST ---
// Buffalo Bills
const BUF_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="bufSh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23bufSh)"><path d="M30,68 C35,42 65,30 100,28 C135,26 160,38 175,54 C165,60 145,56 130,50 C146,64 158,82 150,94 C120,98 85,94 58,94 C42,94 32,84 30,68 Z" fill="%2300338D" stroke="%23ffffff" stroke-width="3.5"/><polygon points="34,68 18,52 38,48" fill="%2300338D" stroke="%23ffffff" stroke-width="2"/><line x1="16" y1="56" x2="178" y2="56" stroke="%23C60C30" stroke-width="8" stroke-linecap="round"/><circle cx="140" cy="42" r="3.5" fill="%23ffffff"/></g></svg>`;

// Miami Dolphins
const MIA_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="miaSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23miaSh)"><circle cx="100" cy="60" r="42" fill="%23FC4C02" stroke="%23ffffff" stroke-width="3"/><path d="M48,82 C68,42 112,32 152,48 C164,54 168,64 162,70 C144,64 128,66 112,75 C85,86 63,88 48,82 Z" fill="%23008E97" stroke="%23ffffff" stroke-width="3.5"/><circle cx="142" cy="52" r="3" fill="%23ffffff"/><polygon points="80,56 94,36 102,52" fill="%23008E97" stroke="%23ffffff" stroke-width="1.5"/></g></svg>`;

// New England Patriots
const NE_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="neSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23neSh)"><path d="M25,50 C50,25 110,25 160,35 C145,50 115,55 85,55 C120,60 155,75 175,90 C130,85 80,75 45,68 C35,64 28,58 25,50 Z" fill="%23002244" stroke="%23B0B7BC" stroke-width="3"/><path d="M70,42 L180,42 C165,52 140,58 115,58 Z" fill="%23C60C30"/><circle cx="56" cy="46" r="5" fill="%23ffffff"/><polygon points="75,30 84,40 68,40" fill="%23ffffff"/></g></svg>`;

// New York Jets
const NYJ_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="nyjSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23nyjSh)"><ellipse cx="100" cy="60" rx="88" ry="48" fill="%23125740" stroke="%23ffffff" stroke-width="5"/><ellipse cx="100" cy="60" rx="78" ry="38" fill="none" stroke="%23ffffff" stroke-width="2"/><text x="100" y="72" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" font-weight="900" font-style="italic" fill="%23ffffff" text-anchor="middle" letter-spacing="-1">JETS</text></g></svg>`;

// --- AFC NORTH ---
// Baltimore Ravens
const BAL_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="balSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23balSh)"><path d="M25,65 C35,32 75,24 120,26 C160,30 182,54 176,82 C152,96 110,98 66,92 C44,88 28,78 25,65 Z" fill="%23241773" stroke="%23000000" stroke-width="4"/><circle cx="70" cy="48" r="4.5" fill="%23D00000"/><text x="122" y="74" font-family="'Impact', 'Arial Black', sans-serif" font-size="42" font-weight="900" fill="%239E7C0C" stroke="%23ffffff" stroke-width="1.2">B</text></g></svg>`;

// Cincinnati Bengals
const CIN_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><defs><filter id="cinSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23cinSh)"><path d="M40,15 L105,15 C130,15 145,28 145,46 C145,58 135,68 120,72 C138,76 150,88 150,105 C150,118 135,125 105,125 L40,125 Z" fill="%23FB4F14" stroke="%23000000" stroke-width="6"/><path d="M45,25 L85,25 C100,25 115,32 115,46 C115,58 100,64 85,64 L45,64 Z" fill="%23000000"/><path d="M45,76 L90,76 C110,76 120,84 120,98 C120,110 105,115 90,115 L45,115 Z" fill="%23000000"/><polygon points="90,20 115,40 100,45" fill="%23ffffff"/><polygon points="95,78 122,95 105,102" fill="%23ffffff"/></g></svg>`;

// Cleveland Browns
const CLE_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="cleSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23cleSh)"><path d="M45,72 C40,40 70,20 115,20 C160,20 185,45 180,82 C165,100 135,105 95,105 C65,105 48,95 45,72 Z" fill="%23FF3C00" stroke="%23311D00" stroke-width="6"/><path d="M75,22 C110,22 140,32 155,48 L135,55 C120,42 95,35 70,35 Z" fill="%23311D00"/><path d="M85,22 C115,22 145,30 155,42" stroke="%23ffffff" stroke-width="4"/><path d="M125,75 L175,75 L160,95 L115,88 Z" fill="%23311D00" stroke="%23ffffff" stroke-width="2"/></g></svg>`;

// Pittsburgh Steelers
const PIT_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="pitSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23pitSh)"><circle cx="100" cy="60" r="50" fill="%23ffffff" stroke="%23101820" stroke-width="6"/><text x="80" y="44" font-family="'Arial Black', sans-serif" font-size="14" font-weight="900" fill="%23101820">Steelers</text><path d="M130,28 C130,36 122,44 114,44 C122,44 130,52 130,60 C130,52 138,44 146,44 C138,44 130,36 130,28 Z" fill="%23FFB612"/><path d="M114,58 C114,66 106,74 98,74 C106,74 114,82 114,90 C114,82 122,74 130,74 C122,74 114,66 114,58 Z" fill="%2300338D"/><path d="M146,58 C146,66 138,74 130,74 C138,74 146,82 146,90 C146,82 154,74 162,74 C154,74 146,66 146,58 Z" fill="%23C60C30"/></g></svg>`;

// --- AFC SOUTH ---
// Houston Texans
const HOU_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="houSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23houSh)"><path d="M45,28 C75,18 100,32 100,55 C100,85 75,105 45,95 C30,70 30,45 45,28 Z" fill="%2303202F" stroke="%23ffffff" stroke-width="3"/><path d="M155,28 C125,18 100,32 100,55 C100,85 125,105 155,95 C170,70 170,45 155,28 Z" fill="%23A71930" stroke="%23ffffff" stroke-width="3"/><polygon points="72,42 76,52 86,52 78,58 81,68 72,62 63,68 66,58 58,52 68,52" fill="%23ffffff"/></g></svg>`;

// Indianapolis Colts
const IND_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><defs><filter id="indSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23indSh)"><path d="M35,22 L55,22 C55,42 62,55 70,62 C78,55 85,42 85,22 L105,22 C105,52 92,72 80,82 C68,72 35,52 35,22 Z" transform="scale(1.2) translate(-8,-5)" fill="%23002C5F" stroke="%23ffffff" stroke-width="4"/><circle cx="50" cy="36" r="3.5" fill="%23ffffff"/><circle cx="50" cy="52" r="3.5" fill="%23ffffff"/><circle cx="60" cy="68" r="3.5" fill="%23ffffff"/><circle cx="110" cy="36" r="3.5" fill="%23ffffff"/><circle cx="110" cy="52" r="3.5" fill="%23ffffff"/><circle cx="100" cy="68" r="3.5" fill="%23ffffff"/><circle cx="80" cy="80" r="3.5" fill="%23ffffff"/></g></svg>`;

// Jacksonville Jaguars
const JAX_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="jaxSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23jaxSh)"><path d="M30,65 C40,35 80,24 125,24 C165,24 185,48 180,72 C165,95 125,100 85,96 C50,92 32,80 30,65 Z" fill="%23006778" stroke="%23D7A22A" stroke-width="4"/><circle cx="75" cy="46" r="5" fill="%23D7A22A"/><path d="M125,65 C145,65 160,72 170,82 C150,88 130,86 115,80 Z" fill="%23D7A22A"/><path d="M140,78 Q155,88 170,82" stroke="%2300E6FF" stroke-width="4" fill="none"/></g></svg>`;

// Tennessee Titans
const TEN_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="tenSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23tenSh)"><circle cx="85" cy="60" r="44" fill="%230C2340" stroke="%23A5ACAF" stroke-width="4"/><polygon points="85,30 90,44 104,44 93,52 97,66 85,58 73,66 77,52 66,44 80,44" fill="%23C8102E"/><polygon points="100,55 103,64 113,64 105,70 108,79 100,74 92,79 95,70 87,64 97,64" fill="%23C8102E" transform="scale(0.8) translate(30,10)"/><path d="M125,40 Q160,20 185,35 Q160,55 180,75 Q145,70 125,75 Z" fill="%234B92DB" stroke="%23ffffff" stroke-width="2"/></g></svg>`;

// --- AFC WEST ---
// Denver Broncos
const DEN_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="denSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23denSh)"><path d="M30,75 C45,45 80,30 125,28 C155,28 178,42 175,65 C160,55 145,55 130,62 C150,75 160,90 145,98 C115,102 80,95 55,90 C40,88 32,82 30,75 Z" fill="%23ffffff" stroke="%23002244" stroke-width="4"/><path d="M90,30 C120,20 155,30 170,45 C150,45 135,40 120,48 Z" fill="%23FB4F14"/><path d="M70,45 C95,40 120,48 135,62 C115,60 100,55 85,62 Z" fill="%23FB4F14"/><circle cx="140" cy="52" r="4" fill="%23002244"/></g></svg>`;

// Kansas City Chiefs
const KC_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="kcSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23kcSh)"><polygon points="15,60 100,12 185,60 100,108" fill="%23ffffff" stroke="%23000000" stroke-width="4.5"/><polygon points="26,60 100,20 174,60 100,100" fill="%23ffffff" stroke="%23E31837" stroke-width="3"/><text x="100" y="76" font-family="'Impact', 'Arial Black', sans-serif" font-size="46" font-style="italic" font-weight="900" fill="%23E31837" stroke="%23000000" stroke-width="1.8" text-anchor="middle">KC</text></g></svg>`;

// Las Vegas Raiders
const LV_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120"><defs><filter id="lvSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23lvSh)"><path d="M25,20 L155,20 L155,60 C155,95 90,115 90,115 C90,115 25,95 25,60 Z" fill="%23000000" stroke="%23A5ACAF" stroke-width="5"/><path d="M35,28 L145,28 L145,45 L35,45 Z" fill="%23A5ACAF"/><text x="90" y="42" font-family="'Impact', sans-serif" font-size="18" font-weight="900" fill="%23000000" text-anchor="middle" letter-spacing="1">RAIDERS</text><circle cx="90" cy="72" r="24" fill="%23A5ACAF"/><path d="M72,72 L108,72 M90,56 L90,88" stroke="%23000000" stroke-width="4"/></g></svg>`;

// Los Angeles Chargers
const LAC_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="lacSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23lacSh)"><path d="M25,75 C45,40 100,25 155,35 C175,40 185,55 170,68 C145,55 105,52 65,75 L95,78 L45,105 L55,88 Z" fill="%230080C6" stroke="%23FFC20E" stroke-width="5"/><path d="M40,75 C60,48 105,36 150,44" stroke="%23ffffff" stroke-width="2.5" fill="none"/></g></svg>`;

// --- NFC EAST ---
// Dallas Cowboys
const DAL_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140"><defs><filter id="dalSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23dalSh)"><polygon points="80,10 100,52 148,58 114,90 122,136 80,114 38,136 46,90 12,58 60,52" fill="%23003594" stroke="%23ffffff" stroke-width="5"/><polygon points="80,24 96,56 134,61 107,87 114,124 80,106 46,124 53,87 26,61 64,56" fill="%23003594" stroke="%23041E42" stroke-width="2"/></g></svg>`;

// New York Giants
const NYG_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120"><defs><filter id="nygSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23nygSh)"><text x="90" y="82" font-family="'Arial Black', 'Impact', sans-serif" font-size="70" font-style="italic" font-weight="900" fill="%230B2265" stroke="%23A71930" stroke-width="4.5" text-anchor="middle" letter-spacing="-6">ny</text></g></svg>`;

// Philadelphia Eagles
const PHI_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="phiSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23phiSh)"><path d="M165,60 C150,32 110,22 70,24 C48,25 32,32 22,44 C38,46 54,52 65,62 C44,64 30,72 24,84 C38,82 54,86 65,95 C82,99 115,101 148,86 C165,77 176,68 181,60 Z" fill="%23004C54" stroke="%23A5ACAF" stroke-width="4"/><circle cx="60" cy="46" r="4.5" fill="%23ffffff"/><circle cx="60" cy="46" r="2.5" fill="%23000000"/><polygon points="22,44 44,50 28,60" fill="%23A5ACAF"/></g></svg>`;

// Washington Commanders
const WAS_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120"><defs><filter id="wasSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23wasSh)"><path d="M30,20 L62,100 L90,45 L118,100 L150,20 L125,20 L105,75 L90,38 L75,75 L55,20 Z" fill="%235A1414" stroke="%23FFB612" stroke-width="5"/></g></svg>`;

// --- NFC NORTH ---
// Chicago Bears
const CHI_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120"><defs><filter id="chiSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23chiSh)"><path d="M140,32 C125,20 105,16 85,16 C48,16 22,42 22,70 C22,98 48,114 85,114 C108,114 130,105 142,92 L120,78 C112,86 100,92 85,92 C62,92 46,78 46,70 C46,60 62,40 85,40 C100,40 115,46 122,55 Z" fill="%23C83803" stroke="%230B162A" stroke-width="5.5"/></g></svg>`;

// Detroit Lions
const DET_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="detSh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="%23000000" flood-opacity="0.6"/></filter></defs><g filter="url(%23detSh)"><path d="M22,82 C32,68 44,58 60,58 C76,58 82,46 92,32 C98,22 110,18 122,24 C134,30 140,42 136,52 C132,62 146,64 162,62 C170,60 180,66 182,72 C184,78 176,84 160,88 C142,92 132,82 120,82 C108,82 102,92 86,94 C68,96 48,98 26,88 Z" fill="%23ffffff" stroke="%23B0B7BC" stroke-width="3.5"/><path d="M66,51 C78,42 98,38 114,46 C104,56 90,62 74,62 Z" fill="%230076B6"/><circle cx="118" cy="34" r="4" fill="%230076B6"/><path d="M136,54 C144,54 152,56 160,54 C158,60 150,62 142,62 Z" fill="%230076B6"/><path d="M52,72 C68,70 88,74 100,80 C86,82 68,82 52,78 Z" fill="%230076B6"/></g></svg>`;

// Green Bay Packers
const GB_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="gbSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23gbSh)"><ellipse cx="100" cy="60" rx="88" ry="50" fill="%23203731" stroke="%23FFB612" stroke-width="6.5"/><ellipse cx="100" cy="60" rx="79" ry="41" fill="none" stroke="%23ffffff" stroke-width="4"/><text x="100" y="78" font-family="'Impact', 'Arial Black', sans-serif" font-size="58" font-weight="900" fill="%23ffffff" text-anchor="middle">G</text></g></svg>`;

// Minnesota Vikings
const MIN_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120"><defs><filter id="minSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23minSh)"><path d="M45,75 C40,45 68,25 110,25 C145,25 168,48 165,80 C150,98 120,105 85,102 C55,100 45,90 45,75 Z" fill="%234F2683" stroke="%23FFC62F" stroke-width="5"/><path d="M95,30 C110,15 135,10 150,15 C145,30 135,45 120,52 Z" fill="%23FFC62F" stroke="%23ffffff" stroke-width="2"/><path d="M55,65 C75,60 100,68 115,80" stroke="%23ffffff" stroke-width="3" fill="none"/></g></svg>`;

// --- NFC SOUTH ---
// Atlanta Falcons
const ATL_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120"><defs><filter id="atlSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23atlSh)"><path d="M40,20 L155,20 L130,55 L90,55 L115,75 L65,75 L80,105 L35,105 L60,65 L40,65 Z" fill="%23A71930" stroke="%23000000" stroke-width="5"/><polygon points="120,28 140,28 125,48 105,48" fill="%23A5ACAF"/></g></svg>`;

// Carolina Panthers
const CAR_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="carSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23carSh)"><path d="M30,60 C45,30 85,20 130,22 C165,24 185,45 178,72 C160,95 120,100 80,95 C45,90 30,78 30,60 Z" fill="%230085CA" stroke="%23101820" stroke-width="5"/><path d="M70,45 Q90,32 110,48 Q85,55 70,45 Z" fill="%23101820"/><circle cx="138" cy="46" r="4.5" fill="%23ffffff"/><path d="M125,72 L160,65 L145,85 Z" fill="%23ffffff"/></g></svg>`;

// New Orleans Saints
const NO_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 130"><defs><filter id="noSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23noSh)"><path d="M80,10 C90,35 110,50 110,65 C110,80 95,95 80,95 C65,95 50,80 50,65 C50,50 70,35 80,10 Z" fill="%23D3BC8D" stroke="%23101820" stroke-width="4"/><path d="M80,95 L80,120 M60,115 L100,115" stroke="%23101820" stroke-width="6"/><path d="M45,55 C30,45 15,55 15,70 C15,90 40,95 65,85 C55,75 45,65 45,55 Z" fill="%23D3BC8D" stroke="%23101820" stroke-width="3.5"/><path d="M115,55 C130,45 145,55 145,70 C145,90 120,95 95,85 C105,75 115,65 115,55 Z" fill="%23D3BC8D" stroke="%23101820" stroke-width="3.5"/></g></svg>`;

// Tampa Bay Buccaneers
const TB_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120"><defs><filter id="tbSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23tbSh)"><path d="M30,25 L150,35 L125,95 L40,82 Z" fill="%23D50A0A" stroke="%2334302B" stroke-width="4"/><line x1="25" y1="15" x2="45" y2="110" stroke="%23A5ACAF" stroke-width="5" stroke-linecap="round"/><circle cx="85" cy="55" r="14" fill="%23ffffff"/><polygon points="78,72 92,72 85,82" fill="%23ffffff"/><ellipse cx="78" cy="54" rx="3.5" ry="5" fill="%23000000"/><ellipse cx="92" cy="54" rx="3.5" ry="5" fill="%23000000"/></g></svg>`;

// --- NFC WEST ---
// Arizona Cardinals
const ARI_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120"><defs><filter id="ariSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23ariSh)"><path d="M30,65 C45,30 90,20 135,22 C165,24 175,45 160,65 C135,58 115,60 95,72 C70,85 45,82 30,65 Z" fill="%2397233F" stroke="%23000000" stroke-width="4.5"/><polygon points="135,50 175,65 140,75" fill="%23FFB612" stroke="%23000000" stroke-width="2"/><circle cx="118" cy="46" r="4.5" fill="%23ffffff"/><circle cx="118" cy="46" r="2.5" fill="%23000000"/></g></svg>`;

// Los Angeles Rams
const LAR_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="larSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23larSh)"><path d="M35,90 L75,20 L115,90 L95,90 L85,70 L60,70 L52,90 Z" fill="%23003594" stroke="%23FFA300" stroke-width="3"/><path d="M85,25 C120,20 160,40 165,75 C168,95 150,110 130,105 C115,100 120,85 130,85 C142,85 145,72 135,55 C120,40 95,45 85,52 Z" fill="%23FFA300" stroke="%23ffffff" stroke-width="3"/></g></svg>`;

// San Francisco 49ers
const SF_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="sfSh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="%23000000" flood-opacity="0.7"/></filter></defs><g filter="url(%23sfSh)"><ellipse cx="100" cy="60" rx="90" ry="52" fill="%23AA0000" stroke="%23B3995D" stroke-width="6"/><ellipse cx="100" cy="60" rx="82" ry="44" fill="none" stroke="%23000000" stroke-width="2.5"/><ellipse cx="100" cy="60" rx="79" ry="41" fill="none" stroke="%23ffffff" stroke-width="3"/><text x="100" y="75" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" font-style="italic" font-weight="900" fill="%23ffffff" stroke="%23000000" stroke-width="1.8" text-anchor="middle" letter-spacing="-2">SF</text></g></svg>`;

// Seattle Seahawks
const SEA_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="seaSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23seaSh)"><path d="M25,55 C50,30 95,25 150,30 C180,35 185,55 170,72 C135,60 90,62 55,80 C40,78 30,68 25,55 Z" fill="%23002244" stroke="%23A5ACAF" stroke-width="3.5"/><path d="M55,80 C90,62 135,60 170,72 C145,95 90,105 45,95 Z" fill="%2369BE28"/><circle cx="140" cy="46" r="5" fill="%2369BE28"/><circle cx="140" cy="46" r="2.5" fill="%23002244"/></g></svg>`;

// --- CUSTOM & LFG LEAGUE TEAMS ---
// Comet Huskies
const HSK_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110"><defs><filter id="hskSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23hskSh)"><polygon points="70,8 122,95 18,95" fill="%231E40AF" stroke="%2338BDF8" stroke-width="4.5"/><polygon points="70,24 106,88 34,88" fill="%230F172A"/><path d="M70,38 L88,80 L52,80 Z" fill="%2338BDF8"/><circle cx="70,56" r="11" fill="%23FFFFFF"/><polygon points="64,50 76,50 70,62" fill="%230284C7"/></g></svg>`;

// Viper Cadets
const VIP_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110"><defs><filter id="vipSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23vipSh)"><polygon points="70,10 120,42 104,98 36,98 20,42" fill="%23B91C1C" stroke="%23EF4444" stroke-width="4.5"/><polygon points="70,22 108,48 94,88 46,88 32,48" fill="%23450A0A"/><path d="M48,50 Q70,32 92,50 Q70,90 48,50 Z" fill="%23EF4444"/><circle cx="60" cy="52" r="3.5" fill="%23FEF08A"/><circle cx="80" cy="52" r="3.5" fill="%23FEF08A"/></g></svg>`;

// Thunder Wolves
const WLV_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110"><defs><filter id="wlvSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23wlvSh)"><circle cx="70" cy="55" r="48" fill="%230284C7" stroke="%2338BDF8" stroke-width="4.5"/><polygon points="70,16 84,42 112,46 90,66 96,94 70,78 44,94 50,66 28,46 56,42" fill="%2338BDF8"/><polygon points="72,30 60,54 76,54 62,80 82,50 68,50" fill="%23FEF08A"/></g></svg>`;

// Solar Flares
const SLR_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110"><defs><filter id="slrSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23slrSh)"><polygon points="70,8 82,38 118,55 82,72 70,102 58,72 22,55 58,38" fill="%23EA580C" stroke="%23FB923C" stroke-width="4"/><circle cx="70" cy="55" r="25" fill="%23F97316"/><circle cx="70" cy="55" r="16" fill="%23FEF08A"/></g></svg>`;

// Phantom Reapers
const RPR_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110"><defs><filter id="rprSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23rprSh)"><polygon points="70,10 112,32 112,78 70,100 28,78 28,32" fill="%237C3AED" stroke="%23C084FC" stroke-width="4.5"/><polygon points="70,22 100,38 100,72 70,90 40,72 40,38" fill="%232E1065"/><path d="M52,54 C52,40 88,40 88,54 C88,72 70,84 70,84 C70,84 52,72 52,54 Z" fill="%23C084FC"/></g></svg>`;

// Emerald Titans
const TTN_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110"><defs><filter id="ttnSh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23ttnSh)"><polygon points="70,8 114,26 114,68 70,102 26,68 26,26" fill="%23059669" stroke="%2334D399" stroke-width="4.5"/><polygon points="70,20 102,34 102,62 70,90 38,62 38,34" fill="%23064E3B"/><polygon points="58,40 82,40 82,50 76,50 76,78 64,78 64,50 58,50" fill="%2334D399"/></g></svg>`;

// =========================================================================
// MASTER REGISTRY OF ALL 38 TEAMS
// =========================================================================
export const BUILT_IN_TEAMS: TeamDefinition[] = [
  // --- NFC North ---
  {
    name: 'Detroit Lions',
    abbr: 'DET',
    logoUrl: DET_LOGO,
    gradients: ['#0076B6', '#041E42'],
    accent: '#0076B6'
  },
  {
    name: 'Green Bay Packers',
    abbr: 'GB',
    logoUrl: GB_LOGO,
    gradients: ['#203731', '#11211D'],
    accent: '#FFB612'
  },
  {
    name: 'Chicago Bears',
    abbr: 'CHI',
    logoUrl: CHI_LOGO,
    gradients: ['#0B162A', '#C83803'],
    accent: '#C83803'
  },
  {
    name: 'Minnesota Vikings',
    abbr: 'MIN',
    logoUrl: MIN_LOGO,
    gradients: ['#4F2683', '#241040'],
    accent: '#FFC62F'
  },

  // --- NFC West ---
  {
    name: 'San Francisco 49ers',
    abbr: 'SF',
    logoUrl: SF_LOGO,
    gradients: ['#AA0000', '#4B0000'],
    accent: '#B3995D'
  },
  {
    name: 'Seattle Seahawks',
    abbr: 'SEA',
    logoUrl: SEA_LOGO,
    gradients: ['#002244', '#081626'],
    accent: '#69BE28'
  },
  {
    name: 'Los Angeles Rams',
    abbr: 'LAR',
    logoUrl: LAR_LOGO,
    gradients: ['#003594', '#001A4D'],
    accent: '#FFA300'
  },
  {
    name: 'Arizona Cardinals',
    abbr: 'ARI',
    logoUrl: ARI_LOGO,
    gradients: ['#97233F', '#400915'],
    accent: '#FFB612'
  },

  // --- NFC East ---
  {
    name: 'Dallas Cowboys',
    abbr: 'DAL',
    logoUrl: DAL_LOGO,
    gradients: ['#003594', '#041E42'],
    accent: '#003594'
  },
  {
    name: 'Philadelphia Eagles',
    abbr: 'PHI',
    logoUrl: PHI_LOGO,
    gradients: ['#004C54', '#022428'],
    accent: '#A5ACAF'
  },
  {
    name: 'New York Giants',
    abbr: 'NYG',
    logoUrl: NYG_LOGO,
    gradients: ['#0B2265', '#040F2E'],
    accent: '#A71930'
  },
  {
    name: 'Washington Commanders',
    abbr: 'WAS',
    logoUrl: WAS_LOGO,
    gradients: ['#5A1414', '#260606'],
    accent: '#FFB612'
  },

  // --- NFC South ---
  {
    name: 'Tampa Bay Buccaneers',
    abbr: 'TB',
    logoUrl: TB_LOGO,
    gradients: ['#D50A0A', '#4A0303'],
    accent: '#FF7900'
  },
  {
    name: 'New Orleans Saints',
    abbr: 'NO',
    logoUrl: NO_LOGO,
    gradients: ['#D3BC8D', '#101820'],
    accent: '#D3BC8D'
  },
  {
    name: 'Atlanta Falcons',
    abbr: 'ATL',
    logoUrl: ATL_LOGO,
    gradients: ['#A71930', '#101820'],
    accent: '#A71930'
  },
  {
    name: 'Carolina Panthers',
    abbr: 'CAR',
    logoUrl: CAR_LOGO,
    gradients: ['#0085CA', '#101820'],
    accent: '#0085CA'
  },

  // --- AFC West ---
  {
    name: 'Kansas City Chiefs',
    abbr: 'KC',
    logoUrl: KC_LOGO,
    gradients: ['#E31837', '#7F0A1D'],
    accent: '#FFB81C'
  },
  {
    name: 'Denver Broncos',
    abbr: 'DEN',
    logoUrl: DEN_LOGO,
    gradients: ['#FB4F14', '#002244'],
    accent: '#FB4F14'
  },
  {
    name: 'Las Vegas Raiders',
    abbr: 'LV',
    logoUrl: LV_LOGO,
    gradients: ['#A5ACAF', '#101820'],
    accent: '#A5ACAF'
  },
  {
    name: 'Los Angeles Chargers',
    abbr: 'LAC',
    logoUrl: LAC_LOGO,
    gradients: ['#0080C6', '#023854'],
    accent: '#FFC20E'
  },

  // --- AFC East ---
  {
    name: 'Buffalo Bills',
    abbr: 'BUF',
    logoUrl: BUF_LOGO,
    gradients: ['#00338D', '#031A47'],
    accent: '#C60C30'
  },
  {
    name: 'Miami Dolphins',
    abbr: 'MIA',
    logoUrl: MIA_LOGO,
    gradients: ['#008E97', '#01494E'],
    accent: '#FC4C02'
  },
  {
    name: 'New England Patriots',
    abbr: 'NE',
    logoUrl: NE_LOGO,
    gradients: ['#002244', '#081626'],
    accent: '#C60C30'
  },
  {
    name: 'New York Jets',
    abbr: 'NYJ',
    logoUrl: NYJ_LOGO,
    gradients: ['#125740', '#06261B'],
    accent: '#FFFFFF'
  },

  // --- AFC North ---
  {
    name: 'Baltimore Ravens',
    abbr: 'BAL',
    logoUrl: BAL_LOGO,
    gradients: ['#241773', '#110A3B'],
    accent: '#9E7C0C'
  },
  {
    name: 'Cincinnati Bengals',
    abbr: 'CIN',
    logoUrl: CIN_LOGO,
    gradients: ['#FB4F14', '#000000'],
    accent: '#FB4F14'
  },
  {
    name: 'Cleveland Browns',
    abbr: 'CLE',
    logoUrl: CLE_LOGO,
    gradients: ['#311D00', '#FF3C00'],
    accent: '#FF3C00'
  },
  {
    name: 'Pittsburgh Steelers',
    abbr: 'PIT',
    logoUrl: PIT_LOGO,
    gradients: ['#101820', '#FFB612'],
    accent: '#FFB612'
  },

  // --- AFC South ---
  {
    name: 'Houston Texans',
    abbr: 'HOU',
    logoUrl: HOU_LOGO,
    gradients: ['#03202F', '#A71930'],
    accent: '#A71930'
  },
  {
    name: 'Indianapolis Colts',
    abbr: 'IND',
    logoUrl: IND_LOGO,
    gradients: ['#002C5F', '#04142B'],
    accent: '#FFFFFF'
  },
  {
    name: 'Jacksonville Jaguars',
    abbr: 'JAX',
    logoUrl: JAX_LOGO,
    gradients: ['#006778', '#D7A22A'],
    accent: '#D7A22A'
  },
  {
    name: 'Tennessee Titans',
    abbr: 'TEN',
    logoUrl: TEN_LOGO,
    gradients: ['#0C2340', '#4B92DB'],
    accent: '#C8102E'
  },

  // --- Custom LFG Teams ---
  {
    name: 'Comet Huskies',
    abbr: 'HSK',
    logoUrl: HSK_LOGO,
    gradients: ['#1E40AF', '#0F172A'],
    accent: '#38BDF8'
  },
  {
    name: 'Viper Cadets',
    abbr: 'VIP',
    logoUrl: VIP_LOGO,
    gradients: ['#B91C1C', '#450A0A'],
    accent: '#EF4444'
  },
  {
    name: 'Thunder Wolves',
    abbr: 'WLV',
    logoUrl: WLV_LOGO,
    gradients: ['#0284C7', '#082F49'],
    accent: '#38BDF8'
  },
  {
    name: 'Solar Flares',
    abbr: 'SLR',
    logoUrl: SLR_LOGO,
    gradients: ['#EA580C', '#431407'],
    accent: '#FB923C'
  },
  {
    name: 'Phantom Reapers',
    abbr: 'RPR',
    logoUrl: RPR_LOGO,
    gradients: ['#7C3AED', '#2E1065'],
    accent: '#C084FC'
  },
  {
    name: 'Emerald Titans',
    abbr: 'TTN',
    logoUrl: TTN_LOGO,
    gradients: ['#059669', '#064E3B'],
    accent: '#34D399'
  }
];

/**
 * Generate a metallic sports shield crest logo for any custom or unrecognized team
 * so it ALWAYS renders an official broadcast emblem, NEVER raw text!
 */
export function generateGenericTeamLogo(codeOrName: string, primaryColor = '#0076B6'): string {
  const cleanCode = (codeOrName || 'TM').trim().slice(0, 4).toUpperCase();
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 110"><defs><linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.25"/><stop offset="100%" stop-color="%23000000" stop-opacity="0.45"/></linearGradient><filter id="crestShadow"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.8"/></filter></defs><g filter="url(%23crestShadow)"><path d="M80,10 L135,26 C135,70 108,92 80,102 C52,92 25,70 25,26 Z" fill="${encodeURIComponent(primaryColor)}" stroke="%23ffffff" stroke-width="4"/><path d="M80,10 L135,26 C135,70 108,92 80,102 C52,92 25,70 25,26 Z" fill="url(%23shieldGrad)" stroke="%23000000" stroke-width="1.5"/><text x="80" y="66" font-family="'Impact', 'Arial Black', sans-serif" font-size="${cleanCode.length > 3 ? 30 : 36}" font-style="italic" font-weight="900" fill="%23ffffff" stroke="%23000000" stroke-width="1.5" text-anchor="middle" letter-spacing="-0.5">${cleanCode}</text></g></svg>`;
}

/**
 * Resolves the team's visual logo image URL.
 * Guarantees that a valid graphical logo is returned.
 */
export function resolveTeamLogo(teamCodeOrName: string, customLogoUrl?: string, primaryColor?: string): string {
  if (customLogoUrl && customLogoUrl.trim().length > 0) {
    return customLogoUrl;
  }

  const query = (teamCodeOrName || '').trim().toLowerCase();
  if (!query) {
    return generateGenericTeamLogo('TM', primaryColor || '#0076B6');
  }

  // Exact or partial match in built-in teams
  const found = BUILT_IN_TEAMS.find(
    (t) => t.abbr.toLowerCase() === query || t.name.toLowerCase() === query || t.name.toLowerCase().includes(query)
  );

  if (found && found.logoUrl) {
    return found.logoUrl;
  }

  return generateGenericTeamLogo(teamCodeOrName, primaryColor || '#0076B6');
}
