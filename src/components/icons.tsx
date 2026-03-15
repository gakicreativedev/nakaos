"use client";

export function HomeIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className={className}>
      <path d="M3 8.5L11 2L19 8.5V18C19 18.55 18.78 19.05 18.41 19.41C18.05 19.78 17.55 20 17 20H5C4.45 20 3.95 19.78 3.59 19.41C3.22 19.05 3 18.55 3 18V8.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 20V11H14V20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ClientsIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className={className}>
      <path d="M15 19V17.5C15 16.57 14.63 15.68 13.97 15.03C13.32 14.37 12.43 14 11.5 14H5.5C4.57 14 3.68 14.37 3.03 15.03C2.37 15.68 2 16.57 2 17.5V19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8.5" cy="7.5" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M19 19V17.5C19 16.77 18.77 16.07 18.34 15.5C17.92 14.93 17.33 14.52 16.65 14.33" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.15 3.17C14.83 3.36 15.42 3.77 15.84 4.34C16.27 4.91 16.5 5.61 16.5 6.33C16.5 7.06 16.27 7.76 15.84 8.33C15.42 8.9 14.83 9.31 14.15 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ProjectsIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className={className}>
      <path d="M2 7V17C2 18.1 2.9 19 4 19H18C19.1 19 20 18.1 20 17V9C20 7.9 19.1 7 18 7H11L9 4H4C2.9 4 2 4.9 2 6V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function TasksIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className={className}>
      <rect x="2" y="2" width="17" height="17" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M7 10.5L9.5 13L14 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function FinanceIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className={className}>
      <rect x="2" y="4" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M2 9H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

export function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className={className}>
      <circle cx="10.5" cy="10.5" r="3" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M17.4 13.1C17.3 13.34 17.3 13.61 17.41 13.85L18.04 15.16C18.19 15.47 18.12 15.84 17.87 16.08L16.58 17.37C16.34 17.62 15.97 17.69 15.66 17.54L14.35 16.91C14.11 16.8 13.84 16.8 13.6 16.9C13.37 17 13.19 17.19 13.1 17.42L12.62 18.79C12.51 19.12 12.2 19.35 11.85 19.35H10.05C9.7 19.35 9.39 19.12 9.28 18.79L8.8 17.42C8.71 17.19 8.53 17 8.3 16.9C8.06 16.8 7.79 16.8 7.55 16.91L6.24 17.54C5.93 17.69 5.56 17.62 5.32 17.37L4.03 16.08C3.78 15.84 3.71 15.47 3.86 15.16L4.49 13.85C4.6 13.61 4.6 13.34 4.5 13.1C4.4 12.87 4.21 12.69 3.98 12.6L2.61 12.12C2.28 12.01 2.05 11.7 2.05 11.35V9.55C2.05 9.2 2.28 8.89 2.61 8.78L3.98 8.3C4.21 8.21 4.4 8.03 4.5 7.8C4.6 7.56 4.6 7.29 4.49 7.05L3.86 5.74C3.71 5.43 3.78 5.06 4.03 4.82L5.32 3.53C5.56 3.28 5.93 3.21 6.24 3.36L7.55 3.99C7.79 4.1 8.06 4.1 8.3 4C8.53 3.9 8.71 3.71 8.8 3.48L9.28 2.11C9.39 1.78 9.7 1.55 10.05 1.55H11.85C12.2 1.55 12.51 1.78 12.62 2.11L13.1 3.48C13.19 3.71 13.37 3.9 13.6 4C13.84 4.1 14.11 4.1 14.35 3.99L15.66 3.36C15.97 3.21 16.34 3.28 16.58 3.53L17.87 4.82C18.12 5.06 18.19 5.43 18.04 5.74L17.41 7.05C17.3 7.29 17.3 7.56 17.4 7.8C17.5 8.03 17.69 8.21 17.92 8.3L19.29 8.78C19.62 8.89 19.85 9.2 19.85 9.55V11.35C19.85 11.7 19.62 12.01 19.29 12.12L17.92 12.6C17.69 12.69 17.5 12.87 17.4 13.1Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M13 15L8 10L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function BrandHubIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className={className}>
      <rect x="2" y="3" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M2 8H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M8 19V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
