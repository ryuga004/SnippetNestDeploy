export interface Snippet {
    id: string;
    title: string;
    description: string;
    language: string;
    tags: string[];
    source_code: string;
    author: {
        author_id: string;
        username: string;
        avatar: string;
    };
}

export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
}

export interface GeneratedCodeType {
    title: string,
    description: string,
    language: string,
    // tags : string [],
    source_code: string,
}