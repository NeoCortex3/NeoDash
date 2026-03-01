# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Homeserver Dashboard

Dashboard-Webseite zum Verwalten von Homeserver-Diensten. Dienste werden als Kacheln angezeigt und können direkt im Browser hinzugefügt, bearbeitet und gelöscht werden.

## Tech Stack

- **Next.js 16** (App Router, TypeScript, `output: "standalone"`)
- **Tailwind CSS v4**
- **SQLite** via Drizzle ORM + better-sqlite3
- **lucide-react** für Icons
- **@dnd-kit** für Drag-and-Drop-Sortierung
- **react-colorful** für den Farb-Picker

## npm Scripts

```bash
npm run dev              # Dev-Server starten (Port 3000)
npm run build            # Produktions-Build
npm run lint             # ESLint ausführen
npm run db:push          # Schema auf data.db anwenden
npm run db:studio        # Drizzle Studio (DB-Browser)
npm run favicons:download  # App-Favicons neu herunterladen
```

## Dev-Server starten

```bash
node node_modules/next/dist/bin/next dev
```

Launch-Konfiguration liegt in `.claude/launch.json` — der Preview-Server nutzt Port 3000.

## DB Schema

Zwei Tabellen. Der DB-Singleton erstellt sie beim Start automatisch (`CREATE TABLE IF NOT EXISTS`) — kein `db:push` nötig.

```
services: id, name, url, icon, color, sort_order, created_at
settings:  id (immer 1), background_image, bg_opacity
```

- `icon`: Lucide-Icon-Name (`"Globe"`) **oder** lokaler Pfad (`"/favicons/plex.tv.png"`) **oder** externe URL
- `color`: Hex-Farbe für den farbigen Rand oben an der Kachel
- `DATABASE_PATH`: Env-Variable überschreibt den Standard-Pfad (`./data.db`)

## API-Routen

```
GET  /api/services           → alle Dienste
POST /api/services           → neuen Dienst anlegen
PUT  /api/services/[id]      → Dienst bearbeiten
DELETE /api/services/[id]    → Dienst löschen
POST /api/services/reorder   → Reihenfolge speichern (sort_order)
GET  /api/settings           → Hintergrundbild + Deckkraft lesen
PUT  /api/settings           → Hintergrundbild + Deckkraft speichern
POST /api/upload             → Bild hochladen → gibt /api/uploads/<filename> zurück
GET  /api/uploads/[filename] → Hochgeladenes Bild ausliefern
```

## Architektur-Überblick

`page.tsx` ist ein **Server Component**: liest DB direkt (kein API-Aufruf) und übergibt `initialServices`, `initialBg` und `initialBgOpacity` als Props an `ServiceGrid`.

`ServiceGrid` ist der zentrale **Client Component** mit dem gesamten UI-State (Edit-Modus, Dialoge, optimistische Updates). Es koordiniert alle anderen Komponenten.

Drag-and-Drop läuft vollständig client-seitig über `@dnd-kit`; die neue Reihenfolge wird per `POST /api/services/reorder` persistiert.

Uploads werden außerhalb von `public/` gespeichert (`UPLOADS_PATH` env, Standard: `public/uploads/` in Dev, `/app/data/uploads/` in Docker) und über eine eigene API-Route ausgeliefert — damit sie in Docker-Volumes überleben.

## Wichtige Hinweise

- **`serverExternalPackages: ["better-sqlite3"]`** in `next.config.ts` ist zwingend nötig (natives Addon)
- **HMR-safe DB**: Singleton hängt in Dev an `globalThis` (`src/lib/db.ts`)
- **`export const dynamic = "force-dynamic"`** in `page.tsx` — verhindert statisches Caching der DB-Abfrage
- **`data.db` nicht committen** — ist in `.gitignore`

## Icon-Strategie

1. **Lucide-Name** (default): `"Globe"`, `"Server"`, etc. → wird als React-Komponente gerendert (Mapping in `src/lib/icons.ts`)
2. **Lokaler Favicon-Pfad**: `/favicons/plex.tv.png` → aus der Apps-Tab-Auswahl
3. **Externe URL**: `https://...` → beliebiges Bild-URL
4. **Fallback**: Google Favicon API nur für nutzerdefinierte URLs per `getFaviconUrl()`

## Neue Self-Hosted-Apps hinzufügen

1. Eintrag in `src/lib/selfhosted-apps.ts` ergänzen: `{ name: "...", domain: "..." }`
2. `npm run favicons:download` ausführen — lädt nur fehlende Favicons nach

## Docker / Produktion

Multi-Stage Dockerfile (node:22-alpine). Das Production-Image nutzt den Next.js Standalone-Output.

```bash
docker compose up -d   # startet auf Port 3000, Daten in Docker-Volume "neodash-data"
```

Volume-Pfade im Container: `/app/data/data.db` und `/app/data/uploads/`.
