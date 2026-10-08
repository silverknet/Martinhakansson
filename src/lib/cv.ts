/**
 * All CV content lives in this file.
 *
 * The web page and the downloadable PDF are both rendered from this data,
 * so editing text here updates both on the next build.
 */

/** 'YYYY' or 'YYYY-MM'. */
export type DateValue = string;

export interface Period {
  start: DateValue;
  /** Omit for a single date. Use 'present' for an ongoing role. */
  end?: DateValue | 'present';
}

export interface Experience {
  organization: string;
  role: string;
  period: Period;
  /** Makes the organization name a link. */
  url?: string;
  summary: string;
  /** Rendered as a bulleted list under the summary. */
  highlights?: string[];
  technologies?: string[];
  /**
   * Editing reminder. Shown only on the local dev server (`npm run dev`),
   * never on the published site or in the PDF.
   */
  todo?: string;
}

export interface Publication {
  title: string;
  /** E.g. 'Accepted publication' or 'Published'. */
  status: string;
  venue: string;
  year: string;
  authors?: string;
  /** DOI or publisher page, once available. */
  url?: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: Period;
  description: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface CV {
  name: string;
  headline: string;
  /** Set to undefined to hide the portrait. Files in /public are served from the site root. */
  portrait?: { src: string; alt: string };
  contact: {
    email: string;
    phone: string;
    /** Domain only, without https://. */
    website: string;
  };
  site: {
    url: string;
    title: string;
    description: string;
    /** File name of the generated PDF (see scripts/build.js). */
    pdfFileName: string;
  };
  profile: string;
  experience: Experience[];
  publications: Publication[];
  education: Education[];
  skills: SkillGroup[];
  additionalExperience: Experience[];
}

export const cv: CV = {
  name: 'Martin Håkansson',
  headline: 'Software Engineer',
  portrait: { src: '/portrait.jpg', alt: 'Portrait of Martin Håkansson' },

  contact: {
    email: 'martincbhak@gmail.com',
    phone: '+46 76 318 57 37',
    website: 'martinhakansson.com',
  },

  site: {
    url: 'https://martinhakansson.com',
    title: 'Martin Håkansson — Software Engineer',
    description:
      'CV of Martin Håkansson, software engineer with a background in computer science and media technology from KTH Royal Institute of Technology.',
    pdfFileName: 'Martin-Hakansson-CV.pdf',
  },

  // DRAFT: proposed wording, not final. Review before publishing.
  profile:
    'Software engineer with a background in computer science and media technology, combining professional experience in fullstack development with a strong interest in system architecture, mathematics, and visualization. I enjoy designing robust software systems, solving complex technical problems, and turning ideas into practical applications.',

  experience: [
    {
      organization: 'Mycronic',
      role: 'Software Engineer',
      period: { start: '2025-06', end: 'present' },
      summary:
        'Primary developer of a fullstack planning and visualization platform, responsible for its technical planning, architecture, and implementation.',
      highlights: [
        'Designed a configurable, domain-agnostic architecture, so users can set up their own data, schedules, and visualizations without new code.',
        'Built an SVG-based floorplan visualization system that connects custom layouts to planning data.',
        'Implemented multi-level access control, combining user-configurable permissions with organization-level policies based on Microsoft Entra ID groups.',
        'Worked directly with stakeholders on requirements and priorities.',
      ],
      technologies: ['SvelteKit', 'TypeScript', 'PostgreSQL', 'SVG', 'Microsoft Entra ID'],
    },
  ],

  publications: [
    {
      title:
        'Low-fidelity motion-captured hand visualization for piano teaching through asynchronous augmented reality collaboration',
      status: 'Accepted publication',
      venue: 'IEEE VR 2026 Workshop (WSR)',
      year: '2026',
    },
  ],

  education: [
    {
      institution: 'KTH Royal Institute of Technology',
      degree: 'M.Sc. Computer Science',
      period: { start: '2022', end: '2025' },
      description:
        'Visualization track (information visualization and 3D graphics). Coursework included AI, deep learning, computer vision, and project-based development using agile methods.',
    },
    {
      institution: 'KTH Royal Institute of Technology',
      degree: 'B.Sc. Media Technology',
      period: { start: '2019', end: '2022' },
      description:
        'Coursework included video, photography, audio, human–computer interaction, UX design, and machine learning.',
    },
    {
      institution: 'Billströmska Folkhögskola',
      degree: 'Music Program',
      period: { start: '2017', end: '2018' },
      description:
        'One-year music program with piano as main instrument, specializing in pop, rock, and jazz.',
    },
  ],

  skills: [
    { label: 'Programming languages', items: ['TypeScript', 'C++', 'Python', 'C#'] },
    {
      label: 'Visualization & graphics',
      items: ['Unity', 'Computer graphics', 'Technical visualization', 'Image and video processing'],
    },
    { label: 'Software development', items: ['Svelte', 'SvelteKit', 'React', 'REST APIs'] },
    { label: 'Engineering', items: ['Fullstack development', 'Algorithms', 'System design', 'Git'] },
  ],

  additionalExperience: [
    {
      organization: 'BarBro.app',
      // Role and start year are unconfirmed; check both.
      role: 'Creator and developer',
      period: { start: '2026', end: 'present' },
      url: 'https://barbro.app/welcome',
      summary:
        'An app for live performers, in invite-only beta: beat and bar detection with grid editing, local stem separation, spoken count-ins, click track, and Ableton export.',
      todo: 'Confirm role and start year. Optionally add technologies.',
    },
    {
      organization: 'Simonstorp.se',
      role: 'Developer and maintainer',
      period: { start: '2020' },
      url: 'https://simonstorp.se',
      summary:
        'Developed and maintained the website for the village of Simonstorp in Åby, including a custom CMS tailored to the client’s needs.',
    },
  ],
};
