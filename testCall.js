const fetch = require("node-fetch");

// 랜덤한 문자열 생성 함수
function randomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function postPlayingTime() {
  const url = "http://localhost:3000/api/playingtime";

  const randomUserLength = Math.floor(Math.random() * 10); // 0-9 길이의 문자열
  const body = {
    user: randomString(randomUserLength),
    playingTime: Math.floor(Math.random() * 10000), // 0-9999 사이의 랜덤한 숫자
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("There was an error sending the POST request:", error);
  }
}

postPlayingTime();
