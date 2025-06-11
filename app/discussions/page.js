import Discussions from "../_mainComponents/Discussions";
import { getMostUsedTags } from "../_utils/postActions";

export const metadata = {
  title: "Echo / Disscussions",
};

export default async function PostFeedPage() {
  return (
    <div className="min-h-screen bg-gray-700">
      <Discussions />
    </div>
  );
}
