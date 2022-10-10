import Link from 'next/link'
import styles from './styles.module.scss'

type Post = {
    slug: string;
    image: string;
    title: string;
    content: string;
    tags: string[];
    updatedAt: string;
    lang: string;
}

type PostProps = {
    post: Post;
}

let baseURL = "/posts/";

function slugify(text)
{
    return text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}

export function ListaPosts(props : PostProps) {

const post = props.post;

const canonicalLang = (post?.lang != 'pt-br') ? post?.lang+'/' : '';

return (
    <div className={styles.postContainer} lang={post.lang}>
        <Link href={baseURL + post.slug}>
            <a className={styles.postLink}>
                <div className={styles.imageContainer}>
                    <img alt={post.title} src={post.image} />
                </div>
                <div className={styles.textContainer}>
                    <time>{post.updatedAt}</time>
                    <strong>{post.title}</strong>
                    <p>{post.content}</p>
                </div>
            </a>
        </Link>
        <div className={styles.tags}>
            { post.tags.map( tag => (
                <a key={slugify(tag)} href={"/"+canonicalLang+"tags/"+slugify(tag)}>{tag}</a>
            ))}
        </div>
    </div>
)
}