'use client';

import { useId, useRef, useState } from 'react';
import { tgUrl, TG_HANDLE } from '@/lib/i18n';
import { track } from '@/lib/analytics';
import { TelegramIcon } from '@/components/ui/icons';

/** Stable analytics ids for the five topics (labels differ per language). */
const TOPIC_IDS = ['wallet', 'cards', 'payments', 'development', 'other'] as const;

export type LeadLabels = {
  topicL: string;
  topics: readonly string[];
  /** `lead.tpl(topic)` precomputed on the server for each topic — functions can't cross into the client */
  messages: readonly string[];
  msgL: string;
  copy: string;
  copied: string;
  copyFail: string;
  open: string;
  direct: string;
};

/**
 * PRD §7.6 — Telegram can't prefill a message to a user, so: pick a topic → edit the draft →
 * copy → open the chat. If copying fails, the text is selected and a hint is shown (works in the
 * Telegram in-app browser). Status goes to an aria-live region.
 */
export function LeadBlock({ labels, initialTopic = 0 }: { labels: LeadLabels; initialTopic?: number }) {
  const [topic, setTopic] = useState(initialTopic);
  const [text, setText] = useState(labels.messages[initialTopic] ?? '');
  const [status, setStatus] = useState<'idle' | 'copied' | 'fail'>('idle');
  const taRef = useRef<HTMLTextAreaElement>(null);
  const ids = { topics: useId(), msg: useId() };
  const topicId = TOPIC_IDS[topic] ?? 'other';

  const pick = (i: number) => {
    setTopic(i);
    setText(labels.messages[i] ?? '');
    setStatus('idle');
  };

  const copy = async () => {
    const ta = taRef.current;
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
      track('copy_message', { topic: topicId });
      return;
    } catch {
      /* fall through: Clipboard API missing or denied (in-app browsers, insecure context) */
    }
    if (ta) {
      ta.focus();
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      if (ok) {
        setStatus('copied');
        track('copy_message', { topic: topicId });
        return;
      }
    }
    setStatus('fail');
  };

  return (
    <div className="lead-form">
      <div className="flex flex-col gap-3">
        <span className="lead-label" id={ids.topics}>
          {labels.topicL}
        </span>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby={ids.topics}>
          {labels.topics.map((t, i) => (
            <button key={t} type="button" className="chip" aria-pressed={i === topic} onClick={() => pick(i)}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <label htmlFor={ids.msg} className="lead-label">
          {labels.msgL}
        </label>
        <textarea
          ref={taRef}
          id={ids.msg}
          rows={5}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setStatus('idle');
          }}
          className="lead-textarea"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-outline btn-md flex-1" onClick={copy}>
          <span className="btn-star-fill" aria-hidden="true" />
          <span className="btn-label">{labels.copy}</span>
        </button>
        <a
          href={tgUrl()}
          target="_blank"
          rel="noopener"
          className="btn btn-solid btn-md flex-1"
          data-ev="submit_lead"
          data-topic={topicId}
        >
          <span className="btn-solid-highlight" aria-hidden="true" />
          <span className="btn-label">
            <TelegramIcon size={16} />
            {labels.open}
          </span>
        </a>
      </div>
      <p className={`lead-status ${status === 'fail' ? 'is-fail' : ''}`} role="status" aria-live="polite">
        {status === 'copied' ? `${labels.copied} ✓` : status === 'fail' ? labels.copyFail : ''}
      </p>
      <p className="text-sm text-white/50">
        {labels.direct}{' '}
        <a
          href={tgUrl()}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
          data-ev="contact_click"
          data-placement="lead"
        >
          <TelegramIcon size={14} />@{TG_HANDLE}
        </a>
      </p>
    </div>
  );
}
