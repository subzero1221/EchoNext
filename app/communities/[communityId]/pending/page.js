import PendingPostsPage from "@/app/_mainComponents/PendingPostsPage";

export default function PendingPosts({ params }) {
  const { communityId } = params;

  return <PendingPostsPage communityId={communityId} />;
}
