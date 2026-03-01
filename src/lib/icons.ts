import {
  Globe,
  Server,
  Monitor,
  Database,
  Film,
  Music,
  Download,
  Upload,
  Shield,
  Lock,
  Cloud,
  HardDrive,
  Wifi,
  Router,
  Camera,
  Mail,
  MessageSquare,
  FileText,
  Image,
  Video,
  Gamepad2,
  Tv,
  Radio,
  Rss,
  Github,
  Terminal,
  Code,
  Container,
  Network,
  Cpu,
  MemoryStick,
  Bookmark,
  Search,
  Settings,
  Home,
  FolderOpen,
  BookOpen,
  Clapperboard,
  Headphones,
  Printer,
  Bot,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Server,
  Monitor,
  Database,
  Film,
  Music,
  Download,
  Upload,
  Shield,
  Lock,
  Cloud,
  HardDrive,
  Wifi,
  Router,
  Camera,
  Mail,
  MessageSquare,
  FileText,
  Image,
  Video,
  Gamepad2,
  Tv,
  Radio,
  Rss,
  Github,
  Terminal,
  Code,
  Container,
  Network,
  Cpu,
  MemoryStick,
  Bookmark,
  Search,
  Settings,
  Home,
  FolderOpen,
  BookOpen,
  Clapperboard,
  Headphones,
  Printer,
  Bot,
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);

export function getLucideIcon(name: string): LucideIcon | null {
  return ICON_MAP[name] ?? null;
}

export function getFaviconUrl(serviceUrl: string): string {
  try {
    const domain = new URL(serviceUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}
