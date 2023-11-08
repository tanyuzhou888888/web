import { adminCourseLis } from '@/apis';
<template>
  <div
    ref="mainRef"
    class="tw-w-full tw-h-full tw-p-[20px]">
    <div ref="headerRef">
      <el-title title="COURSE-MANAGE"></el-title>
      <div class="tw-w-full tw-mt-[10px]">
        <el-form :model="formData">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="COURSE_NAME">
                <el-input
                  v-model="formData.keyword"
                  style="width: 100%">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6"> </el-col>
            <el-col :span="8"></el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                s
                @click="onSearch">
                查询
              </el-button>
              <el-button
                type="primary"
                @click="onAdd">
                新增
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <el-table
      style="width: 100%; margin-top: 8px"
      :height="mainHeight - headerHeight - 40"
      :data="tableData"
      row-class-name="my-el-table-stripe-row-name"
      header-cell-class-name="my-el-table-header-cell-name"
      stripe>
      <el-table-column
        prop="id"
        :index="id"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="courseName"
        label="课程名称">
      </el-table-column>
      <el-table-column
        prop="priceType"
        label="价格类型">
        <template #default="{ row }">
          {{ row.priceType === 1 ? '付费' : '免费' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格">
      </el-table-column>
      <el-table-column
        prop="identityCode"
        label="状态">
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            class="tw-px-[5px]"
            text
            @click="edit(row)">
            DETAIL
          </el-button>
          <el-button
            class="tw-px-[5px]"
            text
            type="danger"
            @click="deleteCourse1(row)">
            DELTE
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-pagination
        v-model:currentPage="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 40, 60]"
        large
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onCurrentChange">
      </el-pagination>
    </div>
    <el-dialog
      v-model="isShow"
      title="Tips"
      width="30%"
      :before-close="handleClose">
      <el-form
        ref="FormRef"
        :model="courseForm"
        label-width="120px">
        <el-form-item
          prop="courseName"
          label="COURSE-NAME">
          <el-input v-model="courseForm.courseName"></el-input>
        </el-form-item>
        <el-form-item
          prop="priceType"
          label="PRICE-TYPE">
          <el-radio-group v-model="courseForm.priceType">
            <el-radio label="FREE"></el-radio>
            <el-radio label="UNFREE"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="price"
          label="PRICE">
          <el-input v-model="courseForm.price"></el-input>
        </el-form-item>
        <el-form-item
          prop="photo"
          label="FILE">
          <el-upload
            ref="uploadRef"
            v-model:file-list="courseForm.fileInfos"
            :action="uploadUrl"
            list-type="picture-card"
            :on-exceed="onExceed">
            <el-icon><Plus></Plus></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShow = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="modifyComfirm()">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import elTitle from '@/components/title/index.vue'
  import * as apis from '@/apis/index.js'
  import { uploadUrl, adminCourseCreate, adminUpdateCourse } from '@/apis/index.js'
  import { courseDetail, deleteCourse } from '@/apis/user.js'
  import { onMounted, reactive, ref } from 'vue'
  import { useElementSize } from '@vueuse/core'
  import { usePagination } from '@/utils/hooks.js'
  import { ElMessage } from 'element-plus'
  const { pagination } = usePagination()
  const tableData = ref([])
  const courseForm = reactive({
    id: '',
    courseName: '',
    price: 0.0,
    priceType: '',
    fileIds: [],
    fileInfos: []
  })
  const FormRef = ref(null)
  const formData = reactive({
    keyword: '',
    roleId: ''
  })

  const mainRef = ref(null)
  const headerRef = ref(null)
  const { height: mainHeight } = useElementSize(mainRef)
  const { height: headerHeight } = useElementSize(headerRef)
  onMounted(() => {
    onSearch()
  })

  // dialog开关
  const isShow = ref(false)
  // 页面大小发生变化
  const onSizeChange = () => {
    onSearch()
  }
  // 当前页发生变化
  const onCurrentChange = () => {
    onSearch()
  }

  const deleteCourse1 = (row) => {
    deleteCourse(row.id)
      .then((res) => {
        if (res.data.code === 0) {
          ElMessage.success('发布成功')
          isShow.value = false
        } else {
          ElMessage.error(res.data.msg)
        }
      })
      .catch((err) => {
        console.log(err)
        ElMessage.error(err)
      })
      .finally(() => {
        onSearch()
      })
  }

  const onSearch = () => {
    apis
      .adminCourseLis({
        ...pagination,
        keyword: formData.keyword.trim(),
        roleId: formData.roleId
      })
      .then((res) => {
        if (res.data.code === 0) {
          const { records } = res.data.data
          tableData.value = records
        }
      })
      .catch((err) => console.log(err))
  }

  const edit = (row) => {
    courseDetail(row.id).then((res) => {
      let fileInfos = res.data.fileInfos
      courseForm.fileInfos = fileInfos.map((item) => {
        return {
          uid: item.id,
          status: 'success',
          url: item.url,
          response: {
            id: item.id,
            url: item.url
          }
        }
      })
    })
    courseForm.id = row.id
    courseForm.courseName = row.courseName
    courseForm.priceType = row.priceType === 0 ? '免费' : '付费'
    courseForm.price = row.price
    isShow.value = true
  }

  const modifyComfirm = () => {
    FormRef.value.validate((valid) => {
      if (!valid) {
        return
      }
      if (courseForm.id === '') {
        adminCourseCreate({
          priceType: courseForm.priceType === '免费' ? 0 : 1,
          courseName: courseForm.courseName,
          price: courseForm.price,
          fileIds: courseForm.fileInfos.map((fileInfo) => fileInfo.response.id)
        })
          .then((res) => {
            if (res.data.code === 0) {
              ElMessage.success('发布成功')
              isShow.value = false
            } else {
              ElMessage.error(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err)
            ElMessage.error(err)
          })
          .finally(() => {
            isShow.value = false
            onSearch()
          })
      } else {
        adminUpdateCourse({
          id: courseForm.id,
          courseName: courseForm.courseName,
          price: courseForm.price,
          printType: courseForm.priceType,
          fileIds: courseForm.fileInfos.map((fileInfo) => fileInfo.response.id)
        })
          .then((res) => {
            if (res.data.code === 0) {
              ElMessage.success('修改成功')
              isShow.value = false
            } else {
              ElMessage.error(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err)
            ElMessage.error(err)
          })
          .finally(() => {
            isShow.value = false
            onSearch()
          })
      }
    })
  }
  const onAdd = () => {
    isShow.value = true
  }
</script>

<style lang="scss" scoped>
  .footer {
    display: flex;
    width: 100%;
    margin-top: 16px;
  }
</style>
