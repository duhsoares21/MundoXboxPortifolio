import * as prismic from '@prismicio/client';
import smJson from '../../sm.json'

export function getPrismicClient() {

    const endpoint = process.env.PRISMIC_ENDPOINT;
    
    const client = prismic.createClient(endpoint, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    })

    return client;
}