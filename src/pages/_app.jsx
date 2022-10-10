import { Header } from "../components/Header";
import { SessionProvider } from "next-auth/react"

import '../styles/global.scss';
import '../styles/disqus.scss';
import '../styles/paginacao.scss';

function MyApp({ Component, pageProps }) {

  let lang = '';
  
  if(pageProps.hasOwnProperty('posts')) {
    lang = pageProps.posts[0].lang;
  } else if (pageProps.hasOwnProperty('post'))
  {
    lang = pageProps.post.lang;
  }

  if(typeof window !== 'undefined') {
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "dobu4n5yaf");
  }

  return (
    <SessionProvider session={pageProps.session}>
      <Header lang={lang} />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
