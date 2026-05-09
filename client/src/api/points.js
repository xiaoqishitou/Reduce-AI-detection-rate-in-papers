import request from "./request";

export function getBalance() {
  return request.get("/points/balance");
}

export function getPointLogs(params) {
  return request.get("/points/logs", { params });
}

export function recharge(data) {
  return request.post("/points/recharge", data);
}
