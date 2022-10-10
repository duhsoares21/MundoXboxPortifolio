// Manages the url links to internal Prismic documents
// Expand this function as your website grows
const linkResolver = (doc) => {
    if (doc.type === "post") {
      return `posts/${doc.uid}/`;
    }
  
    // using Route Resolver instead
    // https://prismic.io/docs/technologies/the-route-resolver-nextjs
    if (doc.type === "content-post") {
      return null;
    }
    
    return "/";
  };
  
  export default linkResolver;