import { useLayoutEffect, useState } from "react";
import { Accessibility, RotateCcw } from "lucide-react";
import {
  colourSchemes,
  defaultDisplaySettings,
  DISPLAY_SETTINGS_KEY,
  readDisplaySettings,
  textSizes,
} from "../lib/displaySettings.ts";
import type { DisplaySettings } from "../lib/displaySettings.ts";
import Modal from "./Modal.tsx";

export default function AccessibilitySettings() {
  const [settings, setSettings] = useState(readDisplaySettings);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const device = window.matchMedia("(prefers-color-scheme: light)");
    const applyScheme = () => {
      document.documentElement.dataset.colourScheme =
        settings.colourScheme === "system"
          ? device.matches
            ? "light"
            : "dark"
          : settings.colourScheme;
    };
    applyScheme();
    document.documentElement.dataset.textSize = settings.textSize;
    if (settings.colourScheme !== "system") return;
    device.addEventListener("change", applyScheme);
    return () => device.removeEventListener("change", applyScheme);
  }, [settings]);

  function change(next: DisplaySettings) {
    setSettings(next);
    try {
      localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // The current screen still uses the selected settings.
    }
  }

  return (
    <>
      <button
        type="button"
        className="button secondary accessibility-trigger"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Accessibility size={18} aria-hidden="true" />
        Accessibility
      </button>
      {open && (
        <Modal title="Accessibility" close={() => setOpen(false)}>
          <div className="display-fields">
            <label className="field">
              <span>Colour scheme</span>
              <select
                value={settings.colourScheme}
                onChange={(event) => {
                  const scheme = colourSchemes.find(
                    (option) => option.value === event.target.value,
                  );
                  if (scheme)
                    change({ ...settings, colourScheme: scheme.value });
                }}
              >
                {colourSchemes.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Text size</span>
              <select
                value={settings.textSize}
                onChange={(event) => {
                  const size = textSizes.find(
                    (option) => option.value === event.target.value,
                  );
                  if (size) change({ ...settings, textSize: size.value });
                }}
              >
                {textSizes.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p>Use Magnify beside a diagram to inspect it at a larger size.</p>
          <button
            type="button"
            className="button secondary"
            onClick={() => change(defaultDisplaySettings)}
          >
            <RotateCcw size={16} aria-hidden="true" />
            Reset display settings
          </button>
        </Modal>
      )}
    </>
  );
}
