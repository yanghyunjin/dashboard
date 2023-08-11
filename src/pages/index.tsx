import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Post } from "src/interfaces/Posts";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLoginStatus, removeLoginStatus } from "../utils/cookieHelper";
import DashboardCard from "../components/DashboardCard";
import BoardTab from "../components/BoardTab";
import React from "react";

const DOMAIN = "http://localhost:3000";

interface Props {
  posts: Post[];
}

const Home = ({ posts }: Props) => {
  // State to manage active tab
  const [activeTab, setActiveTab] = useState("생태도감");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [ecoContent, setEcoContent] = useState<Post[]>([]);
  const [qnaContent, setQnaContent] = useState<Post[]>([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUsageTime, setTotalUsageTime] = useState(0);
  const [averageUsageTime, setAverageUsageTime] = useState(0);
  const router = useRouter();

  const itemsPerPage = 5;
  // Calculate the index range of items to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContent =
    activeTab === "생태도감"
      ? ecoContent
      : activeTab === "질문과 답변"
      ? qnaContent
      : [];

  // Get the items to display on the current page
  const displayedBoardData = currentContent.slice(startIndex, endIndex);
  const totalPages = Math.ceil(currentContent.length / itemsPerPage); // Calculate the total number of pages
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  async function fetchPlayingTime() {
    try {
      const response = await fetch(DOMAIN + "/api/playingtime");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTotalUsers(data.count);
      setTotalUsageTime(data.sum);
      setAverageUsageTime(data.avg);
    } catch (error) {
      console.error("There was a problem with the fetch operation:");
    }
  }

  useEffect(() => {
    // This effect will run on the client-side to check the user's login status
    const savedLoginStatus = getLoginStatus();
    if (savedLoginStatus === "loggedIn") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    const tempEco = posts.filter((item) => item.type === 0);
    setEcoContent(tempEco.sort((a, b) => b.id! - a.id!));
    const tempQna = posts.filter((item) => item.type === 1);
    setQnaContent(tempQna.sort((a, b) => b.id! - a.id!));
    fetchPlayingTime();

    setInterval(fetchPlayingTime, 10000);
  }, []); // Empty dependency array ensures this effect runs only once, on the client-side

  const handleLogout = () => {
    // Remove login status from the cookie to log the user out
    removeLoginStatus();
    setIsLoggedIn(false);
  };
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setCurrentPage(1);
  };
  // Function to handle when a table row is clicked
  const handleTableRowClick = (boardId: number) => {
    // Toggle the visibility of the selected board's content
    setSelectedBoardId((prevId) => (prevId === boardId ? null : boardId));
  };

  async function deletePost(id: any) {
    // 여기에 아이템을 삭제하는 로직을 추가
    try {
      const response = await fetch("/api/posts/" + id, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setSelectedBoardId(null);
      alert("게시글이 삭제되었습니다.");
      const res = await fetch(DOMAIN + "/api/posts");
      const posts = await res.json();
      const tempEco = posts.filter((item: any) => item.type === 0);
      setEcoContent(tempEco);
      const tempQna = posts.filter((item: any) => item.type === 1);
      setQnaContent(tempQna);
    } catch (error) {
      console.error("Error while saving the post:", error);
    }
  }

  return (
    <div className="container">
      <Head>
        <title>생태교육 컨텐츠 대시보드</title>
      </Head>
      <header>
        <h1>생태교육 컨텐츠 대시보드</h1>
        <div>
          {isLoggedIn ? (
            <button onClick={handleLogout}>로그아웃</button>
          ) : (
            <Link href="/login">
              <a>로그인</a>
            </Link>
          )}
        </div>
      </header>
      <main>
        <div className="dashboard-container">
          <DashboardCard title="누적 이용자수" valueInSeconds={totalUsers} />
          <DashboardCard
            title="총 이용시간"
            valueInSeconds={totalUsageTime}
            displayAsTime
          />
          <DashboardCard
            title="평균 이용시간"
            valueInSeconds={averageUsageTime}
            displayAsTime
          />
        </div>
        <div className="board-tabs">
          <BoardTab
            title="생태도감"
            active={activeTab === "생태도감"}
            onClick={() => handleTabClick("생태도감")}
          />
          <BoardTab
            title="질문과 답변"
            active={activeTab === "질문과 답변"}
            onClick={() => handleTabClick("질문과 답변")}
          />
          {isLoggedIn && (
            <Link href="/write">
              <a className="writeButton">글쓰기</a>
            </Link>
          )}
        </div>
        {/* Board Contents */}
        {currentContent.length > 0 ? (
          <>
            <table className="board-table">
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>번호</th>
                  <th>제목</th>
                  <th style={{ width: "150px" }}>생성날짜</th>
                  <th style={{ width: "150px" }}>비고</th>
                </tr>
              </thead>
              <tbody>
                {displayedBoardData
                  .filter((item) => item.id !== undefined)
                  .map((item) => {
                    console.log(item.id);
                    const date = new Date(
                      item.created_at ? item.created_at : ""
                    );
                    const formattedDate = `${date.getFullYear()}-${
                      date.getMonth() + 1
                    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

                    return (
                      <React.Fragment key={item.id}>
                        <tr
                          key={item.id}
                          onClick={() =>
                            handleTableRowClick(item.id ? item.id : 1)
                          }
                        >
                          <td>{item.id}</td>
                          <td>{item.title}</td>
                          <td>{formattedDate}</td>
                          <td>
                            {isLoggedIn && (
                              <>
                                <Link href={"/update/" + item.id}>
                                  <a className="updateButton">수정</a>
                                </Link>
                                <a
                                  className="updateButton"
                                  onClick={() => deletePost(item.id)}
                                >
                                  삭제
                                </a>
                              </>
                            )}
                          </td>
                        </tr>
                        {selectedBoardId === item.id && (
                          <tr>
                            <td colSpan={4}>
                              <div>
                                <p>{"제목 : " + item.title}</p>
                                <p
                                  style={{ padding: "0px 100px" }}
                                  dangerouslySetInnerHTML={{
                                    __html: (item?.content || "") as string,
                                  }}
                                ></p>

                                {/* Add more details about the board here */}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
              >
                이전
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={currentPage === pageNumber ? "active" : ""}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                disabled={endIndex >= currentContent.length}
                onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
              >
                다음
              </button>
            </div>
          </>
        ) : (
          <p>게시물이 없습니다.</p>
        )}
      </main>
      <footer></footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(DOMAIN + "/api/posts");
  const posts = await res.json();

  return {
    props: { posts },
  };
};

export default Home;
