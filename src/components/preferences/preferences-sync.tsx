"use client";

import { useLayoutEffect } from "react";

import { applyPreferences, preferencesScriptConfig } from "@/lib/preferences-script";
import { browserStorage, subscribePreferences } from "@/lib/preferences-store";

/**
 * Mantém o <html> sincronizado com as preferências depois da hidratação:
 * mudanças nesta aba, em outras abas e no tema do sistema operacional.
 * Também reaplica os atributos após o remount do Strict Mode em
 * desenvolvimento, que limpa o que o script inline definiu.
 * Não renderiza nada.
 */
export function PreferencesSync() {
  useLayoutEffect(() => {
    const apply = () => applyPreferences(preferencesScriptConfig, browserStorage);
    apply();
    return subscribePreferences(apply);
  }, []);

  return null;
}
