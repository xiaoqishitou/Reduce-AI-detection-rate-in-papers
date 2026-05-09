import request from "./request";

export function rewritePaper(data) {
  return request.post("/paper/rewrite", data);
}

export function getHistory(params) {
  return request.get("/paper/history", { params });
}

export function getHistoryDetail(id) {
  return request.get("/paper/history/" + id);
}

export function deleteHistory(id) {
  return request.delete("/paper/history/" + id);
}
