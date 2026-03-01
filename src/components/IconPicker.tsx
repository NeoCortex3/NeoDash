"use client";

import { useState } from "react";
import { ICON_OPTIONS, getLucideIcon, getFaviconUrl } from "@/lib/icons";
import { SELFHOSTED_APPS, getAppFaviconUrl } from "@/lib/selfhosted-apps";
import { Globe, Link, LayoutGrid } from "lucide-react";

type Props = {
  value: string;
  onChange: (icon: string) => void;
  serviceUrl?: string;
};

type Mode = "icons" | "apps" | "url" | "favicon";

export function IconPicker({ value, onChange, serviceUrl }: Props) {
  const [mode, setMode] = useState<Mode>(() => {
    if (value.startsWith("https://www.google.com/s2/favicons")) return "favicon";
    if (value.startsWith("http")) return "url";
    return "icons";
  });
  const [search, setSearch] = useState("");
  const [customUrl, setCustomUrl] = useState(
    value.startsWith("http") ? value : ""
  );

  const filteredIcons = ICON_OPTIONS.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredApps = SELFHOSTED_APPS.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const tabClass = (tab: Mode) =>
    `flex-1 text-xs py-1.5 px-2 rounded-md transition-colors ${
      mode === tab
        ? "bg-gray-700 text-white"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <div className="space-y-3">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
        <button
          type="button"
          onClick={() => { setMode("icons"); setSearch(""); }}
          className={tabClass("icons")}
        >
          Icons
        </button>
        <button
          type="button"
          onClick={() => { setMode("apps"); setSearch(""); }}
          className={tabClass("apps")}
        >
          <span className="flex items-center justify-center gap-1">
            <LayoutGrid size={11} />
            Apps
          </span>
        </button>
        <button
          type="button"
          onClick={() => { setMode("url"); setSearch(""); }}
          className={tabClass("url")}
        >
          <span className="flex items-center justify-center gap-1">
            <Link size={11} />
            URL
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("favicon");
            setSearch("");
            if (serviceUrl) onChange(getFaviconUrl(serviceUrl));
          }}
          className={tabClass("favicon")}
        >
          <span className="flex items-center justify-center gap-1">
            <Globe size={11} />
            Favicon
          </span>
        </button>
      </div>

      {/* Icons tab */}
      {mode === "icons" && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Icon suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <div className="grid grid-cols-6 gap-1.5 max-h-40 overflow-y-auto p-1">
            {filteredIcons.map((name) => {
              const Icon = getLucideIcon(name) || Globe;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onChange(name)}
                  title={name}
                  className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                    value === name
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Apps tab */}
      {mode === "apps" && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="App suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto p-1">
            {filteredApps.map((app) => {
              const faviconUrl = getAppFaviconUrl(app.domain);
              const isSelected = value === faviconUrl;
              return (
                <button
                  key={app.domain}
                  type="button"
                  onClick={() => onChange(faviconUrl)}
                  title={app.name}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={faviconUrl}
                    alt=""
                    width={16}
                    height={16}
                    className="rounded shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                  <span className="text-xs truncate">{app.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* URL tab */}
      {mode === "url" && (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="https://example.com/icon.png"
            value={customUrl}
            onChange={(e) => {
              setCustomUrl(e.target.value);
              if (e.target.value) {
                onChange(e.target.value);
              }
            }}
            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          {customUrl && (
            <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={customUrl}
                alt="Preview"
                className="w-8 h-8 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-xs text-gray-400">Vorschau</span>
            </div>
          )}
        </div>
      )}

      {/* Favicon tab */}
      {mode === "favicon" && (
        <div className="space-y-2">
          {serviceUrl ? (
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getFaviconUrl(serviceUrl)}
                alt="Favicon"
                className="w-8 h-8 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div>
                <p className="text-sm text-white">Favicon von</p>
                <p className="text-xs text-gray-400 truncate">{serviceUrl}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 p-3 bg-gray-800 rounded-lg">
              Bitte zuerst eine URL eingeben.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
