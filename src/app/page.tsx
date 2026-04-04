import { db } from "@/lib/db";
import { services, settings, categories } from "@/lib/schema";
import { asc, eq } from "drizzle-orm";
import { ServiceGrid } from "@/components/ServiceGrid";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const allServices = db
    .select()
    .from(services)
    .orderBy(asc(services.sortOrder))
    .all();

  const allCategories = db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder))
    .all();

  let settingsRow = db.select().from(settings).where(eq(settings.id, 1)).get();
  if (!settingsRow) {
     db.insert(settings).values({ id: 1, backgroundImage: "", bgOpacity: 1, openInNewTab: 0, title: "Neodash" }).run();
     settingsRow = { id: 1, backgroundImage: "", bgOpacity: 1, openInNewTab: 0, title: "Neodash" };
   }

   return (
     <main className="min-h-screen">
       <div className="max-w-6xl mx-auto px-4 py-8">
         <ServiceGrid
           initialServices={allServices}
           initialCategories={allCategories}
           initialBg={settingsRow.backgroundImage}
           initialBgOpacity={settingsRow.bgOpacity ?? 1}
           initialOpenInNewTab={Boolean(settingsRow.openInNewTab)}
           initialTitle={settingsRow.title}
         />
       </div>
     </main>
   );
 }
