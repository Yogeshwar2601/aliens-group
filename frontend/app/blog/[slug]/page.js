import BlogArticlePage from "@/components/blog/BlogArticlePage";

export default async function BlogArticle({ params }) {
    const { slug } = await params;

    return <BlogArticlePage slug={slug} />;
}
