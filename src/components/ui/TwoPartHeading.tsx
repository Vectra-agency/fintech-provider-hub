import type { ReactNode } from 'react';

/**
 * Two-part H2 of the reference ("Stateful execution. / Qronos keeps agents in motion.").
 * One heading element with two spans (PRD §10); the dictionary stores [part1, part2] or a single string (PRD §8).
 */
export type HeadingText = string | readonly [string, string];

export function TwoPartHeading({
  text,
  as: Tag = 'h2',
  className = '',
  id,
}: {
  text: HeadingText;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  id?: string;
}): ReactNode {
  const parts = typeof text === 'string' ? [text] : text;
  return (
    <Tag id={id} className={`heading-2 ${className}`}>
      <span className="block">{parts[0]}</span>
      {parts[1] && (
        <>
          {' '}
          <span className="block text-muted-foreground">{parts[1]}</span>
        </>
      )}
    </Tag>
  );
}
