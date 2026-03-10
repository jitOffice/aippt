import req from "@/utils/req"

// 保存文档内容
const saveDocApi = (docData: any) => {
  return req.post("/mock/doc", docData)
}

// 获取文档
const getDocApi = () => {
  return req.get("/mock/doc")
}

// AI文本创作
const ai2Text = (text: string) =>
  req.get("/ai/tyqw/free", {
    params: { text, type: "text" },
  })

// 上传文件
const uploadApi = (file: any) => req.post(`/upload/free`, file)

// 上传docx文档
const uploadDoc = (data: any) => req.post("/parse/doc2html2", data)

// 获取docx文档
const getDoc = (docId: string, page: number) => req.get(`/parse/doc2html2/${docId}/${page}`)

// 上传并解析pdf文件
const uploadPdf = (data: any) => req.post("/parse/pdf2html", data)

// 获取pdf文件内容
const getPdf = (fid: string, page: number) => req.get(`/parse/pdf2html/${page}?fid=${fid}`)

// 获取思维导图数据
const getMind = (id?: string) => {
  return req.get("/mock/mind")
}

// 保存思维导图数据
const saveMind = (id: string, data: any) => {
  return req.post("/mock/mind", data)
}

// 获取白板数据
const getBoard = (id?: string) => {
  return req.get("/mock/board")
}

// 获取白板数据
const saveBoard = (id: string, data: any) => {
  return req.post("/mock/board", data)
}

export {
  saveDocApi,
  getDocApi,
  ai2Text,
  uploadDoc,
  getDoc,
  uploadPdf,
  getPdf,
  uploadApi,
  getMind,
  saveMind,
  getBoard,
  saveBoard
}

