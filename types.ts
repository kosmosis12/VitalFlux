export enum View {
  HOME = 'Home',
  COMMAND_CENTER = 'Command Center',
  COHORTS_SEGMENTS = 'Cohorts & Segments',
  GLOSSARY = 'Glossary',
  DEVICES_RELIABILITY = 'Devices & Reliability',
  OUTCOMES = 'Outcomes (Exec Lens)',
}

export enum Role {
  CLIN_OPS = 'Clinical Ops',
  EXEC = 'Executive',
  OEM = 'OEM Partner',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface SavedView {
  id: string;
  name: string;
  view: View;
}

export interface Tenant {
  name: string;
  logo: string;
  theme: {
      primaryColor: string;
  }
}