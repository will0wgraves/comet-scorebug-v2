import { TeamInfo } from '../types';

export interface LFGColorEntry {
  name: string;
  abbr: string;
  primary: string;
  secondary: string;
  accent: string;
  extras?: string[];
  logoUrl?: string;
}

// Full raw official LFG color sheet text as provided
export const LFG_OFFICIAL_COLOR_SHEET_RAW = `Akron
#173a5f
#e6b144
#0a233f
#cd8a22

Albany
#5c298c
#b2b2b4
#717481

Albuquerque
#dc2614
#3d9118
#ffad24

Allentown
#111a29
#f1f4eb
#365975

Anaheim
#e61d21
#fcab00

Atlanta
#e11943
#161612
#b4bfcb

Augusta
#255b8b
#f4be31
#c1ae8c
#12253c

Austin Riverbats
#1d417e
#ed8135
#3a69aa
#fcd9ad

Bakersfield
#bc1d32
#b0b5b7
#80151e
#727a7c

Baltimore
#9c3bdf
#040405
#fff866
#7c759d

Baton Rouge
#67449f
#ecb912

Berlin Iron Bears
#444749
#dd2d33
#767979
#131517

Boston Minutemen
#00152f
#a3141f
#f8e3cf
#620f15

Boise
#0075f3
#ff6913
#102442

Buffalo
#06619f
#e12521
#01366b

Cedar Rapids
#ecb912
#161c23

Charleston
#13c0bb
#d5a045

Charlotte
#2bb6e5
#14161d

Chattanooga
#e0b463
#202427

Cheyenne
#763c10
#dfa217
#190000

Chicago Mob
#e9b334
#000000

Cincinnati
#e95308
#201f1e

Cleveland
#ef710e
#f8f7f5
#874b24

Colorado Springs
#e4c372
#302f32

Columbia
#8f191d
#121719
#3f1213

Columbus
#92a2ae
#be2324
#182933

Dallas Outlaws
#ce730f
#e7be7c
#756047

Davenport
#0b224a
#ffe602

Denver
#1a3451
#da5516
#2d65a5

Detroit
#0070a8
#6e8c90
#12b0e4
#dcdad0

Durham
#72afc9
#d2e3e9
#24354a

El Paso
#155499
#d24501
#68a0f7

Eugene
#2b7d5c
#fbce14

Evansville
#d63753
#fdfdfd

Fayetteville
#ff7901
#659928
#122630

Flagstaff
#ab3156
#fed048
#c06f09

Fort Collins
#3f7e62
#dcce6d
#736724
#fdfee9

Fort Lauderdale
#26c085
#ff760b

Fort Wayne
#243e58
#debf7c
#926018
#7cbfff

Fort Worth
#914fc5
#a3a3a6

Fresno
#f81431
#08479a

Gainesville
#4998f2
#e96919
#0a1c38

Grand Rapids
#0f2845
#ecda5f

Green Bay
#335226
#fcc501
#7bbb2c

Greensboro
#2179dc
#fefefe
#05192c

Greenville
#391954
#f26b14

Harrisburg
#6f2036
#fdffff

Hartford
#07193b
#fefefe

Honolulu
#43826e
#fcfffd

Houston
#32609b
#dd0f30
#1a2035

Huntsville
#4c1118
#b49c95

Indianapolis
#0d284f
#f9fbf8
#b8e3e7

Jackson
#90cdef
#cd2436
#1d2335

Jacksonville
#0d7c82
#cca356
#1d2335

Kansas City
#df0e2a
#f6af0a

Knoxville
#e7781e
#fdfdfd
#1e1d22

Lansing
#489974
#e2eae6
#15271f

Las Vegas Jokers
#ad010d
#e6ad2c
#0a0a0a

Lexington
#0095ff
#fefefe
#004aff
#041c3e

Little Rock
#ba243d
#faf9f2
#281728

Long Beach
#29a2f0
#ffbf01
#002b53
#03162d

Long Island
#70c6ec
#ffc21e

Los Angeles Admirals
#0070d0
#ffff00
#004498
#ffd000
#00234d

Louisville
#f72133
#f9c109
#301119

London Monarchs
#9a121e
#e0ad3d
#cc8c3a
#b81222

Lubbock
#ff1e3c
#575855
#0e1313

Madison
#d80422
#ffffff
#151326

Madrid Toros
#791114
#d29240
#432b18
#efd099

Memphis
#5aa8f4
#ffffff
#3568a9

Mexico City Aztecs
#186557
#e1ad55

Miami Barracudas
#0f7280
#e46149
#bac2c9
#0a4855

Milwaukee
#458a35
#f0f40f
#f7fee2

Minneapolis
#3e1a56
#fafaf6
#fbf619

Mobile
#76213e
#95999c

Montgomery
#f1560a
#2a6fca
#a3dcf2

Naperville
#c9b36d
#110f06
#ece6ad

Nashville
#141e38
#6eb9cc
#c60c30

Newark
#264b41
#cfdbd8

New Haven
#e92329
#e69312
#fdcf33

New Orleans
#dbc299
#0b0432

New York Empire
#20857a
#c75820
#001e30
#d7842c

Norfolk
#870533
#bc430c

Oakland
#075aa0
#f7b214
#001e41
#ffd976

Oklahoma City Bison
#7a2113
#c48950
#a47140
#2a1811
#e7c292

Omaha
#f51931
#d98a1f

Orlando
#e5b765
#0d1318

Paris Chevaliers
#132741
#5b1a27
#b0bac1

Peoria
#25a1fb
#eb542c
#1a1c31

Philadelphia
#327672
#d3dae0
#1e2a36

Pittsburgh
#f9ba24
#14181c
#a7afa2

Phoenix
#b51e25
#f8bb1f
#f82835

Portland
#f66d0b
#493a32
#272224

Provo
#8eb0cd
#f8f9f2
#012f7a

Raleigh
#ad1f27
#131a16

Reno
#6487b0
#dbe2e6
#7f9bb1

Richmond
#fe7923
#87b7d7
#1d3048

Riverside
#8b042c
#959496

Rochester
#ff0123
#474747
#ffffff

Sacramento
#af1b1e
#fdfdfc

San Antonio
#94394d
#e7dbd3
#431d28

San Diego
#1e6eb6
#fcb511
#e4e6de

San Francisco Rush
#b70e01
#fdb006
#fdcf43

San Jose
#418cde
#cdad57

Savannah
#b10623
#2a4048

St.Louis
#edc426
#12191c

Sao Paulo Harpies
#1d743c
#cfde2c
#fee29a

St.Paul
#72092a
#df931d
#3a141f

Seattle
#181c33
#99c951
#0cb9f1

Seoul White Tigers
#074ea1
#fdfdfd
#071840

Shreveport
#7a2f2d
#cfcfcc

Springfield
#e00918
#1067af
#011737

Spokane
#821b3c
#9e948c
#1a1c31
#49172f

Sydney Redbacks
#dc1720
#59595a
#1f1f1f

Syracuse
#ff8103
#0e77c6
#ce3907
#034588

Tacoma
#6e3ea0
#dbba72
#a47e37

Tallahassee
#7e2a40
#c9aa6c

Tampa
#9c0806
#09110d
#fff3e2

Tokyo Ronin
#bf020f
#4f4e48
#85070a

Toledo
#0e3659
#f9c23a
#38bce6
#fffdeb

Topeka
#5f278e
#a0a2af
#10061c

Toronto Huskies
#2585a5
#b8ccbd
#001e3b

Trenton
#ce3a47
#03111a
#fd535d

Tucson
#fe0024
#1f91ff
#8f000e

Tulsa
#f9540f
#5c5d61
#0f1923

Utah Raptors
#c1490e
#2f2e2c
#d2a16c
#886f5b

Virginia Beach
#1b7be5
#fdfffe

Washington
#862f30
#e4a330

Wilmington
#8a36d5
#fbd00b

Winston-Salem
#cfa955
#1c1b11`;

// Abbreviation dictionary for known cities/teams
export const KNOWN_ABBRS: Record<string, string> = {
  akron: 'AKR',
  albany: 'ALB',
  albuquerque: 'ABQ',
  allentown: 'ALL',
  anaheim: 'ANA',
  atlanta: 'ATL',
  augusta: 'AUG',
  'austin riverbats': 'ATX',
  bakersfield: 'BAK',
  baltimore: 'BAL',
  'baton rouge': 'BTR',
  'berlin iron bears': 'BER',
  'boston minutemen': 'BOS',
  boise: 'BOI',
  buffalo: 'BUF',
  'cedar rapids': 'CR',
  charleston: 'CHS',
  charlotte: 'CLT',
  chattanooga: 'CHA',
  cheyenne: 'CHY',
  'chicago mob': 'CHI',
  cincinnati: 'CIN',
  cleveland: 'CLE',
  'colorado springs': 'COS',
  columbia: 'COL',
  columbus: 'CMH',
  'dallas outlaws': 'DAL',
  davenport: 'DAV',
  denver: 'DEN',
  detroit: 'DET',
  durham: 'DUR',
  'el paso': 'ELP',
  eugene: 'EUG',
  evansville: 'EVN',
  fayetteville: 'FAY',
  flagstaff: 'FLG',
  'fort collins': 'FTC',
  'fort lauderdale': 'FTL',
  'fort wayne': 'FTW',
  'fort worth': 'FW',
  fresno: 'FRE',
  gainesville: 'GNV',
  'grand rapids': 'GR',
  'green bay': 'GB',
  greensboro: 'GBO',
  greenville: 'GRN',
  harrisburg: 'HAR',
  hartford: 'HFD',
  honolulu: 'HNL',
  houston: 'HOU',
  huntsville: 'HSV',
  indianapolis: 'IND',
  jackson: 'JAN',
  jacksonville: 'JAX',
  'kansas city': 'KC',
  knoxville: 'KNX',
  lansing: 'LAN',
  'las vegas jokers': 'LV',
  lexington: 'LEX',
  'little rock': 'LIT',
  'long beach': 'LGB',
  'long island': 'LI',
  'los angeles admirals': 'LAA',
  louisville: 'LOU',
  'london monarchs': 'LON',
  lubbock: 'LBB',
  madison: 'MSN',
  'madrid toros': 'MAD',
  memphis: 'MEM',
  'mexico city aztecs': 'MEX',
  'miami barracudas': 'MIA',
  milwaukee: 'MKE',
  minneapolis: 'MIN',
  mobile: 'MOB',
  montgomery: 'MGM',
  naperville: 'NAP',
  nashville: 'NSH',
  newark: 'NWK',
  'new haven': 'HVN',
  'new orleans': 'MSY',
  'new york empire': 'NYE',
  norfolk: 'ORF',
  oakland: 'OAK',
  'oklahoma city bison': 'OKC',
  omaha: 'OMA',
  orlando: 'ORL',
  'paris chevaliers': 'PAR',
  peoria: 'PIA',
  philadelphia: 'PHI',
  pittsburgh: 'PIT',
  phoenix: 'PHX',
  portland: 'POR',
  provo: 'PVU',
  raleigh: 'RAL',
  reno: 'RNO',
  richmond: 'RIC',
  riverside: 'RIV',
  rochester: 'ROC',
  sacramento: 'SAC',
  'san antonio': 'SAT',
  'san diego': 'SD',
  'san francisco rush': 'SFR',
  'san jose': 'SJC',
  savannah: 'SAV',
  'st.louis': 'STL',
  'st. louis': 'STL',
  'sao paulo harpies': 'SPH',
  'st.paul': 'STP',
  'st. paul': 'STP',
  seattle: 'SEA',
  'seoul white tigers': 'SWT',
  shreveport: 'SHV',
  springfield: 'SPF',
  spokane: 'SPO',
  'sydney redbacks': 'SYD',
  syracuse: 'SYR',
  tacoma: 'TAC',
  tallahassee: 'TLH',
  tampa: 'TPA',
  'tokyo ronin': 'TKO',
  toledo: 'TOL',
  topeka: 'TOP',
  'toronto huskies': 'TOR',
  trenton: 'TRN',
  tucson: 'TUC',
  tulsa: 'TUL',
  'utah raptors': 'UTH',
  'virginia beach': 'VB',
  washington: 'WAS',
  wilmington: 'ILM',
  'winston-salem': 'WS'
};

export function inferAbbreviation(name: string): string {
  const clean = name.trim().toLowerCase();
  if (KNOWN_ABBRS[clean]) return KNOWN_ABBRS[clean];

  // Try 3 letters from first word or initials
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    const initials = words.map(w => w[0]).join('').toUpperCase();
    if (initials.length >= 2 && initials.length <= 4) return initials;
  }
  return name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'TM';
}

/**
 * Parses raw text containing team names and hex codes.
 * Supports:
 *  1. Vertical block format (LFG color sheet)
 *  2. Line format: TeamName: #hex1, #hex2, #hex3
 *  3. CSV: TeamName, #hex1, #hex2
 *  4. JSON: array of TeamInfo
 *  5. Pure hex list (without name): #hex1, #hex2
 */
export function parseHexImportText(rawInput: string): TeamInfo[] {
  const text = rawInput.trim();
  if (!text) return [];

  // Attempt JSON parse first
  if (text.startsWith('[') && text.endsWith(']')) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(t => t && (t.name || t.abbr))
          .map(t => ({
            name: t.name || t.abbr,
            abbr: t.abbr || inferAbbreviation(t.name || ''),
            logoUrl: t.logoUrl || '',
            gradients: (Array.isArray(t.gradients) && t.gradients.length >= 2
              ? [t.gradients[0], t.gradients[1]]
              : ['#173a5f', '#e6b144']) as [string, string],
            accent: t.accent || t.gradients?.[1] || '#e6b144'
          }));
      }
    } catch (_) {
      // Continue to text parser
    }
  }

  const lines = text.split(/\r?\n/).map(l => l.trim());
  const teams: TeamInfo[] = [];

  let currentName = '';
  let currentHexes: string[] = [];

  const flushTeam = () => {
    if (currentName && currentHexes.length > 0) {
      const primary = currentHexes[0];
      const secondary = currentHexes[1] || primary;
      const accent = currentHexes[2] || secondary;
      teams.push({
        name: currentName,
        abbr: inferAbbreviation(currentName),
        logoUrl: '',
        gradients: [primary, secondary],
        accent
      });
    }
    currentName = '';
    currentHexes = [];
  };

  const isHexLine = (str: string) => {
    const clean = str.replace(/[,;]/g, ' ').trim();
    const parts = clean.split(/\s+/);
    return parts.every(p => /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(p));
  };

  const extractHexes = (str: string): string[] => {
    const matches = str.match(/#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g) || [];
    return matches.map(h => (h.startsWith('#') ? h : `#${h}`));
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      flushTeam();
      continue;
    }

    // Check if line contains a colon or comma with hexes: "Akron: #173a5f, #e6b144"
    if ((line.includes(':') || line.includes(',') || line.includes('-')) && extractHexes(line).length >= 1) {
      flushTeam();
      const delim = line.includes(':') ? ':' : line.includes('-') ? '-' : ',';
      const firstDelimIdx = line.indexOf(delim);
      const namePart = line.slice(0, firstDelimIdx).trim();
      const hexPart = line.slice(firstDelimIdx + 1);
      const hexes = extractHexes(hexPart);
      if (namePart && hexes.length > 0) {
        teams.push({
          name: namePart,
          abbr: inferAbbreviation(namePart),
          logoUrl: '',
          gradients: [hexes[0], hexes[1] || hexes[0]],
          accent: hexes[2] || hexes[1] || hexes[0]
        });
      }
      continue;
    }

    // Check if line is purely hex code(s)
    if (isHexLine(line)) {
      const hexes = extractHexes(line);
      currentHexes.push(...hexes);
    } else {
      // It's a team name header!
      flushTeam();
      currentName = line;
    }
  }

  flushTeam();
  return teams;
}

// Generate the full default LFG teams roster from the official raw sheet
export const ALL_LFG_TEAMS: TeamInfo[] = parseHexImportText(LFG_OFFICIAL_COLOR_SHEET_RAW);
