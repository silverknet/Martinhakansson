<script lang="ts">
  import type { Publication } from '../cv';

  let { items }: { items: Publication[] } = $props();
</script>

<ul class="entries" role="list">
  {#each items as item (item.title)}
    <li>
      <article class="publication">
        <h3 class="title">
          {#if item.url}<a href={item.url}>{item.title}</a>{:else}{item.title}{/if}
        </h3>
        {#if item.authors}
          <p class="authors">{item.authors}</p>
        {/if}
        <p class="meta">
          <span>{item.status} · {item.venue}</span>
          <time datetime={item.year}>{item.year}</time>
        </p>
      </article>
    </li>
  {/each}
</ul>

<style>
  .entries {
    display: grid;
    gap: 2rem;
    list-style: none;
  }

  .title {
    max-width: 34em;
    font-family: var(--publication-title-font);
    font-weight: var(--publication-title-weight);
    font-style: var(--publication-title-style);
    font-size: 1.25rem;
    line-height: 1.3;
    text-wrap: pretty;
  }

  .authors {
    margin-top: 0.35rem;
    color: var(--ink-soft);
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.25rem 1.5rem;
    margin-top: 0.5rem;
    font-size: 0.9375rem;
    color: var(--ink-soft);
  }

  time {
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
    color: var(--ink-muted);
  }

  @media print {
    .publication {
      break-inside: avoid;
    }

    .title {
      max-width: none;
      font-size: 12pt;
    }

    .meta {
      margin-top: 1.2mm;
      font-size: 9.5pt;
    }

    time {
      font-size: 8.5pt;
    }
  }
</style>
