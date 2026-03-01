import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "../public/favicons");

fs.mkdirSync(outputDir, { recursive: true });

const APPS = [
  { name: "AdGuard Home", domain: "adguard.com" },
  { name: "Activepieces", domain: "activepieces.com" },
  { name: "Alf.io", domain: "alf.io" },
  { name: "AnonAddy", domain: "anonaddy.com" },
  { name: "Apache Airflow", domain: "airflow.apache.org" },
  { name: "ArchiveBox", domain: "archivebox.io" },
  { name: "Apostrophe", domain: "apostrophecms.com" },
  { name: "Automatisch", domain: "automatisch.io" },
  { name: "AWStats", domain: "awstats.org" },
  { name: "Baserow", domain: "baserow.io" },
  { name: "Bolt CMS", domain: "boltcms.io" },
  { name: "Briefkasten", domain: "briefkastenhq.com" },
  { name: "Bytebase", domain: "bytebase.com" },
  { name: "Cal.com", domain: "cal.com" },
  { name: "Castopod", domain: "castopod.org" },
  { name: "Centrifugo", domain: "centrifugal.dev" },
  { name: "changedetection.io", domain: "changedetection.io" },
  { name: "Chartbrew", domain: "chartbrew.com" },
  { name: "CKAN", domain: "ckan.org" },
  { name: "Contao", domain: "contao.org" },
  { name: "Countly", domain: "count.ly" },
  { name: "Cronicle", domain: "cronicle.net" },
  { name: "Datasette", domain: "datasette.io" },
  { name: "DAViCal", domain: "davical.org" },
  { name: "Docspell", domain: "docspell.org" },
  { name: "Drupal", domain: "drupal.org" },
  { name: "Easy!Appointments", domain: "easyappointments.org" },
  { name: "Element", domain: "element.io" },
  { name: "EspoCRM", domain: "espocrm.com" },
  { name: "Ghost", domain: "ghost.org" },
  { name: "GoAccess", domain: "goaccess.io" },
  { name: "GoatCounter", domain: "goatcounter.com" },
  { name: "Gotify", domain: "gotify.net" },
  { name: "Grimoire", domain: "grimoire.pro" },
  { name: "Healthchecks", domain: "healthchecks.io" },
  { name: "Hi.Events", domain: "hi.events" },
  { name: "Home Assistant", domain: "home-assistant.io" },
  { name: "iRedMail", domain: "iredmail.org" },
  { name: "Jami", domain: "jami.net" },
  { name: "Jellyfin", domain: "jellyfin.org" },
  { name: "Joomla", domain: "joomla.org" },
  { name: "Karakeep", domain: "karakeep.app" },
  { name: "Kestra", domain: "kestra.io" },
  { name: "KeystoneJS", domain: "keystonejs.com" },
  { name: "Known", domain: "withknown.com" },
  { name: "Leon", domain: "getleon.ai" },
  { name: "LinkAce", domain: "linkace.org" },
  { name: "linkding", domain: "linkding.link" },
  { name: "LinkWarden", domain: "linkwarden.app" },
  { name: "Litlyx", domain: "litlyx.com" },
  { name: "Mail-in-a-Box", domain: "mailinabox.email" },
  { name: "Mailcow", domain: "mailcow.email" },
  { name: "Mailu", domain: "mailu.io" },
  { name: "Matomo", domain: "matomo.org" },
  { name: "Mayan EDMS", domain: "mayan-edms.com" },
  { name: "Metabase", domain: "metabase.com" },
  { name: "Minio", domain: "min.io" },
  { name: "Mixpost", domain: "mixpost.app" },
  { name: "MODX", domain: "modx.com" },
  { name: "Modoboa", domain: "modoboa.org" },
  { name: "Monica", domain: "monicahq.com" },
  { name: "Mumble", domain: "mumble.info" },
  { name: "Navidrome", domain: "navidrome.org" },
  { name: "Netdata", domain: "netdata.cloud" },
  { name: "Nextcloud", domain: "nextcloud.com" },
  { name: "Nginx Proxy Manager", domain: "nginxproxymanager.com" },
  { name: "Neos", domain: "neos.io" },
  { name: "ntfy", domain: "ntfy.sh" },
  { name: "OliveTin", domain: "olivetin.app" },
  { name: "Omeka S", domain: "omeka.org" },
  { name: "Paperless-ngx", domain: "paperless-ngx.com" },
  { name: "Papermerge", domain: "papermerge.com" },
  { name: "Payload CMS", domain: "payloadcms.com" },
  { name: "Pi-hole", domain: "pi-hole.net" },
  { name: "Plex", domain: "plex.tv" },
  { name: "Plausible Analytics", domain: "plausible.io" },
  { name: "Plone", domain: "plone.org" },
  { name: "Portainer", domain: "portainer.io" },
  { name: "Postal", domain: "postalserver.io" },
  { name: "PostHog", domain: "posthog.com" },
  { name: "Proxmox", domain: "proxmox.com" },
  { name: "QloApps", domain: "qloapps.com" },
  { name: "Radicale", domain: "radicale.org" },
  { name: "Rallly", domain: "rallly.co" },
  { name: "Readeck", domain: "readeck.org" },
  { name: "Redash", domain: "redash.io" },
  { name: "Rocket.Chat", domain: "rocket.chat" },
  { name: "Seafile", domain: "seafile.com" },
  { name: "SimpleLogin", domain: "simplelogin.io" },
  { name: "Stalwart Mail", domain: "stalw.art" },
  { name: "StackStorm", domain: "stackstorm.com" },
  { name: "Strapi", domain: "strapi.io" },
  { name: "SuiteCRM", domain: "suitecrm.com" },
  { name: "Superset", domain: "superset.apache.org" },
  { name: "Swetrix", domain: "swetrix.com" },
  { name: "Technitium DNS", domain: "technitium.com" },
  { name: "Træfik", domain: "traefik.io" },
  { name: "TYPO3", domain: "typo3.org" },
  { name: "Umami", domain: "umami.is" },
  { name: "Uptime Kuma", domain: "uptime.kuma.pet" },
  { name: "Vaultwarden", domain: "vaultwarden.discourse.group" },
  { name: "Wagtail", domain: "wagtail.io" },
  { name: "Wallabag", domain: "wallabag.org" },
  { name: "WordPress", domain: "wordpress.org" },
  { name: "WriteFreely", domain: "writefreely.org" },
  { name: "Zulip", domain: "zulip.org" },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlink(dest, () => {});
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

// Sanitize domain for use as filename (replace special chars)
function domainToFilename(domain) {
  return domain.replace(/[^a-zA-Z0-9.-]/g, "_") + ".png";
}

let ok = 0;
let fail = 0;

for (const app of APPS) {
  const filename = domainToFilename(app.domain);
  const dest = path.join(outputDir, filename);

  // Skip if already downloaded
  if (fs.existsSync(dest)) {
    process.stdout.write(`  skip  ${app.domain}\n`);
    ok++;
    continue;
  }

  const url = `https://www.google.com/s2/favicons?domain=${app.domain}&sz=64`;
  try {
    await download(url, dest);
    process.stdout.write(`    ok  ${app.domain}\n`);
    ok++;
  } catch (err) {
    process.stdout.write(`  FAIL  ${app.domain}: ${err.message}\n`);
    fail++;
  }

  // Small delay to be polite
  await new Promise((r) => setTimeout(r, 100));
}

console.log(`\nDone: ${ok} ok, ${fail} failed`);
console.log(`Favicons saved to: ${outputDir}`);
