import Document, {Html, Head, Main, NextScript} from 'next/document';
import Script from 'next/script';

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />

                    <link rel="shortcut icon" href="/favicon.png" type="image/png" />
                </Head>
                <Script async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=mundoxbox" />
                <Script 
                    async 
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1347779834993382"
                    crossOrigin="anonymous" 
                />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}