import Link from "next/link";
import PostList from "@/components/postlist";
import Container from "./container";

export default function HomePage({ posts }) {
  return (
    <>
      {posts && (
        <Container  >
          <div className="grid gap-10 md:grid-cols-2 lg:gap-10 mt-10 ">
            {posts.slice(0, 2).map(post => (
              <PostList
                key={post._id}
                post={post}
                aspect="landscape"
                preloadImage={true}
              />
            ))}
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
            {posts.slice(2, 14).map(post => (
              <PostList key={post._id} post={post} aspect="square" />
            ))}
          </div>
          
        </Container>
      )}
    </>
  );
}
