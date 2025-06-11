import CommunityPage from "@/app/_mainComponents/CommunityPage";
import { getCommunity } from "@/app/_utils/communityActions";

export async function generateMetadata({ params }) {
  const { communityId } = params;
  const community = await getCommunity(communityId);

  return {
    title: community
      ? `Echo / Community / ${community?.name}`
      : "Echo / Community not found 🚫",
  };
}

export default async function page({ params }) {
  const { communityId } = await params;

  return (
    <div>
      <CommunityPage communityId={communityId} />
    </div>
  );
}
