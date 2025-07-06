# 📚 StudySync

Meine moderne Lernmanagement-App, die ich mit Next.js entwickelt habe. Sie hilft mir dabei, meine Kurse zu organisieren, Lernziele zu setzen, Aufgaben zu verfolgen und meinen Fortschritt effizient zu überwachen.

## ✨ Was die App kann

- 🎯 **Kursverwaltung**: Studienkurse erstellen und organisieren mit eigenen Farben und Deadlines
- 📋 **Ziele setzen**: Spezifische Lernziele für jeden Kurs mit Prioritätsstufen definieren
- ✅ **Aufgaben verfolgen**: Ziele in machbare Aufgaben mit Fälligkeitsdaten und Zeitschätzungen aufteilen
- 📊 **Fortschrittsanalyse**: Lernzeit tracken und Abschlussraten überwachen
- 🔐 **Benutzeranmeldung**: Sichere Anmeldung und Registrierung mit NextAuth.js
- 📱 **Responsive Design**: Schöne, handyfreundliche Oberfläche mit Tailwind CSS
- 🎨 **Interaktives Dashboard**: Visuelle Fortschrittsdiagramme und Statistiken

## 🛠️ Technologien

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI Komponenten
- **Backend**: Next.js API Routes
- **Datenbank**: PostgreSQL mit Prisma ORM
- **Authentifizierung**: NextAuth.js
- **Formulare**: React Hook Form mit Zod Validierung
- **Charts**: Recharts für Fortschrittsvisualisierung

## 🚀 So startest du die App

### Was du brauchst

- Node.js 18+ und npm
- PostgreSQL Datenbank (oder einen Supabase Account)

### Installation

1. **Repository klonen**
   ```bash
   git clone <deine-repo-url>
   cd studysync
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen einrichten**
   
   Erstelle eine `.env` Datei im Hauptverzeichnis:
   ```env
   # Datenbank
   DATABASE_URL="postgresql://username:password@host:port/database"
   
   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=dein-geheimer-schlüssel
   ```

4. **Datenbank einrichten**
   ```bash
   # Prisma Client generieren
   npx prisma generate
   
   # Datenbank-Migrationen ausführen
   npx prisma migrate dev --name init
   ```

5. **Development Server starten**
   ```bash
   npm run dev
   ```

6. **App öffnen**
   
   Gehe zu [http://localhost:3000](http://localhost:3000) in deinem Browser.

## 📖 So benutzt du die App

### Erste Schritte
1. **Registriere** dich oder **melde dich** mit einem bestehenden Account an
2. **Erstelle deinen ersten Kurs** mit einem Klick auf "Neuen Kurs hinzufügen"
3. **Setze Ziele** für deinen Kurs, um zu definieren, was du erreichen willst
4. **Füge Aufgaben hinzu**, um deine Ziele in umsetzbare Schritte zu unterteilen
5. **Verfolge deinen Fortschritt**, indem du Zeit loggst und Aufgaben als erledigt markierst

### Kursverwaltung
- Erstelle Kurse mit eigenen Titeln, Beschreibungen und Farbthemen
- Setze Start- und Enddaten, um auf Kurs zu bleiben
- Betrachte alle Kurse in einem übersichtlichen Dashboard-Layout

### Ziele setzen
- Definiere spezifische Lernziele für jeden Kurs
- Setze Prioritätsstufen (Niedrig, Mittel, Hoch, Dringend)
- Verfolge Abschlussstatus und Deadlines

### Aufgaben verfolgen
- Teile Ziele in kleinere, machbare Aufgaben auf
- Setze Fälligkeitsdaten und geschätzte Zeitanforderungen
- Logge Fortschritt und füge Notizen zu deinen Lernsessions hinzu

## 🏗️ Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentifizierungs-Endpunkte
│   │   ├── courses/       # Kursverwaltung
│   │   ├── goals/         # Zielverwaltung
│   │   └── tasks/         # Aufgabenverwaltung
│   ├── courses/           # Kurs-Seiten
│   └── layout.tsx         # Root Layout
├── components/            # Wiederverwendbare UI-Komponenten
│   ├── AuthGuard.tsx      # Authentifizierungs-Wrapper
│   ├── CourseCard.tsx     # Kurs-Anzeige-Komponente
│   ├── DashboardStats.tsx # Statistik-Dashboard
│   └── ...
├── lib/                   # Utility-Bibliotheken
└── types/                 # TypeScript-Typdefinitionen

prisma/
├── schema.prisma          # Datenbankschema
└── migrations/            # Datenbankmigrationen
```

## 📊 Datenbankschema

Die App nutzt eine PostgreSQL-Datenbank mit folgenden Hauptentitäten:

- **Users**: Benutzerkonten und Authentifizierung
- **Courses**: Studienkurse mit Metadaten
- **Goals**: Lernziele verknüpft mit Kursen
- **Tasks**: Umsetzbare Aufgaben verknüpft mit Zielen
- **ProgressLogs**: Zeitverfolgung und Fortschrittsnotizen

## 🔧 Verfügbare Scripts

- `npm run dev` - Development Server starten
- `npm run build` - Für Produktion bauen
- `npm run start` - Produktions-Server starten
- `npm run lint` - ESLint ausführen
- `npx prisma studio` - Prisma Datenbank-Browser öffnen
- `npx prisma migrate dev` - Neue Migration erstellen und anwenden

## 🚀 Deployment

### Vercel (Empfohlen)
1. Code zu GitHub pushen
2. Repository mit [Vercel](https://vercel.com) verbinden
3. Umgebungsvariablen im Vercel Dashboard hinzufügen
4. Automatisches Deployment bei jedem Push

### Andere Plattformen
Die App kann auf jeder Plattform deployed werden, die Node.js-Anwendungen unterstützt (Railway, Render, Heroku, etc.).

---

**Viel Spaß beim Lernen! 📚✨**
