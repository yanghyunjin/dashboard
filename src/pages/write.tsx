// pages/write.tsx

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { getLoginStatus } from "../utils/cookieHelper";
import styles from "../styles/write.module.css";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("../components/RichTextEditor"), {
  ssr: false,
});

const Write = () => {
  // Check if the user is logged in
  const isLoggedIn = getLoginStatus() === "loggedIn";
  const router = useRouter();

  // State to store the title and content of the post
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState(0);
  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const postData = {
      title: title,
      content: content,
      type: postType,
    };
    console.log(content);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If successful, you can do additional operations like notifying the user
      // For now, I'm just redirecting back to the home page
      alert("게시글이 등록되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("Error while saving the post:", error);
      // Handle your errors here, like showing a notification to the user
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <Head>
          <title>글쓰기 - 로그인 필요</title>
        </Head>
        <header>
          <h1>글쓰기 - 로그인 필요</h1>
        </header>
        <main>
          <p>글을 작성하려면 먼저 로그인해주세요.</p>
        </main>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <Head>
          <title>글쓰기</title>
        </Head>
        <div className={styles.header}>
          <h1>글쓰기</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles["form-container"]}>
          <div>
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="type">유형</label>
            <select
              id="type"
              value={postType}
              onChange={(e) => setPostType(Number(e.target.value))}
            >
              <option value={0}>생태도감</option>
              <option value={1}>QnA</option>
            </select>
          </div>
          <div>
            <label htmlFor="content">내용</label>
            {/* Use the RichTextEditor component here */}

            <RichTextEditor value={""} onChange={setContent} />
          </div>
          <button type="submit">작성 완료</button>
        </form>
      </div>
    );
  }
};

export default Write;
