// // pages/write.tsx

// import Head from "next/head";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { getLoginStatus } from "../../utils/cookieHelper";
// import styles from "../styles/write.module.css";
// import RichTextEditor from "../../components/RichTextEditor";

// const Write = () => {
//   // Check if the user is logged in
//   const isLoggedIn = getLoginStatus() === "loggedIn";
//   const router = useRouter();

//   // State to store the title and content of the post
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   useEffect(() => {
//     const getPosts = async () => {
//       try {
//         const response = await fetch("/api/posts/", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(postData),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         // If successful, you can do additional operations like notifying the user
//         // For now, I'm just redirecting back to the home page
//         alert("게시글이 수정되었습니다.");
//         router.push("/");
//       } catch (error) {
//         console.error("Error while saving the post:", error);
//         // Handle your errors here, like showing a notification to the user
//       }
//     };
//   }, []); // Empty dependency array ensures this effect runs only once, on the client-side

//   // Function to handle form submission
//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     event.preventDefault();
//     const postData = {
//       title: title,
//       content: content,
//     };
//     console.log(content);

//     try {
//       const response = await fetch("/api/posts", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(postData),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // If successful, you can do additional operations like notifying the user
//       // For now, I'm just redirecting back to the home page
//       alert("게시글이 수정되었습니다.");
//       router.push("/");
//     } catch (error) {
//       console.error("Error while saving the post:", error);
//       // Handle your errors here, like showing a notification to the user
//     }
//   };

//   if (!isLoggedIn) {
//     return (
//       <div className="container">
//         <Head>
//           <title>글쓰기 - 로그인 필요</title>
//         </Head>
//         <header>
//           <h1>글쓰기 - 로그인 필요</h1>
//         </header>
//         <main>
//           <p>글을 작성하려면 먼저 로그인해주세요.</p>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>글쓰기</title>
//       </Head>
//       <div className={styles.header}>
//         <h1>글쓰기</h1>
//       </div>

//       <form onSubmit={handleSubmit} className={styles["form-container"]}>
//         <div>
//           <label htmlFor="title">제목</label>
//           <input
//             type="text"
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="content">내용</label>
//           {/* Use the RichTextEditor component here */}
//           <RichTextEditor value={content} onChange={setContent} />
//         </div>
//         <button type="submit">작성 완료</button>
//       </form>
//     </div>
//   );
// };

// export default Write;
