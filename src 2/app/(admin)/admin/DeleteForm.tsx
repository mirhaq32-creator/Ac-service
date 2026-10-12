"use client";

/** Delete confirmation (PRD §12.4): always asks before destroying data. */
export function DeleteForm({
  action,
  id,
  label = "Delete",
  extra,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
  extra?: Record<string, string>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm("Are you sure you want to delete this?")) e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      {Object.entries(extra ?? {}).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button
        type="submit"
        className="inline-flex min-h-9 cursor-pointer items-center rounded-lg px-3 text-xs font-semibold text-danger transition hover:bg-danger/10"
      >
        {label}
      </button>
    </form>
  );
}
