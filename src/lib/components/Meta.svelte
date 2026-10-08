<script lang="ts">
  import { cv } from '../cv';

  const pageUrl = `${cv.site.url}/`;
  const imageUrl = cv.portrait ? new URL(cv.portrait.src, cv.site.url).href : undefined;
  const [firstName, ...rest] = cv.name.split(' ');
  const current = cv.experience.find((job) => job.period.end === 'present');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: cv.name,
    jobTitle: cv.headline,
    url: pageUrl,
    image: imageUrl,
    worksFor: current && { '@type': 'Organization', name: current.organization },
    alumniOf: [...new Set(cv.education.map((entry) => entry.institution))].map((name) => ({
      '@type': 'EducationalOrganization',
      name,
    })),
  };

  // Escape "<" so the JSON can never close the surrounding script tag.
  const jsonLd = JSON.stringify(structuredData).replace(/</g, '\\u003c');
</script>

<svelte:head>
  <title>{cv.site.title}</title>
  <meta name="description" content={cv.site.description} />
  <meta name="author" content={cv.name} />
  <link rel="canonical" href={pageUrl} />

  <meta property="og:type" content="profile" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:title" content={cv.site.title} />
  <meta property="og:description" content={cv.site.description} />
  <meta property="og:site_name" content={cv.name} />
  <meta property="og:locale" content="en_US" />
  <meta property="profile:first_name" content={firstName} />
  <meta property="profile:last_name" content={rest.join(' ')} />
  {#if imageUrl}
    <meta property="og:image" content={imageUrl} />
    <meta property="og:image:alt" content={cv.portrait?.alt} />
  {/if}
  <meta name="twitter:card" content="summary" />

  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
