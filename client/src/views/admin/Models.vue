<template>
  <div>
    <el-card>
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>模型配置</span>
          <el-button type="primary" @click="openAdd">添加模型</el-button>
        </div>
      </template>
      <el-table :data="models" v-loading="loading" stripe>
        <el-table-column prop="name" label="名称" width="150" />
        <el-table-column prop="baseURL" label="API地址" width="300" />
        <el-table-column prop="modelName" label="模型" width="150" />
        <el-table-column prop="temperature" label="温度" width="80" />
        <el-table-column prop="isDefault" label="默认" width="80">
          <template #default="{ row }"><el-tag :type="row.isDefault ? 'success' : 'info'">{{ row.isDefault ? '是' : '否' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="enabled" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.enabled ? 'success' : 'danger'">{{ row.enabled ? '启用' : '禁用' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="openEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑模型' : '添加模型'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="名称"><el-input v-model="form.name" placeholder="如：小米MiMo" /></el-form-item>
        <el-form-item label="API地址"><el-input v-model="form.baseURL" placeholder="https://token-plan-cn.xiaomimimo.com/v1" /></el-form-item>
        <el-form-item label="API Key"><el-input v-model="form.apiKey" placeholder="sk-xxx" show-password /></el-form-item>
        <el-form-item label="模型名称"><el-input v-model="form.modelName" placeholder="mimo-v2.5-pro" /></el-form-item>
        <el-form-item label="温度"><el-slider v-model="form.temperature" :min="0" :max="2" :step="0.05" /></el-form-item>
        <el-form-item label="最大Token"><el-input-number v-model="form.maxTokens" :min="100" :max="128000" :step="100" /></el-form-item>
        <el-form-item label="设为默认"><el-switch v-model="form.isDefault" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="form.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveModel">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getModels, createModel, updateModel, deleteModel } from "../../api/admin";
import { ElMessage, ElMessageBox } from "element-plus";

const models = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editId = ref(null);
const saving = ref(false);
const form = ref({ name: "", baseURL: "", apiKey: "", modelName: "", temperature: 0.85, maxTokens: 4096, isDefault: false, enabled: true });

onMounted(() => { fetchModels(); });

async function fetchModels() {
  loading.value = true;
  try {
    const res = await getModels();
    models.value = res.data;
  } catch (e) {}
  finally { loading.value = false; }
}

function openAdd() {
  isEdit.value = false;
  editId.value = null;
  form.value = { name: "", baseURL: "", apiKey: "", modelName: "", temperature: 0.85, maxTokens: 4096, isDefault: false, enabled: true };
  dialogVisible.value = true;
}

function openEdit(model) {
  isEdit.value = true;
  editId.value = model._id;
  form.value = { name: model.name, baseURL: model.baseURL, apiKey: model.apiKey, modelName: model.modelName, temperature: model.temperature, maxTokens: model.maxTokens, isDefault: model.isDefault, enabled: model.enabled };
  dialogVisible.value = true;
}

async function saveModel() {
  saving.value = true;
  try {
    if (isEdit.value) {
      await updateModel(editId.value, form.value);
    } else {
      await createModel(form.value);
    }
    ElMessage.success("保存成功");
    dialogVisible.value = false;
    fetchModels();
  } catch (e) {}
  finally { saving.value = false; }
}

async function handleDelete(model) {
  await ElMessageBox.confirm("确定要删除该模型配置吗？", "提示", { type: "warning" });
  try {
    await deleteModel(model._id);
    ElMessage.success("删除成功");
    fetchModels();
  } catch (e) {}
}
</script>