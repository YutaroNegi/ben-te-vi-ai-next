import { headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Valor padrão caso não seja possível detectar o idioma
  let locale = "en";

  // Usa a função headers() para obter os cabeçalhos da requisição
  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language");

  if (acceptLanguage) {
    const firstLang = acceptLanguage.split(",")[0].trim().toLowerCase();

    if (firstLang.startsWith("pt")) {
      locale = "ptBR";
    } else if (firstLang.startsWith("en")) {
      locale = "en";
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
