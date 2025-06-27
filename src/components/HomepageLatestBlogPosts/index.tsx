import type { ReactNode } from "react";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import latestBlogPosts from "@site/src/data/latestBlogPosts.json";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  description: string;
  permalink: string;
}

export default function HomepageLatestBlogPosts(): ReactNode {
  const latestPosts = latestBlogPosts.slice(0, 3);

  return (
    <section className={styles.latestBlogPosts}>
      <div className="container">
        <Heading as="h2" className="text--center">
          Latest Blog Posts
        </Heading>
        <div className={styles.blogPostList}>
          {latestPosts.map((post: BlogPost) => (
            <div className={styles.blogPostCard} key={post.id}>
              <div className={styles.blogPostTitle}>{post.title}</div>
              <div className={styles.blogPostMeta}>
                {post.date && new Date(post.date).toISOString().slice(0, 10)}
              </div>
              <div className={styles.blogPostDescription}>
                {post.description}
              </div>
              <Link
                className={"button button--primary " + styles.blogPostReadMore}
                to={post.permalink}
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
        <div className="text--center margin-top--lg">
          <Link className="button button--secondary button--lg" to="/blog">
            View All Blog Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
