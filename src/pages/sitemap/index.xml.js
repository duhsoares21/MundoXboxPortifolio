import React from 'react'
import linkResolver from "../../utils/linkResolver";
import { getPrismicClient } from "../../services/prismic";

function generateSiteMap(pages) {
  const origin = (pages?.results[0]?.lang !== 'pt-br') ? process.env.NEXT_PUBLIC_SITE_URL+pages?.results[0]?.lang+'/' : process.env.NEXT_PUBLIC_SITE_URL;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  ${pages?.results?.map((page, index) => {
    const lastModified = new Date(page.last_publication_date).toISOString();
    
    if (linkResolver(page) === "/") {
      return `<sitemap key='${index}'>
      <loc>${origin}</loc>
      </sitemap>`;
    }

    if (
      (linkResolver(page) !== "/" || page.url) &&
      !(page.data.seoIndex === false)
      ) {
          const url = origin + (linkResolver(page) || page.url);

          return `
          <sitemap key='${index}'>
            <loc>${url}</loc>
            <lastmod>${lastModified}</lastmod>
          </sitemap>
          `;
        }
       })
       .join('')}
   </sitemapindex>
 `;
}

function SiteMap(){

}

export const getServerSideProps = async (res) => {

    const Client = getPrismicClient();

    const page = res.query.page;
    const lang = res.query.lang;

    const pages = await Client.getByType('post', 
    {
        orderings: 
        [
            {
                field: 'my.post.publication',
                direction: 'desc'
            },
            {
                field: 'document.last_publication_date',
                direction: 'desc'
            }
        ],
        pageSize: 100,
        page: page,
        lang: lang
    });

    const sitemap = generateSiteMap(pages);

    res.res.setHeader("Content-Type", "text/xml");
    res.res.write(sitemap);
    res.res.end();

    return {
        props: {},
    };
};

export default SiteMap;