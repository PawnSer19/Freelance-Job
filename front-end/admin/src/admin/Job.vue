<template>
  <div class="admin-container">
    <h1>Quản lý Công việc</h1>

    <!-- Thanh tìm kiếm -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm công việc"
        @input="searchJobs"
      />
      <button @click="resetSearch">Làm mới</button>
    </div>

    <!-- Bảng danh sách công việc -->
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tiêu đề</th>
          <th>Kỹ năng yêu cầu</th>
          <th>Mức lương</th>
          <th>Hạn nộp</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobs" :key="job.id">
          <td>{{ job.id }}</td>
          <td>{{ job.title }}</td>
          <td>{{ job.required_skills }}</td>
          <td>{{ job.salary_range }}</td>
          <td>{{ formatDate(job.deadline) }}</td>
          <td>
            <button class="delete-btn" @click="deleteJob(job.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Thông báo nếu không có dữ liệu -->
    <p v-if="jobs.length === 0">Không tìm thấy công việc nào</p>

    <!-- Điều hướng phân trang -->
    <div v-if="pagination" class="pagination">
      <button :disabled="pagination.currentPage === 1" @click="changePage(pagination.currentPage - 1)">
        Trang trước
      </button>
      <span>Trang {{ pagination.currentPage }} / {{ pagination.totalPages }}</span>
      <button :disabled="pagination.currentPage === pagination.totalPages" @click="changePage(pagination.currentPage + 1)">
        Trang sau
      </button>
    </div>
  </div>
</template>

<script>
import makeJobService from '../service/jobService';

export default {
  name: "AdminJobs",
  data() {
    return {
      jobs: [],
      searchQuery: "",
      pagination: null,
    };
  },
  methods: {
    async fetchJobs(page = 1, limit = 10) {
      const jobService = makeJobService();
      try {
        const response = await jobService.getAllJobs(page, limit);
        this.jobs = response.jobs || [];
        this.pagination = response.pagination || null;
      } catch (error) {
        console.error("Lỗi khi tải danh sách công việc:", error.message);
        alert("Không thể tải danh sách công việc.");
      }
    },
    async searchJobs() {
      if (!this.searchQuery.trim()) {
        this.fetchJobs();
        return;
      }
      const jobService = makeJobService();
      try {
        const response = await jobService.findJobByTitle(this.searchQuery);
        this.jobs = response.jobs || [];
        this.pagination = null;
      } catch (error) {
        console.error("Lỗi khi tìm kiếm công việc:", error.message);
        alert("Không thể tìm kiếm công việc.");
      }
    },
    resetSearch() {
      this.searchQuery = "";
      this.fetchJobs();
    },
    async deleteJob(id) {
      const jobService = makeJobService();
      if (confirm("Bạn có chắc chắn muốn xóa công việc này không?")) {
        try {
          await jobService.deleteJobById(id);
          this.jobs = this.jobs.filter((job) => job.id !== id);
          alert("Công việc đã được xóa.");
        } catch (error) {
          console.error("Lỗi khi xóa công việc:", error.message);
          alert("Không thể xóa công việc.");
        }
      }
    },
    changePage(page) {
      this.fetchJobs(page);
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
  },
  created() {
    this.fetchJobs();
  },
};
</script>

<style scoped>
@import '../assets/Admin.css';
</style>
