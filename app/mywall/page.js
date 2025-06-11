import { Suspense } from "react";
import LoadingSpinner from "../_mainComponents/LoadingSpinner";
import MyWall from "../_mainComponents/MyWall";

export const metadata = {
  title: "Echo / My Wall",
};

export default async function page() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <MyWall />
      </Suspense>
    </div>
  );
}
