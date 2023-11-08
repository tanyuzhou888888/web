import { get, put, remove } from './config'
/**
 *
 * 课程分页查询
 * @param {*} data
 * @returns
 */
export const userCourseList = (data) =>
  get(`/course-consumer-course-api/api/v1/consumer/course/list`, data)

/**
 * 选课
 * @param {*} data
 * @returns
 */
export const chooseCourse = (data) =>
  put(`/course-consumer-order-api/api/v1/consumer/order/choose`, data)

/**
 * 我的课程
 * @param {*} data
 * @returns
 */
export const myCourseOrderList = (data) =>
  get(`/course-consumer-order-api/api/v1/consumer/order/list`, data)

export const courseDetail = (courseId) =>
  get(`/course-consumer-course-api/api/v1/consumer/course/detail/${courseId}`)
/**
 * 订单详情
 * @param {*} data
 * @returns
 */
export const orderDetail = (orderId) =>
  get(`/course-consumer-order-api/api/v1/order/detail/${orderId}`)
/**
 * 所有订单
 * @param {*} data
 * @returns
 */
export const teacherOrderList = (data) => get(`/course-consumer-order-api/api/v1/order/list`, data)

/**
 * 删除课程
 * @param {*} data
 * @returns
 */
export const deleteCourse = (courseId) =>
  remove(`/course-admin-api/api/v1/admin/course/delete/${courseId}`)
/**
 * 删除订单
 * @param {*} data
 * @returns
 */
export const deleteOrder = (courseId) =>
  remove(`/course-admin-api/api/v1/admin/order/delete/${courseId}`)
