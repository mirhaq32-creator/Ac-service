/**
 * Shared admin form primitives (bilingual AR/EN content fields, status
 * select). English-only UI; plain HTML forms posting to server actions.
 */

export const inputCls =
  "mt-1 min-h-12 w-full rounded-xl border border-line bg-bg px-4 text-ink outline-none transition focus:border-accent";

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  dir,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  dir?: "ltr" | "rtl";
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-muted">
        {label} {required ? <span className="text-danger">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        dir={dir}
        required={required}
        defaultValue={defaultValue}
        className={inputCls}
      />
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function LocalizedField({
  label,
  name,
  defaultValue,
  multiline,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: { ar: string; en: string };
  multiline?: boolean;
  required?: boolean;
}) {
  const common = `${inputCls} ${multiline ? "py-3" : ""}`;
  return (
    <fieldset className="rounded-xl border border-line bg-surface p-4">
      <legend className="px-1 text-sm font-bold text-ink">{label}</legend>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor={`${name}_ar`} className="text-xs font-semibold text-muted">
            Arabic
          </label>
          {multiline ? (
            <textarea
              id={`${name}_ar`}
              name={`${name}_ar`}
              rows={multiline === true ? 6 : undefined}
              required={required}
              defaultValue={defaultValue?.ar ?? ""}
              className={common}
            />
          ) : (
            <input
              id={`${name}_ar`}
              name={`${name}_ar`}
              required={required}
              defaultValue={defaultValue?.ar ?? ""}
              className={common}
            />
          )}
        </div>
        <div>
          <label htmlFor={`${name}_en`} className="text-xs font-semibold text-muted">
            English
          </label>
          {multiline ? (
            <textarea
              id={`${name}_en`}
              name={`${name}_en`}
              rows={multiline === true ? 6 : undefined}
              dir="ltr"
              required={required}
              defaultValue={defaultValue?.en ?? ""}
              className={common}
            />
          ) : (
            <input
              id={`${name}_en`}
              name={`${name}_en`}
              dir="ltr"
              required={required}
              defaultValue={defaultValue?.en ?? ""}
              className={common}
            />
          )}
        </div>
      </div>
    </fieldset>
  );
}

export function StatusSelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <div>
      <label htmlFor="status" className="text-sm font-semibold text-muted">
        Status
      </label>
      <select id="status" name="status" defaultValue={defaultValue ?? "draft"} className={inputCls}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="hidden">Hidden</option>
      </select>
    </div>
  );
}

export function SubmitBar({ label = "Save" }: { label?: string }) {
  return (
    <div className="sticky bottom-0 mt-6 flex justify-end gap-3 border-t border-line bg-surface py-3">
      <button
        type="submit"
        className="min-h-12 cursor-pointer rounded-full bg-accent px-8 font-semibold text-white shadow-glow transition hover:bg-accent-hover"
      >
        {label}
      </button>
    </div>
  );
}
