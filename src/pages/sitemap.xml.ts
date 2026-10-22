import type { GetServerSideProps } from 'next';
import { getStaffList, SITE_URL, staffPath } from '../api/staffDirectory';

/** Страницы сайта с canonical; профили специалистов добавляются из Booka. */
const STATIC_PATHS = ['/', '/staff', '/forpsychologists', '/o-nas', '/specialisty', '/pomosh-kg'];

function buildSitemap(paths: string[]) {
  const urls = paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let staffPaths: string[] = [];
  try {
    staffPaths = (await getStaffList()).map(staffPath);
  } catch (error) {
    // Без профилей отдаём хотя бы статичные страницы и не кэшируем надолго
    console.error('[sitemap] getStaffList', error);
  }

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    staffPaths.length > 0
      ? 'public, s-maxage=3600, stale-while-revalidate=86400'
      : 'public, s-maxage=60'
  );
  res.write(buildSitemap([...STATIC_PATHS, ...staffPaths]));
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
