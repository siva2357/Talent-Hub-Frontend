export interface Blog {
    _id: string;
    title: string;
    description: string;
    content?: string;
    category: string;
    imageUrl?: string;
    publishedAt?: string;
    readTime?: number;
    slug?: string;
}