import { localesMap } from '../maps/languages.map';

export type LocaleKeyType = Extract<keyof typeof localesMap, string>;