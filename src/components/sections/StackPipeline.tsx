/**
 * PRD §6.5 — "Where we fit": the five layers as a vertical pipeline in the reference's live-pipeline
 * style (nodes joined by lines, a pulse travelling down). Our layer (4th) is highlighted, as in the prototype.
 */
export function StackPipeline({ title, layers }: { title: string; layers: readonly string[] }) {
  return (
    <figure className="pipeline">
      <figcaption className="pipeline-head">
        <span className="pipeline-dot" aria-hidden="true" />
        {title}
      </figcaption>
      <ol className="pipeline-list">
        {layers.map((l, i) => (
          <li key={l} className={`pipeline-node${i === 3 ? ' is-ours' : ''}`} style={{ ['--i' as string]: i }}>
            <span className="pipeline-n" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{l}</span>
            {i === 3 && (
              <span className="pipeline-badge" aria-hidden="true">
                FPH
              </span>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}
