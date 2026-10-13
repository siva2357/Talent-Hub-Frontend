export interface Blog {
    _id: string;
    adminId: string;

    title: string;
    category: string;
    content: string;

    featuredMedia?: string;
    blogBanner?: string;

    tags: string[];

    createdAt: string;
    updatedAt: string;

    __v?: number;
}