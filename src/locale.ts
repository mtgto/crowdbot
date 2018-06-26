import { en } from "./locale/en";
import { ja } from "./locale/ja";
import { Messages } from "./locale/messages";

export enum Language {
    en = "en",
    ja = "ja",
}

export const getLanguage = (value: string | undefined): Language => {
    switch (value) {
        case Language.en:
            return Language.en;
        case Language.ja:
            return Language.ja;
        default:
            return Language.en;
    }
};

/**
 * Return Promise of translation by specified language.
 */
export const getLocale = (language: Language): Messages => {
    switch (language) {
        case Language.en:
            return en;
        case Language.ja:
            return ja;
        default:
            return en;
    }
};
