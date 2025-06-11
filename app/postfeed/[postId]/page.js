import SinglePost from "@/app/_mainComponents/SinglePost";
import { getPost } from "@/app/_utils/postActions";
import { cookies } from "next/headers";

export default async function PostPage({ params }) {
  const id = await params.postId;
  console.log(id);

  const cookieStore = await cookies();
  const authToken = cookieStore.get("connect.sid")?.value;

  const post = await getPost(authToken, id);
  console.log(post);

  return post?.message ? (
    <div className=" flex justify-center text-white text-2xl items-center w-full h-full pr-32 pb-48">
      Post not found 🚫
    </div>
  ) : (
    <div className="min-h-screen pr-24  py-8">
      <SinglePost post={post} id={id} />
    </div>
  );
}
