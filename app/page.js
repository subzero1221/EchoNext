import PostFeed from "./_mainComponents/PostFeed";
import { getPosts } from "./_utils/postActions";

export const metadata = {
  title: "Echo / Home",
};

export default async function PostFeedPage() {
  const posts = await getPosts();
  const safePosts = JSON.parse(JSON.stringify(posts));

  return (
    posts && (
      <div className="min-h-screen  pl-12 py-8">
        <PostFeed posts={safePosts} />
      </div>
    )
  );
}
