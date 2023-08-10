import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import path from "path";

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newFileName =
      file.originalname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function uploadFile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let savedFiles: any = [];

    await new Promise((resolve, reject) =>
      //@ts-ignore
      upload.any()(req, res, function (err: any) {
        if (err) reject(err);
        savedFiles = req.files;
        console.log(savedFiles);
        resolve(null);
      })
    );

    // 첫 번째 파일에 대한 URL을 반환합니다. 여러 파일을 업로드하는 경우에는 반복문을 사용하여 처리할 수 있습니다.
    if (savedFiles.length > 0) {
      const fileUrl = `uploads/${savedFiles[0].filename}`;
      res.status(200).json({ success: true, fileUrl });
    } else {
      res.status(400).json({ success: false, message: "No files uploaded" });
    }
  } else {
    res.status(405).send("Method not allowed");
  }
}
