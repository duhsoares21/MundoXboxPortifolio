import { DiscussionEmbed } from 'disqus-react';

type ConfigType = {
    url: string;
    identifier: string;
    title: string;
    language: string;
}

type DisqusProps = {
    shortname: string;
    config: ConfigType;
}

export function DisqusEmbed(props : DisqusProps) {

    return (
        <DiscussionEmbed
            shortname={props.shortname}
            config={props.config}
        />
    )
}