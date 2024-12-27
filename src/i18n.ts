import type { debug } from "console";
import i18next from "i18next";
import ICU from "i18next-icu";
import { env } from "process";
import { initReactI18next } from "react-i18next";
import resources from "virtual:i18next-loader";

i18next
	.use(initReactI18next)
	.use(ICU)
	.init({
		resources,
		debug: import.meta.env.DEV,
		lng: navigator.language,
		fallbackLng: "en",
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	})
	.then(() => {});

export default i18next;
