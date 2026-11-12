import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Minus, Plus, ZoomIn } from "lucide-react";
import Modal from "./Modal.tsx";

const zoomLevels = [1, 1.25, 1.5, 2];

export default function DiagramMagnifier<Id extends string>({
  title,
  diagram,
  selectionLabel,
  items,
  selected,
  onSelect,
  details,
}: {
  title: string;
  diagram: ReactNode;
  selectionLabel: string;
  items: readonly { id: Id; label: string }[];
  selected?: Id;
  onSelect: (id: Id) => void;
  details: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [fitWidth, setFitWidth] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const region = viewport.current;
    if (!region || !open) return;
    const measure = () => setFitWidth(region.clientWidth);
    const observer = new ResizeObserver(measure);
    measure();
    observer.observe(region);
    return () => observer.disconnect();
  }, [open]);

  useLayoutEffect(() => {
    const region = viewport.current;
    if (!region || step === 0 || !selected) return;
    const part = region.querySelector(
      `[data-diagram-part="${CSS.escape(selected)}"]`,
    );
    if (!part) return;
    const frame = region.getBoundingClientRect();
    const target = part.getBoundingClientRect();
    const left = target.left - frame.left;
    const top = target.top - frame.top;
    if (
      left < 0 || top < 0 ||
      left + target.width > region.clientWidth ||
      top + target.height > region.clientHeight
    ) {
      region.scrollBy(
        left + (target.width - region.clientWidth) / 2,
        top + (target.height - region.clientHeight) / 2,
      );
    }
  }, [open, selected, step]);

  return (
    <>
      <button
        type="button"
        className="button secondary magnify-trigger"
        aria-label={`Magnify ${title.toLowerCase()}`}
        aria-haspopup="dialog"
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
      >
        <ZoomIn size={16} aria-hidden="true" />
        Magnify
      </button>
      {open && (
        <Modal
          className="magnifier-dialog"
          title={title}
          close={() => setOpen(false)}
        >
          <div
            className="magnifier-toolbar"
            role="group"
            aria-label="Zoom controls"
          >
            <button
              type="button"
              className="button secondary"
              aria-label="Zoom out"
              aria-disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              <Minus size={17} aria-hidden="true" />
            </button>
            <output aria-live="polite" aria-label="Zoom level">
              {zoomLevels[step] * 100}%
            </output>
            <button
              type="button"
              className="button secondary"
              aria-label="Zoom in"
              aria-disabled={step === zoomLevels.length - 1}
              onClick={() =>
                setStep((current) => Math.min(zoomLevels.length - 1, current + 1))
              }
            >
              <Plus size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setStep(0);
                viewport.current?.scrollTo(0, 0);
              }}
            >
              Fit
            </button>
          </div>
          <div className="magnifier-layout">
            <div
              className="magnifier-viewport"
              ref={viewport}
              tabIndex={0}
              role="region"
              aria-label={`${title} scroll area`}
            >
              <div
                className="magnifier-canvas"
                style={{ width: fitWidth || undefined, zoom: zoomLevels[step] }}
              >
                {diagram}
              </div>
            </div>
            <div className="magnifier-inspector">
              <label className="field">
                <span>{selectionLabel}</span>
                <select
                  value={selected ?? ""}
                  onChange={(event) => {
                    const item = items.find(
                      ({ id }) => id === event.target.value,
                    );
                    if (item) onSelect(item.id);
                  }}
                >
                  {!selected && (
                    <option value="" disabled>Choose a part</option>
                  )}
                  {items.map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="magnifier-detail" aria-live="polite">
                {details}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
