export type Tag = {
    id: string;
    name: string;
};

export type VideoType = {
    id: string;
    name: string;
}

export type Influencer = {
    id: string;
    name: string;
}

export type Snippet = {
    id: number;
    description: string;
    starts_at: string;
    ends_at: string;
    transcript: string;
    video_url: string;
    video_id: number;
    video_type: VideoType;
    snippet_tags: Tag[];
};

export type Video = {
    id: number;
    title: string;
    image_url: string;
    video_url: string;
    host_id: Influencer;
    video_type: VideoType;
    snippets: Snippet[];
}

export type TimeProp = {
    hours: string;
    minutes: string;
    seconds: string;
}