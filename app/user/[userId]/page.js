import UserProfile from "../../_mainComponents/UserProfile";

export const metadata = {
  title: "Echo / User Profile",
};

export default function UserProfilePage({ params }) {
  return (
    <div>
      <UserProfile userId={params.userId} />
    </div>
  );
}
