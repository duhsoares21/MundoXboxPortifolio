import Head from 'next/head'
import Link from 'next/link'
import { getPrismicClient } from '../services/prismic'
import { RichText } from 'prismic-dom'
import styles from './home.module.scss'
import getCurrentLanguage from '../utils/localization'
import { ListaPosts } from '../components/ListaPosts'


type Post = {
    slug: string;
    title: string;
    image: string;
    content: string;
    tags: string[];
    updatedAt: string;
    lang: string;
}

interface PostsProps {
    posts: Post[],
    paginaAtual: number;
    totalPaginas: number,
}


export default function Posts({posts, paginaAtual, totalPaginas} : PostsProps) { 
    
    const canonicalLang = (posts[0]?.lang != 'pt-br') ? posts[0]?.lang+'/' : '';

    const canonical = 'https://www.mundoxbox.com.br/'+canonicalLang+paginaAtual;

    const title = getCurrentLanguage(posts[0]?.lang).home + " | Mundo Xbox";
    const description = getCurrentLanguage(posts[0]?.lang).description;
    const shortDescription = getCurrentLanguage(posts[0]?.lang).shortDescription;

    const prevPage = paginaAtual - 1;
    const nextPage = paginaAtual + 1;

    const prevPageURL = canonicalLang+prevPage;
    const nextPageURL = canonicalLang+nextPage;
    
    return ( 
     <>
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />

            <meta property="og:title" content="Mundo Xbox" />
            <meta property="og:description" content={shortDescription} />
            <meta property="og:image" content="https://www.mundoxbox.com.br/images/LogoWhatsapp300.png" />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="pt_BR" />

            <meta name="theme-color" content="#9BF00B"/>

            <link rel='canonical' href={canonical} />
        </Head>

        <main className={styles.container}>
            <div className={styles.posts}>
                { posts.map( post => (
                   <ListaPosts key={post.slug} post={post} />
                )) }
                <div className={styles.navigationContainer}>
                {
                    (paginaAtual > 1) ? 
                    (
                        <Link href={prevPageURL}>
                            <a className={styles.verMais}>←</a>
                        </Link>
                    ) : (<></>)
                }
                {
                    (paginaAtual > 1 && paginaAtual < totalPaginas) ? 
                    (
                        <span className={styles.separador}></span>
                    ) : (<></>)
                }
                {
                    (paginaAtual < totalPaginas) ? 
                    (
                        <Link href={nextPageURL}>
                            <a className={styles.verMais}>→</a>
                        </Link>
                    ) : (<></>)
                }
                </div>
            </div>
        </main>
     </>   
    )
}

export async function getServerSideProps(params) {

    let page = params.query.id;

    const prismic = getPrismicClient()

    if(!Number(page))
    {
        page = 1;
    }

    const response = await prismic.getByType('post', 
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
        pageSize: 10,
        page: page,
        lang: params.locale
    });

    if(response.results_size === 0)
    {
        return {
            props: {},
            redirect: {
                destination: "/1",
                permanent: false,
            },
        }
    }
    else
    {
        const posts = response.results.map(post => {
            return {
                slug: post.uid,
                title: RichText.asText(post.data.title),
                image: (post.data.image != null) ? post.data.image.url : 'https://www.mundoxbox.com.br/images/LogoWhatsapp300.png',
                content: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
                tags: post.tags,
                updatedAt: new Date((post.data.publication != null) ? post.data.publication : post.first_publication_date).toLocaleDateString(params.locale, {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }),
                lang: post.lang,
            }
        })

        return {
            props: 
            {
                posts,
                paginaAtual: response.page,
                totalPaginas: response.total_pages,
            },
        }
    }

}
