import request from "./request";

export function getUsers(params) {
  return request.get("/admin/users", { params });
}

export function updateUser(id, data) {
  return request.put("/admin/users/" + id, data);
}

export function deleteUser(id) {
  return request.delete("/admin/users/" + id);
}

export function toggleBan(id) {
  return request.put("/admin/users/" + id + "/ban");
}

export function getStats() {
  return request.get("/admin/stats");
}

export function getRecords(params) {
  return request.get("/admin/records", { params });
}

export function deleteRecord(id) {
  return request.delete("/admin/records/" + id);
}

export function getModels() {
  return request.get("/admin/models");
}

export function createModel(data) {
  return request.post("/admin/models", data);
}

export function updateModel(id, data) {
  return request.put("/admin/models/" + id, data);
}

export function deleteModel(id) {
  return request.delete("/admin/models/" + id);
}