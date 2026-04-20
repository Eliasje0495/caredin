/* eslint-disable react/no-unescaped-entities */
// lib/overeenkomst.tsx — Modelovereenkomst van Opdracht voor CaredIn
// Gebaseerd op Belastingdienst modelovereenkomst nr. 90615.36558 (30 juni 2016)

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const dark   = "#0F1C1A";
const muted  = "#444";
const light  = "#666";
const border = "#ccc";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: dark,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 56,
    lineHeight: 1.55,
  },
  // Header bar
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  headerPlatform: { fontSize: 10, color: muted },
  headerDate: { fontSize: 10, color: muted },
  // Title
  mainTitle: { fontSize: 28, fontFamily: "Helvetica-Bold", color: dark, marginBottom: 8 },
  intro: { fontSize: 10, color: muted, marginBottom: 20, lineHeight: 1.5 },
  // Section headings
  h1: { fontSize: 14, fontFamily: "Helvetica-Bold", color: dark, marginTop: 14, marginBottom: 6 },
  h2: { fontSize: 11, fontFamily: "Helvetica-Bold", color: dark, marginTop: 10, marginBottom: 4 },
  h3: { fontSize: 10, fontFamily: "Helvetica-Bold", color: dark, marginTop: 6, marginBottom: 2 },
  // Body
  p: { fontSize: 10, color: muted, marginBottom: 6, lineHeight: 1.55 },
  pSmall: { fontSize: 8.5, color: light, marginBottom: 4, lineHeight: 1.5 },
  // Bullet list
  li: { flexDirection: "row", marginBottom: 2 },
  bullet: { width: 12, fontSize: 10, color: muted },
  liText: { flex: 1, fontSize: 10, color: muted, lineHeight: 1.5 },
  // Numbered list
  nli: { flexDirection: "row", marginBottom: 4 },
  num: { width: 20, fontSize: 10, color: muted },
  numText: { flex: 1, fontSize: 10, color: muted, lineHeight: 1.55 },
  bold: { fontFamily: "Helvetica-Bold" },
  // Divider
  hr: { borderBottom: `0.5 solid ${border}`, marginVertical: 12 },
  // Signature
  sigRow: { flexDirection: "row", marginTop: 32, gap: 40 },
  sigBox: { flex: 1 },
  sigLine: { borderBottom: `1 solid ${dark}`, marginBottom: 4, marginTop: 28 },
  sigLabel: { fontSize: 9, color: muted },
  // Footer
  footer: {
    position: "absolute", bottom: 24, left: 56, right: 56,
    flexDirection: "row", justifyContent: "space-between",
    borderTop: `0.5 solid ${border}`, paddingTop: 5,
  },
  footerText: { fontSize: 8, color: light },
});

export interface OvereenkomstData {
  workerName: string;
  workerEmail: string;
  workerAddress?: string;
  workerCity?: string;
  kvkNumber?: string;
  kvkCompanyName?: string;
  companyName: string;
  companyAddress?: string;
  companyCity?: string;
  companyKvk?: string;
  shiftTitle: string;
  shiftDescription?: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  address: string;
  city: string;
  hourlyRate: string;
  contractType: string;
  applicationId: string;
  generatedAt: string;
  generatedTime: string;
}

function P({ children }: { children: React.ReactNode }) {
  return <Text style={s.p}>{children}</Text>;
}
function H1({ children }: { children: React.ReactNode }) {
  return <Text style={s.h1}>{children}</Text>;
}
function H2({ children }: { children: React.ReactNode }) {
  return <Text style={s.h2}>{children}</Text>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <Text style={s.h3}>{children}</Text>;
}
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.li}>
      <Text style={s.bullet}>•</Text>
      <Text style={s.liText}>{children}</Text>
    </View>
  );
}
function NLI({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <View style={s.nli}>
      <Text style={s.num}>{n}.</Text>
      <Text style={s.numText}>{children}</Text>
    </View>
  );
}

export function OvereenkomstDocument({ d }: { d: OvereenkomstData }) {
  const isZzp = d.contractType !== "LOONDIENST";
  const ref = d.applicationId.slice(-8).toUpperCase();

  return (
    <Document title={`Overeenkomst van Opdracht — ${d.shiftTitle}`} author="CaredIn">
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.headerRow}>
          <Text style={s.headerPlatform}>CaredIn · caredin.nl</Text>
          <Text style={s.headerDate}>{d.generatedAt} {d.generatedTime}</Text>
        </View>

        {/* Title */}
        <Text style={s.mainTitle}>OVEREENKOMST VAN OPDRACHT</Text>
        <P>Deze overeenkomst is gebaseerd op de door de Belastingdienst op 30 juni 2016 onder nummer 90615.36558 beoordeelde overeenkomst. Referentie: {ref}</P>

        <View style={s.hr} />

        {/* Parties */}
        <H1>DE ONDERGETEKENDEN:</H1>
        <NLI n="1">
          <Text><Text style={s.bold}>"Opdrachtgever"</Text>: {d.companyName}{d.companyKvk ? `, ingeschreven in het handelsregister van de Kamer van Koophandel onder nummer ${d.companyKvk}` : ""}{d.companyAddress ? `, gevestigd te ${d.companyAddress}${d.companyCity ? `, ${d.companyCity}` : ""}` : ""}; en</Text>
        </NLI>
        <NLI n="2">
          <Text><Text style={s.bold}>"Opdrachtnemer"</Text>: {d.workerName}{d.kvkCompanyName ? `, handelend onder de naam ${d.kvkCompanyName}` : ""}{d.kvkNumber ? `, ingeschreven in het handelsregister onder nummer ${d.kvkNumber}` : ""}{d.workerCity ? `, gevestigd te ${d.workerCity}` : ""}.</Text>
        </NLI>
        <P>Ondergetekenden zullen hierna gezamenlijk worden aangeduid als <Text style={s.bold}>"Partijen"</Text> en ieder afzonderlijk als een <Text style={s.bold}>"Partij"</Text>.</P>

        <H1>NEMEN IN AANMERKING DAT:</H1>
        <NLI n="1">Opdrachtgever een zorginstelling is die in het kader van de uitoefening van zijn bedrijf behoefte heeft aan een zelfstandige zorgprofessional;</NLI>
        <NLI n="2">Opdrachtgever bij het aanmaken van de opdracht via het CaredIn-platform heeft aangegeven over welke kwalificaties Opdrachtnemer dient te beschikken;</NLI>
        <NLI n="3">Partijen uitsluitend met elkaar wensen te contracteren op basis van een overeenkomst van opdracht in de zin van artikel 7:400 e.v. BW;</NLI>
        <NLI n="4">Partijen uitdrukkelijk geen arbeidsovereenkomst in de zin van artikel 7:610 BW wensen te sluiten;</NLI>
        <NLI n="5">Partijen ervoor kiezen om in voorkomende gevallen de fictieve dienstbetrekking van thuiswerkers of gelijkgestelden zoals bedoeld in de artikelen 2b en 2c Uitvoeringsbesluit Loonbelasting 1965 buiten toepassing te laten en daartoe deze Overeenkomst van Opdracht opstellen en ondertekenen voordat uitbetaling plaatsvindt;</NLI>
        <NLI n="6">Partijen een groot belang hechten aan de zelfstandigheid en de onafhankelijkheid van Opdrachtnemer. Opdrachtnemer beschikt over eigen professionele kwalificaties (registraties, diploma's, certificaten) die een persoonlijk, niet-overdraagbaar vakkundig vermogen vormen;</NLI>
        <NLI n="7">Opdrachtgever zich er uitdrukkelijk mee akkoord verklaart dat Opdrachtnemer ook ten behoeve van andere opdrachtgevers werkzaamheden verricht en dat deze overeenkomst geen exclusiviteitsverplichting inhoudt;</NLI>
        <NLI n="8">Opdrachtnemer de vrijheid heeft om opdrachten via het CaredIn-platform te accepteren of te weigeren zonder dat dit rechtspositionele gevolgen heeft;</NLI>
        <NLI n="9">Partijen kennis hebben genomen van de Wet toelating terbeschikkingstelling van arbeidskrachten (WTTA) en bevestigen dat de onderhavige samenwerking niet kwalificeert als uitzending in de zin van artikel 7:690 BW, maar als zelfstandige opdracht ex artikel 7:400 BW.</NLI>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>CaredIn · caredin.nl · Modelovereenkomst nr. 90615.36558</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} van ${totalPages}`} />
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <Text style={s.headerPlatform}>CaredIn · caredin.nl</Text>
          <Text style={s.headerDate}>{d.generatedAt} {d.generatedTime}</Text>
        </View>

        <H1>KOMEN OVEREEN ALS VOLGT:</H1>

        {/* Article 1 */}
        <H1>1. AARD EN DUUR</H1>
        <H2>1.1. Opdracht</H2>
        <H3>Omschrijving werkzaamheden</H3>
        <P>{d.companyName} heeft behoefte aan een zorgprofessional voor de uitvoering van zorgwerkzaamheden als {d.shiftTitle}.</P>
        {d.shiftDescription && <P>{d.shiftDescription}</P>}
        <H3>Praktische informatie</H3>
        <Bullet>Functie: {d.shiftTitle}</Bullet>
        <Bullet>Locatie: {d.address}, {d.city}</Bullet>
        <Bullet>Datum: {d.shiftDate}</Bullet>
        <Bullet>Aanvang: {d.startTime} — Einde: {d.endTime}</Bullet>
        <Bullet>Uurtarief: € {d.hourlyRate} excl. BTW</Bullet>

        <H3>1.1.2. Aanvullende afspraken</H3>
        <P>Eventuele aanvullende afspraken en/of toezeggingen die worden gemaakt na het sluiten van deze Overeenkomst van Opdracht zijn slechts bindend indien en voor zover zij door Partijen schriftelijk zijn bevestigd en niet afwijken van de artikelen 2 tot en met 6 van de door CaredIn beschikbaar gestelde modelovereenkomst van opdracht waarop deze Overeenkomst van Opdracht is gebaseerd.</P>

        <H3>1.1.3. Aanvang</H3>
        <P>De werkzaamheden vangen aan op <Text style={s.bold}>{d.shiftDate} om {d.startTime}</Text> en eindigen op <Text style={s.bold}>{d.shiftDate} om {d.endTime}</Text>. Indien het zich laat aanzien dat Opdrachtnemer de omschreven werkzaamheden niet binnen de afgesproken tijd kan afronden, zullen Partijen in overleg treden over eventuele verlenging.</P>

        <H3>1.1.4. Duur</H3>
        <P>Deze Overeenkomst van Opdracht wordt geacht te zijn aangegaan voor de duur van de overeengekomen werkzaamheden, zodat deze van rechtswege eindigt op het moment dat de werkzaamheden naar het redelijk oordeel van Opdrachtgever zijn voltooid.</P>

        <H3>1.1.5. Annuleringsbeleid</H3>
        <P>Annulering is mogelijk tot 24 uur voor aanvang van de Opdracht via het CaredIn-platform.</P>

        <H2>1.2. Annulering</H2>
        <P>Indien Opdrachtgever zich niet aan het toepasselijke annuleringsbeleid houdt, betaalt hij Opdrachtnemer 50% van het totaalbedrag waarvoor het afgesproken uurtarief geldt.</P>

        <H2>1.3. Tussentijdse opzegging</H2>
        <P>Opdrachtgever heeft het recht deze Overeenkomst van Opdracht tussentijds te beëindigen met inachtneming van het toepasselijke annuleringsbeleid als bedoeld in artikel 1.1.5. Opzegging dient via het CaredIn-platform te geschieden.</P>

        {/* Article 2 */}
        <H1>2. UITVOERING</H1>
        <H2>2.1. Vrijheid en zelfstandigheid</H2>
        <P>Opdrachtnemer is vrij zijn werkzaamheden naar eigen professioneel inzicht in te richten en uit te voeren. Opdrachtgever geeft geen instructies over de wijze waarop de werkzaamheden worden verricht, maar uitsluitend over het te bereiken resultaat en de daarvoor geldende zorgstandaarden. De omstandigheid dat Opdrachtnemer werkt binnen de locatie en de organisatie van Opdrachtgever doet aan deze zelfstandigheid niet af; de werkzaamheden vormen een afgebakende opdracht en zijn geen integraal onderdeel van de bedrijfsvoering van Opdrachtgever.</P>

        <H2>2.2. Uitvoerder</H2>
        <P>Ter uitvoering van de Opdracht zal Opdrachtnemer <Text style={s.bold}>{d.workerName}</Text> beschikking stellen aan Opdrachtgever.</P>

        <H2>2.3. Inspanning</H2>
        <P>Opdrachtnemer neemt bij het aangaan van deze Overeenkomst van Opdracht een inspanningsverplichting op zich en verplicht zich derhalve deze Overeenkomst van Opdracht naar beste inzicht en vermogen en als een zorgvuldig handelend opdrachtnemer uit te voeren. Opdrachtnemer is altijd verantwoordelijk voor de kwaliteit van de zorgwerkzaamheden en de nakoming van de gemaakte afspraken.</P>

        <H2>2.4. Bevoegdheid en informatie</H2>
        <P>Opdrachtgever zal aan Opdrachtnemer alle benodigde bevoegdheden en informatie verstrekken die benodigd zijn voor een goede uitvoering van de Opdracht, waaronder toegang tot relevante patiëntdossiers en het gebruik van benodigde materialen.</P>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>CaredIn · caredin.nl · Modelovereenkomst nr. 90615.36558</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} van ${totalPages}`} />
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <Text style={s.headerPlatform}>CaredIn · caredin.nl</Text>
          <Text style={s.headerDate}>{d.generatedAt} {d.generatedTime}</Text>
        </View>

        {/* Article 3 */}
        <H1>3. NAKOMING EN VERVANGING</H1>
        <H2>3.1. Informeren</H2>
        <P>Opdrachtnemer is gehouden aan het annuleringsbeleid zoals bedoeld in artikel 1.1.5. Indien Opdrachtnemer op enig moment voorziet dat hij de verplichtingen in verband met de Opdracht niet, niet tijdig of niet naar behoren kan nakomen, dan dient Opdrachtnemer vervanging te regelen zoals bedoeld in artikel 3.2 of de Opdracht te annuleren via het CaredIn-platform.</P>

        <H2>3.2. Vervangen</H2>
        <P>Opdrachtnemer heeft het recht zich bij de uitvoering van de Opdracht te laten vervangen door een andere zorgprofessional. Dit recht is een wezenlijk kenmerk van deze Overeenkomst van Opdracht en benadrukt de zelfstandige positie van Opdrachtnemer. Vervanging geschiedt door een persoon die over de vereiste kwalificaties voor de betreffende zorgtaak beschikt. Opdrachtnemer meldt de vervanger voorafgaand via het CaredIn-platform. Opdrachtnemer blijft in dat geval verantwoordelijk voor de facturering van de Opdrachtvorderingen. Opdrachtgever kan vervanging niet weigeren op andere gronden dan het ontbreken van vereiste kwalificaties.</P>

        {/* Article 4 */}
        <H1>4. VERGOEDING</H1>
        <H2>4.1. Bedrag</H2>
        <P>Voor het verrichten van de werkzaamheden ontvangt de Opdrachtnemer een vergoeding van <Text style={s.bold}>€ {d.hourlyRate} per uur, exclusief btw</Text> en andere heffingen die van overheidswege worden opgelegd (de "Vergoeding").</P>

        <H2>4.2. Eigen materieel en kwalificaties</H2>
        <P>Opdrachtnemer brengt eigen professionele kwalificaties, registraties en vakkennis in (waaronder BIG-registratie, diploma's en eventuele specialisaties). Deze persoonlijke beroepsmiddelen zijn van Opdrachtnemer en vormen een onderscheidend kenmerk van de zelfstandige beroepsuitoefening. Materiaalkosten die verband houden met de locatie worden door Opdrachtgever beschikbaar gesteld. In de Vergoeding zijn reiskosten en reistijd begrepen, tenzij uitdrukkelijk anders is overeengekomen.</P>

        <H2>4.3. Daadwerkelijk gewerkte uren</H2>
        <P>Opdrachtnemer ontvangt uitdrukkelijk geen vergoeding ter zake van uren waarin Opdrachtnemer geen werkzaamheden ten behoeve van Opdrachtgever verricht, zoals tijdens ziekte en verlof. Opdrachtnemer is zich ervan bewust dat bij arbeidsongeschiktheid geen aanspraak bestaat op enige betaling door Opdrachtgever en/of CaredIn.</P>

        <H2>4.4. Betaling</H2>
        <H3>Facturering</H3>
        <Text style={s.pSmall}>4.4.1. Opdrachtgever kan de Opdrachtvorderingen slechts bevrijdend betalen aan CaredIn.</Text>
        <Text style={s.pSmall}>4.4.2. Uitbetaling aan Opdrachtnemer vindt plaats via het CaredIn-platform binnen 48 uur na goedkeuring van de gewerkte uren door de Opdrachtgever. CaredIn brengt een platformbijdrage van € 3,– per gewerkt uur in rekening bij de Opdrachtgever. Opdrachtnemer ontvangt 100% van het overeengekomen uurtarief.</Text>
        <H3>Betaaltermijn</H3>
        <Text style={s.pSmall}>4.4.3. Opdrachtgever zal de betaling van de facturen steeds verrichten binnen 30 dagen na de factuurdatum.</Text>
        <Text style={s.pSmall}>4.4.7. Indien Opdrachtgever niet aan voorgenoemde betaaltermijn voldoet, zal de wettelijke handelsrente als bedoeld in de artikelen 6:119a en 6:120 lid 3 van het Burgerlijk Wetboek verschuldigd zijn.</Text>

        <H2>4.5. Verzuim</H2>
        <P>Indien Opdrachtgever in verzuim is, zijn alle vorderingen van Opdrachtnemer op de Opdrachtgever dadelijk en geheel opeisbaar. Opdrachtnemer heeft het recht zijn/haar dienstverlening op te schorten, zonder dat hij/zij aansprakelijk is voor eventuele schade als gevolg daarvan.</P>

        {/* Article 5 */}
        <H1>5. BELASTINGEN EN SOCIALE PREMIES</H1>
        <H2>5.1. Zelfstandig</H2>
        <P>De werkzaamheden worden geacht te worden verricht door Opdrachtnemer in het kader van een zelfstandige beroepsuitoefening{isZzp ? " als ZZP'er" : ""}.</P>

        <H2>5.2. Wijze van uitvoering</H2>
        <P>Opdrachtnemer verklaart door ondertekening van deze Overeenkomst van Opdracht dat de in artikel 2.2 genoemde natuurlijke persoon de Opdracht zal uitvoeren zoals beschreven in deze Overeenkomst van Opdracht.</P>

        <H2>5.3. Vrijwaring</H2>
        <Text style={s.pSmall}>Opdrachtnemer vrijwaart Opdrachtgever van eventuele naheffingen voor premies volksverzekeringen en loonbelasting. De vrijwaring van Opdrachtnemer vervalt indien eventuele naheffingen mede door een handelen of nalaten van Opdrachtgever zijn te wijten.</Text>

        <H2>5.4. Afdracht</H2>
        <P>Opdrachtnemer draagt zelf zorg voor de afdracht van over het honorarium verschuldigde belastingen en premies van welke aard dan ook in verband met deze Overeenkomst van Opdracht.</P>

        <H2>5.5. Meerdere opdrachtgevers</H2>
        <P>Opdrachtnemer bevestigt dat hij/zij ook voor andere opdrachtgevers werkzaam is of zal zijn, dan wel actief streeft naar het verwerven van meerdere opdrachten. Het niet-exclusieve karakter van deze overeenkomst benadrukt de ondernemersrisico's die Opdrachtnemer draagt en de zelfstandige marktpositie die hij/zij inneemt, een en ander conform de criteria voor zelfstandig ondernemerschap.</P>

        <H2>5.6. Geen gezagsverhouding</H2>
        <P>Partijen bevestigen uitdrukkelijk dat er tussen hen geen arbeidsrechtelijke gezagsverhouding bestaat in de zin van artikel 7:610 BW. Opdrachtgever heeft geen bevoegdheid om arbeidsrechtelijke instructies te geven met betrekking tot de werktijden (buiten de duur van de Opdracht), de vakantierechten of de persoonlijke levenssfeer van Opdrachtnemer. Toepasselijkheid van de Wet arbeidsmarkt in balans (WAB), de cao Ziekenhuizen of enige andere arbeidsrechtelijke cao is uitdrukkelijk uitgesloten.</P>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>CaredIn · caredin.nl · Modelovereenkomst nr. 90615.36558</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} van ${totalPages}`} />
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <Text style={s.headerPlatform}>CaredIn · caredin.nl</Text>
          <Text style={s.headerDate}>{d.generatedAt} {d.generatedTime}</Text>
        </View>

        {/* Article 6 */}
        <H1>6. AANSPRAKELIJKHEID</H1>
        <H2>6.1. Verzekering</H2>
        <P>Partijen zijn zich bewust van de noodzaak zich voldoende te verzekeren tegen aansprakelijkheid als gevolg van de uitvoering van deze Overeenkomst van Opdracht. Opdrachtnemer dient over een geldige beroepsaansprakelijkheidsverzekering te beschikken.</P>

        <H2>6.2. Schade van Opdrachtnemer</H2>
        <P>Opdrachtgever zal Opdrachtnemer de schade vergoeden die deze lijdt:</P>
        <Bullet>ten gevolge van de aan Opdrachtgever niet toe te rekenen verwezenlijking van een aan de opdracht verbonden bijzonder gevaar, tenzij die verwezenlijking een gevolg is van Opdrachtnemer's opzet of bewuste roekeloosheid; en</Bullet>
        <Bullet>tijdens de uitoefening van zijn werkzaamheden, tenzij Opdrachtgever de verplichtingen als bedoeld in artikel 7:658 lid 1 BW is nagekomen of de schade het gevolg is van opzet of bewuste roekeloosheid van Opdrachtnemer.</Bullet>

        <H2>6.3. Schade van Opdrachtgever</H2>
        <P>Opdrachtnemer zal de schade vergoeden die Opdrachtgever lijdt als gevolg van de uitvoering van Opdrachtnemer's werkzaamheden tot een maximum van het door de verzekeraar aan Opdrachtnemer uit te keren bedrag. Indien Opdrachtnemer geen verzekering heeft afgesloten overeenkomstig artikel 6.1 is hij/zij gehouden tot betaling van maximaal het bedrag van de vergoeding die Opdrachtnemer tijdens de Opdracht zou hebben verdiend.</P>

        <H2>6.4. Schade van derden</H2>
        <P>Opdrachtgever zal een derde de schade vergoeden die (a) deze lijdt ten gevolge van de uitvoering van Opdrachtnemer's werkzaamheden, en (b) niet (volledig) wordt vergoed door de verzekeraar van Opdrachtnemer.</P>

        {/* Article 7 */}
        <H1>7. OVERIGE BEPALINGEN</H1>
        <H2>7.1. Geheimhouding</H2>
        <P>Behoudens schriftelijke toestemming van Opdrachtgever, zal Opdrachtnemer geen informatie over (a) de onderneming van Opdrachtgever, (b) patiëntgegevens en (c) deze Overeenkomst van Opdracht aan derden openbaren, tenzij een verplichting daartoe voortvloeit uit de wet. Beide partijen verplichten zich tot naleving van de AVG en het medisch beroepsgeheim.</P>

        <H2>7.2. Eigendommen</H2>
        <P>Alle bedrijfseigendommen en (medische) hulpmiddelen die Opdrachtnemer gedurende deze Overeenkomst van Opdracht bij het verrichten van de Opdracht onder zich krijgt, zijn en blijven eigendom van Opdrachtgever. Opdrachtnemer zal alle eigendommen uiterlijk bij het einde van de dienst bij Opdrachtgever retourneren.</P>

        <H2>7.3. Nederlands recht</H2>
        <P>Op deze overeenkomst is Nederlands recht van toepassing.</P>

        <H2>7.4. Geschillen</H2>
        <P>Alle geschillen die mochten ontstaan naar aanleiding van deze Overeenkomst van Opdracht zullen exclusief worden voorgelegd aan de bevoegde rechtbank in het arrondissement waarin Opdrachtgever gevestigd is.</P>

        <H2>7.5. Schijnzelfstandigheid</H2>
        <P>Partijen zijn zich bewust van de maatschappelijke discussie rondom schijnzelfstandigheid. Zij verklaren dat de feitelijke uitvoering van de werkzaamheden overeenkomt met hetgeen in deze Overeenkomst van Opdracht is vastgelegd. Indien gedurende of na de looptijd van deze overeenkomst zou komen vast te staan dat de arbeidsrelatie feitelijk als arbeidsovereenkomst dient te worden gekwalificeerd, vrijwaart Opdrachtnemer Opdrachtgever voor aanspraken van de Belastingdienst tot het moment waarop dit feitelijk kenbaar werd. CaredIn is geen partij bij deze overeenkomst en kan niet aansprakelijk worden gesteld voor fiscale of arbeidsrechtelijke herkwalificatie.</P>

        <View style={s.hr} />

        {/* Signatures */}
        <P>Elektronisch akkoord via het CaredIn-platform op {d.generatedAt} om {d.generatedTime}.</P>
        <View style={s.sigRow}>
          <View style={s.sigBox}>
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Handtekening opdrachtgever</Text>
            <Text style={[s.sigLabel, { fontFamily: "Helvetica-Bold" }]}>{d.companyName}</Text>
          </View>
          <View style={s.sigBox}>
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Handtekening opdrachtnemer</Text>
            <Text style={[s.sigLabel, { fontFamily: "Helvetica-Bold" }]}>{d.workerName}</Text>
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>CaredIn · caredin.nl · Modelovereenkomst nr. 90615.36558</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} van ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
