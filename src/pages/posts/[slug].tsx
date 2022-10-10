import { getPrismicClient } from "../../services/prismic"
import { RichText } from "prismic-dom"
import Head from "next/head"
import styles from './post.module.scss'
import { DisqusEmbed } from "../../components/DisqusEmbed"
import Script from "next/script"

interface PostProps {
    post: {
        slug: string;
        image: string;
        title: string;
        description: string;
        color: string;
        content: string;
        tags: string[];
        author: string;
        updatedAt: string;
        lang: string;
    }
}

function createDescription(content: string, maxLength: number) {    
    //trim the string to the maximum length
    var trimmedString = content.slice(0, maxLength);
    
    //re-trim if we are in the middle of a word
    trimmedString = trimmedString.slice(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
    
    return trimmedString+"…";
}

export default function Post({ post }: PostProps) {
     
    const coverImage = post.image;
    const title = `${post.title} | Mundo Xbox`;
    const themeColor = (post.color) ? post.color : "#9BF00B";
    
    let defaultLang = post.lang;
    let langPart = defaultLang.split('-');
    
    let lang = langPart[0];
    let country = langPart[1];

    const canonicalLang = (defaultLang != 'pt-br') ? defaultLang+'/' : '';

    const postUrl = "https://www.mundoxbox.com.br/posts/"+canonicalLang+post.slug;

    const disqus_lang = lang+"_"+country.toUpperCase()

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.description} />
                <meta property="og:image" content={coverImage} />
                <meta property="og:type" content="article" />
                <meta property="article:author" content={post.author} />
                { post.tags.map( tag => (        
                    <meta key={tag} property="article:tag" content={tag} />
                ))}
                <meta property="og:locale" content={disqus_lang} />

                <meta name="theme-color" content={themeColor}/>
                <meta name='description' content={post.description}></meta>

                <link rel='canonical' href={postUrl} />
            </Head>
            <main id="main-container" className={styles.container}>
                <article lang={post.lang} className={styles.post}>
                    <h1>{ post.title }</h1>
                    <address>
                        <time>{post.updatedAt}</time>
                        <span>{post.author}</span>
                    </address>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{__html:post.content}} />
                </article>
                <DisqusEmbed shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME} config={{
                    url: postUrl,
                    identifier: post.slug,
                    title: post.title,
                    language: disqus_lang
                }} />
            </main>
        </>
    )
}

export async function getServerSideProps(params) {

    const slug = params.params.slug;       

    const prismic = getPrismicClient();

    const response = await prismic.getByUID('post', String(slug),  {
        fetchLinks: ['author.name'],
        lang: params.locale,
    })

    const post = {
        slug: slug,
        image: (response.data.image != null) ? response.data.image.url : 'https://www.mundoxbox.com.br/images/LogoWhatsapp300.png',
        title: RichText.asText(response.data.title),
        description: createDescription(RichText.asText(response.data.content), 154),
        content: RichText.asHtml(response.data.content),
        color: response.data.color,
        tags: response.tags,
        author: (response.data.author.data?.name != null) ? response.data.author.data.name[0].text : 'Mundo Xbox',
        updatedAt: new Date((response.data.publication != null) ? response.data.publication : response.first_publication_date).toLocaleDateString(params.locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }),
        lang: response.lang,
    }

    return {
        props: {
            post,
        }
    }
}
