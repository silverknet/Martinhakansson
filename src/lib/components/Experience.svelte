<script lang="ts">
  import type { Experience } from '../cv';
  import Entry from './Entry.svelte';

  let { entries }: { entries: Experience[] } = $props();
</script>

<ul class="entries" role="list">
  {#each entries as job (job.organization + job.role)}
    <li>
      <Entry title={job.organization} subtitle={job.role} period={job.period} url={job.url}>
        <p>{job.summary}</p>
        {#if job.highlights?.length}
          <ul class="highlights">
            {#each job.highlights as highlight}
              <li>{highlight}</li>
            {/each}
          </ul>
        {/if}
        {#if job.technologies?.length}
          <p class="technologies">
            <span class="label">Technologies</span>
            {job.technologies.join(', ')}
          </p>
        {/if}
        {#if import.meta.env.DEV && job.todo}
          <p class="todo no-print"><strong>To do (dev only):</strong> {job.todo}</p>
        {/if}
      </Entry>
    </li>
  {/each}
</ul>

<style>
  .entries {
    display: grid;
    gap: 2.25rem;
    list-style: none;
  }

  .highlights {
    display: grid;
    gap: 0.45rem;
    margin-top: 0.75rem;
    line-height: 1.5;
    list-style: none;
  }

  .highlights li {
    position: relative;
    padding-left: 1.1em;
  }

  .highlights li::before {
    content: '–';
    position: absolute;
    left: 0;
    color: var(--ink-muted);
  }

  .technologies {
    margin-top: 0.9rem;
    font-size: 0.9375rem;
  }

  .label {
    margin-right: 0.5em;
    font-family: var(--labels-font);
    font-weight: var(--labels-weight);
    font-style: var(--labels-style);
    font-size: 0.6875rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }

  .todo {
    margin-top: 0.75rem;
    padding: 0.6rem 0.8rem;
    border: 1px dashed var(--accent);
    font-size: 0.875rem;
    color: var(--accent);
  }

  @media print {
    .entries {
      gap: 5mm;
    }

    .highlights {
      margin-top: 1.5mm;
      gap: 1mm;
      line-height: 1.4;
    }

    .technologies {
      margin-top: 2mm;
    }
  }
</style>
