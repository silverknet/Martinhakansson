<script lang="ts">
  import { cv } from './lib/cv';
  import CVHeader from './lib/components/CVHeader.svelte';
  import DownloadButton from './lib/components/DownloadButton.svelte';
  import Education from './lib/components/Education.svelte';
  import Experience from './lib/components/Experience.svelte';
  import Meta from './lib/components/Meta.svelte';
  import Publications from './lib/components/Publications.svelte';
  import Section from './lib/components/Section.svelte';
  import Skills from './lib/components/Skills.svelte';
  import { typography, typographyCss } from './lib/typography';
</script>

<Meta />

<svelte:head>
  {@html `<style>${typographyCss(typography)}</style>`}
</svelte:head>

{#if import.meta.env.DEV}
  {#await import('./lib/dev/FontPanel.svelte') then { default: FontPanel }}
    <FontPanel />
  {/await}
{/if}

<div class="page">
  <CVHeader {cv} />

  <!--
    Source order is the reading order on mobile and for screen readers.
    On wide screens and in print, the second column becomes a sidebar.
  -->
  <main class="cv">
    <div class="column">
      <Section id="profile" title="Profile">
        <p class="profile">{cv.profile}</p>
      </Section>

      <Section id="experience" title="Experience">
        <Experience entries={cv.experience} />
      </Section>

      <Section id="publications" title="Publications">
        <Publications items={cv.publications} />
      </Section>

      <Section id="education" title="Education">
        <Education entries={cv.education} />
      </Section>
    </div>

    <div class="column">
      <Section id="skills" title="Skills">
        <Skills groups={cv.skills} />
      </Section>

      <Section id="additional" title="Additional experience">
        <Experience entries={cv.additionalExperience} />
      </Section>
    </div>
  </main>

  <footer class="colophon no-print">
    <p>{cv.name} · <a href="https://{cv.contact.website}">{cv.contact.website}</a></p>
    <DownloadButton fileName={cv.site.pdfFileName} showPrint={false} />
  </footer>
</div>

<style>
  .page {
    max-width: 74rem;
    margin-inline: auto;
    padding: clamp(2rem, 7vw, 5.5rem) clamp(1rem, 5vw, 3.5rem) clamp(2.5rem, 6vw, 4rem);
  }

  .cv,
  .column {
    display: grid;
    align-content: start;
    gap: clamp(2.75rem, 6vw, 3.75rem);
  }

  .profile {
    max-width: 34em;
    font-family: var(--profile-font);
    font-weight: var(--profile-weight);
    font-style: var(--profile-style);
    font-size: clamp(1.25rem, 2.4vw, 1.4375rem);
    line-height: 1.5;
    text-wrap: pretty;
  }

  .colophon {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem 2rem;
    margin-top: clamp(4rem, 9vw, 6rem);
    padding-top: 1.25rem;
    border-top: 1px solid var(--rule);
    font-size: 0.9375rem;
    color: var(--ink-muted);
  }

  @media print, (min-width: 56rem) {
    .cv {
      grid-template-columns: minmax(0, 1fr) var(--sidebar);
      column-gap: var(--gutter);
    }
  }

  @media print {
    .page {
      max-width: none;
      padding: 0;
    }

    .cv,
    .column {
      gap: 7mm;
    }

    .profile {
      max-width: none;
      font-size: 12pt;
      line-height: 1.45;
    }
  }
</style>
