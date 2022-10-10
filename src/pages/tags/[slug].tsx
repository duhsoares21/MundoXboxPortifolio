import Head from 'next/head'
import { getPrismicClient } from '../../services/prismic'
import { RichText } from 'prismic-dom'
import styles from '../home.module.scss'
import getCurrentLanguage from '../../utils/localization'
import { ListaPosts } from '../../components/ListaPosts'

type Post = {
    tag: string;
    slug: string;
    image: string;
    title: string;
    content: string;
    tags: string[];
    updatedAt: string;
    lang: string;
}

interface PostsProps {
    posts: Post[]
}

function slugify(text)
{
    return text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}

function makeTag(slug) {
    var words = slug.split('-');
  
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }
  
    return words.join(' ');
}

function fixSpecialTags(tag : string) {
   tag = tag.replace("Idxbox", "ID@Xbox").replace("Xbox Series X  S","Xbox Series X | S").replace("Goldeneye 007", "GoldenEye 007").replace("Square Enix", "Square-Enix").replace("Jrpg", "JRPG").replace("Ea","EA");

   return tag;
}

export default function Tags({ posts }: PostsProps) { 
    
    const canonicalLang = (posts[0]?.lang != 'pt-br') ? posts[0]?.lang+'/' : '';

    const tagTitle = posts[0].tag;
    const title = `${tagTitle} | Mundo Xbox`;

    const tagLabel = getCurrentLanguage(posts[0]?.lang).tag;

    let description;

    if(posts[0]?.lang != 'ja-jp') {
        description = getCurrentLanguage(posts[0]?.lang).tagDescription+" "+tagTitle;
    }
    else
    {
        description = tagTitle+getCurrentLanguage(posts[0]?.lang).tagDescription
    }

    const canonical = 'https://www.mundoxbox.com.br/tags/'+canonicalLang+slugify(tagTitle);

    return ( 
     <>
        <Head>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content="https://www.mundoxbox.com.br/images/LogoWhatsapp300.png" />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="pt_BR" />
            <meta name='description' content={description}></meta>
            <link rel='canonical' href={canonical} />
        </Head>

        <main className={styles.container}>
            <div className={styles.posts}>
                <h1>{tagLabel}: {tagTitle}</h1>
                { posts.map( post => (
                    <ListaPosts key={post.slug} post={post} />
                )) }
            </div>
        </main>
     </>   
    )
}

export async function getServerSideProps(params) {

    const tag = fixSpecialTags(makeTag(params.query.slug));
    
    const prismic = getPrismicClient()
    
    const response = await prismic.getAllByTag(tag, {
        orderings: {
          field: 'document.first_publication_date',
          direction: 'desc',
        },
        lang: params.locale
    });

    const posts = response.map(post => {
        return {
            tag: tag,
            slug: post.uid,
            title: RichText.asText(post.data.title),
            image: (post.data.image != null) ? post.data.image.url : 'https://www.mundoxbox.com.br/images/LogoWhatsapp300.png',
            content: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            tags: post.tags,
            updatedAt: new Date((post.data.publication != null) ? post.data.publication : post.last_publication_date).toLocaleDateString("pt-BR", {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }),
            lang: post.lang,
        }
    })

    return {
        props: {posts},
    }
}