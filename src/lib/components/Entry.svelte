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
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  /* Smaller than the title, so title → role → description reads as a clear hierarchy. */
  .subtitle {
    grid-area: subtitle;
    margin-top: 0.15rem;
    font-family: var(--entry-subtitle-font);
    font-weight: var(--entry-subtitle-weight);
    font-style: var(--entry-subtitle-style);
    font-size: 1rem;
    line-height: 1.35;
    color: var(--ink);
  }

  .period {
    grid-area: period;
    margin-bottom: 0.3rem;
    font-family: var(--labels-font);
    font-weight: 400;
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    color: var(--ink-muted);
    white-space: nowrap;
  }

  /* The sidebar sets --entry-body-size to a smaller size for its narrow column. */
  .body {
    margin-top: 0.65rem;
    max-width: 40em;
    font-size: var(--entry-body-size, 1rem);
    line-height: 1.55;
    color: var(--ink-soft);
    text-wrap: pretty;
  }

  @media print, (min-width: 36rem) {
    .head {
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas:
        'title period'
        'subtitle subtitle';
      column-gap: 1.25rem;
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
      margin-top: 0.3mm;
      font-size: 10pt;
    }

    .period {
      font-size: 8.5pt;
    }

    .body {
      margin-top: 1.5mm;
      max-width: none;
      line-height: 1.45;
    }
  }
</style>
