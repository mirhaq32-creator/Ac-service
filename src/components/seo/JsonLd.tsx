/** Renders a JSON-LD structured-data block (PRD §11). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is inert script data; keys are controlled here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
