import { Collection } from './util';

export interface Settings {
  prefix?: string;
  secretUser?: string;
}

export interface SettingsCollection extends Collection<Settings> {
  default: Required<Settings>;
}
const settings: SettingsCollection = {
  default: {
    prefix: '+',
    secretUser: '307894026580000769'
  }
};

export function setSetting<K extends keyof Settings>(
  guild: string,
  setting: K,
  value: Settings[K]
) {
  if (!settings[guild]) settings[guild] = {};
  settings[guild][setting] = value;
}
export function getSetting<K extends keyof Settings>(
  guild: string | null | undefined,
  setting: K
): Required<Settings>[K] {
  if (!guild || !settings[guild]) guild = 'default';
  const value = settings[guild][setting];
  if (value === undefined) return settings.default[setting];
  // undefined values should be caught at this point
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return value!;
}
export function getFullSettings(guild: string | null | undefined): Required<Settings> {
  if (!guild || !settings[guild]) return settings.default;
  return { ...settings.default, ...settings[guild] };
}
