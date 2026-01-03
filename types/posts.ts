
export interface Post {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    users?: {
        id: string;
        username: string;
    };
}

export interface PostsListResponse {
    items: Post[];
    count: number;
    limit: number;
    offset: number;
}

export interface Like {
    id: string;
    post_id: string;
    user_id: string;
    created_at: string;
}

export interface LikesListResponse {
    items: Like[];
    count: number;
}

export interface LikeCountResponse {
    count: number;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    users?: {
        id: string;
        username: string;
    };
}

export interface CommentsListResponse {
    items: Comment[];
    count: number;
    limit: number;
    offset: number;
}
