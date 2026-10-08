<script lang="ts">
  import type { CV } from '../cv';
  import { telHref } from '../format';
  import DownloadButton from './DownloadButton.svelte';

  let { cv }: { cv: CV } = $props();
</script>

<header class="masthead">
  <div class="identity">
    {#if cv.portrait}
      <img class="portrait" src={cv.portrait.src} alt={cv.portrait.alt} width="480" height="480" />
    {/if}
    <div class="titles">
      <h1 class="name">{cv.name}</h1>
      <p class="headline">{cv.headline}</p>
    </div>
  </div>

  <div class="download">
    <DownloadButton fileName={cv.site.pdfFileName} />
  </div>

  <address class="contact">
    <h2 class="visually-hidden">Contact</h2>
    <dl>
      <div>
        <dt>Email</dt>
        <dd><a href="mailto:{cv.contact.email}">{cv.contact.email}</a></dd>
      </div>
      <div>
        <dt>Phone</dt>
        <dd><a href={telHref(cv.contact.phone)}>{cv.contact.phone}</a></dd>
      </div>
      <div>
        <dt>Web</dt>
        <dd><a href="https://{cv.contact.website}">{cv.contact.website}</a></dd>
      </div>
    </dl>
  </address>
</header>

<style>
  .masthead {
    display: grid;
    grid-template-areas:
      'identity'
      'download'
      'contact';
    gap: 1.75rem;
    padding-bottom: clamp(2.5rem, 6vw, 4rem);
  }

  /* Phones and tablets: portrait above the name, so the name gets the full width. */
  .identity {
    grid-area: identity;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }

  .portrait {
    flex: none;
    width: clamp(5.5rem, 22vw, 7rem);
    aspect-ratio: 1;
    height: auto;
    object-fit: cover;
    background: var(--rule);
  }

  .titles {
    flex: 1;
    min-width: 0;
    width: 100%;
    /* The name sizes itself to this box (cqi = 1% of its width). */
    container-type: inline-size;
  }

  .name {
    font-family: var(--name-font);
    font-weight: var(--name-weight);
    font-style: var(--name-style);
    /* Never wraps: shrinks to fit instead. */
    font-size: min(4.25rem, 11cqi);
    line-height: 1;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  .headline {
    margin-top: 0.35rem;
    font-family: var(--headline-font);
    font-weight: var(--headline-weight);
    font-style: var(--headline-style);
    font-size: clamp(1.0625rem, 2.2vw, 1.25rem);
    line-height: 1.3;
    color: var(--ink-soft);
    letter-spacing: 0.005em;
  }

  .download {
    grid-area: download;
  }

  .contact {
    grid-area: contact;
  }

  dl {
    display: grid;
    gap: 0.3rem;
    font-size: 0.9375rem;
  }

  dl > div {
    display: grid;
    grid-template-columns: 3.75rem minmax(0, 1fr);
    align-items: baseline;
  }

  dt {
    font-family: var(--labels-font);
    font-weight: var(--labels-weight);
    font-style: var(--labels-style);
    font-size: 0.6875rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }

  dd {
    overflow-wrap: anywhere;
  }

  /* Desktop and print: portrait beside the name. */
  @media print, (min-width: 56rem) {
    .identity {
      flex-direction: row;
      align-items: flex-end;
      gap: 1.75rem;
    }

    .portrait {
      width: 8rem;
    }
  }

  /* Desktop: name row spans the page; contact sits beside the buttons, over the sidebar. */
  @media screen and (min-width: 56rem) {
    .masthead {
      grid-template-columns: minmax(0, 1fr) var(--sidebar);
      grid-template-areas:
        'identity identity'
        'download contact';
      column-gap: var(--gutter);
      row-gap: 2.25rem;
    }
  }

  @media print {
    .masthead {
      grid-template-columns: minmax(0, 1fr) var(--sidebar);
      grid-template-areas: 'identity contact';
      column-gap: var(--gutter);
      padding-bottom: 7mm;
    }

    .download {
      display: none;
    }

    .contact {
      align-self: end;
    }

    .identity {
      gap: 6mm;
    }

    .portrait {
      width: 23mm;
    }

    .name {
      font-size: min(27pt, 11cqi);
    }

    .headline {
      margin-top: 1.2mm;
      font-size: 11.5pt;
    }

    dl {
      font-size: 9.5pt;
      gap: 0.8mm;
    }

    dl > div {
      grid-template-columns: 14mm minmax(0, 1fr);
    }

    dt {
      font-size: 7.5pt;
    }

    dd {
      white-space: nowrap;
    }
  }
</style>
