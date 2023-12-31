export interface Blog {
    id: number,
    name: string;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    pictureUrl: string;
    categoryID: number;
    tagID: number;
    categoryName: string | undefined;
    tagName: string | undefined;
    description: BlogDescription;
    comment: BlogComment[];
    blogTags: BlogTag[];
    category: {
        name: string;
    }
}

export interface BlogParams {
    searchTerm?: string;
    pageNumber: number;
    pageSize: number;
    category: string[];
    tags: string[];
}

export interface BlogDescription {
    text: string;
}

export interface BlogComment {
    id: number;
    text: string;
    name: string;
    email: string;
    isAccepted: boolean;
    createdAt: string;
    parentCommentID: number;
}

export interface BlogTag {
    id: number;
    blogID: number;
    tagID: number;
}

