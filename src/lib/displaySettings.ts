export const DISPLAY_SETTINGS_KEY = "riverside.service-desk.v1.display";

export const colourSchemes = [
  { value: "system", label: "Match device" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "high-contrast", label: "High contrast" },
] as const;

export const textSizes = [
  { value: "standard", label: "Standard" },
  { value: "large", label: "Large" },
  { value: "extra-large", label: "Extra large" },
] as const;

export type DisplaySettings = {
  colourScheme: (typeof colourSchemes)[number]["value"];
  textSize: (typeof textSizes)[number]["value"];
};

export const defaultDisplaySettings: DisplaySettings = {
  colourScheme: "dark",
  textSize: "standard",
};

export function readDisplaySettings(): DisplaySettings {
  try {
    const saved: Partial<DisplaySettings> | null = JSON.parse(
      localStorage.getItem(DISPLAY_SETTINGS_KEY) ?? "null",
    );
    return {
      colourScheme:
        colourSchemes.find((scheme) => scheme.value === saved?.colourScheme)
          ?.value ?? defaultDisplaySettings.colourScheme,
      textSize:
        textSizes.find((size) => size.value === saved?.textSize)?.value ??
        defaultDisplaySettings.textSize,
    };
  } catch {
    return defaultDisplaySettings;
  }
}
