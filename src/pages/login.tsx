// pages/login.tsx

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { setLoginStatus, getLoginStatus } from "../utils/cookieHelper";
import styles from "../styles/LoginForm.module.css";

const Login = () => {
  const router = useRouter();

  // Check if the user is already logged in (by checking the cookies)
  useEffect(() => {
    // This effect will only run on the client-side
    // It can contain code that uses `document` or interacts with the DOM
    // For example, you can add event listeners, modify the DOM, etc.

    // Check if the user is already logged in (by checking the cookies)
    const savedLoginStatus = getLoginStatus();
    if (savedLoginStatus === "loggedIn") {
      // If logged in, redirect to the home page
      router.push("/");
    }
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //@ts-ignore
  const handleLogin = (e) => {
    e.preventDefault();
    console.log(username);
    console.log(password);
    if (username === "admin" && password === "admin") {
      // Set login status in the cookie
      setLoginStatus("loggedIn");
      // Redirect to the home page after successful login
      router.push("/");
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="container">
      <Head>
        <title>로그인</title>
      </Head>
      <header>
        <h1>로그인</h1>
        <Link href="/">
          <a>돌아가기</a>
        </Link>
      </header>
      <main>
        <form className={styles["login-form"]} onSubmit={handleLogin}>
          <div className={styles["form-group"]}>
            <label htmlFor="username">아이디:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="password">비밀번호:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">로그인</button>
        </form>
      </main>
    </div>
  );
};

export default Login;
