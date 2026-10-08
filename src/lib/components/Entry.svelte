<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Period } from '../cv';
  import DateRange from './DateRange.svelte';

  let {
    title,
    subtitle,
    period,
    url,
    children,
  }: { title: string; subtitle: string; period: Period; url?: string; children?: Snippet } =
    $props();
</script>

<article class="entry">
  <header class="head">
    <h3 class="title">
      {#if url}<a href={url}>{title}</a>{:else}{title}{/if}
    </h3>
    <p class="subtitle">{subtitle}</p>
    <p class="period"><DateRange {period} /></p>
  </header>
  {#if children}
    <div class="body">{@render children()}</div>
  {/if}
</article>

<style>
  .head {
    display: grid;
    grid-template-areas:
      'period'
      'title'
      'subtitle';
  }

  .title {
    grid-area: title;
    font-family: var(--entry-title-font);
    font-weight: var(--entry-title-weight);
    font-style: var(--entry-title-style);
    font-size: 1.0625rem;
    line-height: 1.35;
    letter-spacing: -0.005em;
  }

  .subtitle {
    grid-area: subtitle;
    font-family: var(--entry-subtitle-font);
    font-weight: var(--entry-subtitle-weight);
    font-style: var(--entry-subtitle-style);
    font-size: 1.125rem;
    line-height: 1.35;
    color: var(--ink-soft);
  }

  .period {
    grid-area: period;
    margin-bottom: 0.2rem;
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
    color: var(--ink-muted);
    white-space: nowrap;
  }

  .body {
    margin-top: 0.55rem;
    max-width: 40em;
    color: var(--ink-soft);
    text-wrap: pretty;
  }

  @media print, (min-width: 36rem) {
    .head {
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas:
        'title period'
        'subtitle subtitle';
      column-gap: 1.5rem;
      align-items: baseline;
    }

    .period {
      margin-bottom: 0;
    }
  }

  @media print {
    .entry {
      break-inside: avoid;
    }

    .title {
      font-size: 10.5pt;
    }

    .subtitle {
      font-size: 11pt;
    }

    .period {
      font-size: 8.5pt;
    }

    .body {
      margin-top: 1.2mm;
      max-width: none;
    }
  }
</style>
