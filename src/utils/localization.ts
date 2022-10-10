let languages = [];

languages['pt-br'] = {
    home: "Início",
    desciption: "Fique por dentro de tudo sobre o universo Xbox! Notícias, análises, gameplays, e muito mais.",
    shortDescription: "Fique por dentro de tudo sobre o universo Xbox!",
    tag: "Tag",
    tagDescription: "Fique por dentro de tudo sobre",
    prev: "Mais recente",
    next: "Mais antigo",
}

languages['en-us'] = {
    home: "Home",
    description: "Keep updated on all things Xbox! News, analysis, gameplays, and more.",
    shortDescription: "Keep updated on all things Xbox!",
    tag: "Tag",
    tagDescription: "Keep updated on all things",
    prev: "Newest",
    next: "Oldest",
}

languages['ja-jp'] = {
    home: "ホーム",
    description: "Xbox Universeのすべての上にとどまりましょう！ ニュース、分析、ゲームプレイなど。",
    shortDescription: "Xbox Universeのすべての上にとどまりましょう！",
    tag: "タグ",
    tagDescription: "のすべての上にとどまりましょう！",
    prev: "前へ",
    next: "次へ",
}

function getCurrentLanguage(lang: string){
    if(languages.hasOwnProperty(lang)) {
        return languages[lang];
    }
    else {
        return languages['pt-br']
    }
}

export default getCurrentLanguage;