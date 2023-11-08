<template>
  <div class="main_page">
    <div class="header">
      <DArrowLeft
        style="width: 30px; height: 30px; cursor: pointer"
        @click="back">
      </DArrowLeft>
      <Title title="USERINFO"></Title>
    </div>
    <div class="login_form_main">
      <el-form
        ref="FormRef"
        :rules="rules"
        :model="form"
        label-width="100px"
        label-position="left"
        size="large">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              prop="username"
              label="USERNAME">
              <el-input
                v-model="form.username"
                disabled
                placeholder="请输入用户名">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              prop="username"
              label="">
              <el-input
                v-model="form.role"
                disabled
                placeholder="pleas input your">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              prop="mobile"
              label="MOBILE">
              <el-input
                v-model="form.mobile"
                placeholder="please input your mobile">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              prop="realName"
              label="REAL-NAMEs">
              <el-input
                v-model="form.realName"
                placeholder="pleas input your realname">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          prop="identityCode"
          label="ID">
          <el-input
            v-model="form.identityCode"
            placeholder="pleas input your idCard">
          </el-input>
        </el-form-item>

        <el-form-item
          prop="photo"
          label="AVATAR">
          <el-upload
            ref="uploadRef"
            v-model:file-list="form.photo"
            :action="uploadUrl"
            list-type="picture-card"
            :limit="1"
            :on-exceed="onExceed"
            :on-preview="handlePictureCardPreview">
            <el-icon><Plus></Plus></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <div class="footer">
            <el-button @click="back"> BACK </el-button>
            <el-button
              type="primary"
              :loading="btnLoading"
              @click="handelSave">
              保存
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <el-dialog v-model="dialogVisible">
    <img
      class="tw-w-full"
      :src="dialogImageUrl"
      alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import * as apis from '@/apis/index'
  import { onMounted, ref } from 'vue'
  import { DArrowLeft } from '@element-plus/icons-vue'
  import { ElMessage, genFileId } from 'element-plus'
  import Title from '@/components/title/index.vue'
  import { uploadUrl } from '@/apis/index'
  const router = useRouter()
  import { useUserStore } from '@/stores/user'
  const store = useUserStore()
  onMounted(() => {
    getUserInfo()
  })
  const btnLoading = ref(false)
  const FormRef = ref(null)
  // 表单数据
  const form = ref({
    avatarId: '',
    username: '',
    mobile: '',
    identityCode: '',
    realName: '',
    role: '',
    photo: []
  })
  // // 表单校验
  const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: ['change', 'blur'] }],
    mobile: [{ required: true, message: '请输入手机号', trigger: ['change', 'blur'] }],
    identityCode: [
      { required: true, message: 'pleas input your idCode', trigger: ['change', 'blur'] },
      {
        pattern:
          /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
        message: '请输入正确格式的身份证号',
        trigger: 'change'
      }
    ],
    realName: [{ required: true, message: '请输入真实姓名', trigger: ['change', 'blur'] }],
    photo: [{ required: true, message: '请选择个人头像', trigger: ['change', 'blur'] }]
  }
  const roleInfo = ref({})
  const back = () => {
    router.back()
  }
  const getUserInfo = () => {
    apis.getUserInfo().then((res) => {
      if (res.data.code === 0) {
        const { sysRole } = res.data.data
        const userInfo = res.data.data
        userInfo.value = userInfo
        roleInfo.value = sysRole
        form.value.username = userInfo.username
        form.value.mobile = userInfo.mobile
        form.value.identityCode = userInfo.identityCode
        form.value.realName = userInfo.displayName
        form.value.role = sysRole.roleName
        form.value.avatarId = userInfo.avatarId
        form.value.photo = [
          {
            uid: genFileId(),
            name: 'photo',
            status: 'success',
            url: userInfo.avatarUrl,
            avatarId: userInfo.avatarId,
            response: {
              id: userInfo.avatarId,
              url: userInfo.avatarUrl
            }
          }
        ]
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  }
  const onExceed = () => {
    ElMessage.error('只能上传一张照片')
  }
  // 预览
  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)
  const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
  }

  const handelSave = () => {
    FormRef.value.validate((valid) => {
      if (!valid) {
        return
      }
      btnLoading.value = true
      apis
        .setUserInfo({
          ...form.value,
          avatarId: form.value.photo[0].response.id
        })
        .then((res) => {
          if (res.data.code === 0) {
            ElMessage.success('保存成功')
            let userInfo = res.data.data
            store.setUserInfo(userInfo)
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          btnLoading.value = false
        })
    })
  }
</script>

<style lang="scss" scoped>
  .main_page {
    width: 100%;
    height: 100%;
    padding: 20px;

    .header {
      width: 150px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .login_form_main {
      width: 410px;
      margin-top: 20px;
    }
  }
</style>
