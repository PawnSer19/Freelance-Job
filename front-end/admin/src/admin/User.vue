<template>
  <div class="admin-container">
    <h1>Quản lý Người dùng</h1>

    <!-- Thanh tìm kiếm -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm người dùng"
        @input="searchUsers"
      />
      <button @click="resetSearch">Làm mới</button>
    </div>

    <!-- Bảng danh sách người dùng -->
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Email</th>
          <th>Thành phố</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.city }}</td>
          <td>
            <button class="delete-btn" @click="deleteUser(user.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Thông báo nếu không có dữ liệu -->
    <p v-if="users.length === 0">Không tìm thấy người dùng nào</p>

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
import makeUserService from '../service/userService';

export default {
  name: "AdminAccount",
  data() {
    return {
      users: [],
      searchQuery: "",
      pagination: null,
    };
  },
  methods: {
    async fetchUsers(page = 1, limit = 10) {
      const userService = makeUserService();
      try {
        const response = await userService.getAllUsers(page, limit);
        this.users = response.users || [];
        this.pagination = response.pagination || null;
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error.message);
        alert("Không thể tải danh sách người dùng.");
      }
    },
    async searchUsers() {
      if (!this.searchQuery.trim()) {
        this.fetchUsers();
        return;
      }
      const userService = makeUserService();
      try {
        const response = await userService.findUserByName(this.searchQuery);
        this.users = response.users || [];
        this.pagination = null;
      } catch (error) {
        console.error("Lỗi khi tìm kiếm người dùng:", error.message);
        alert("Không thể tìm kiếm người dùng.");
      }
    },
    resetSearch() {
      this.searchQuery = "";
      this.fetchUsers();
    },
    async deleteUser(id) {
      const userService = makeUserService();
      if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
        try {
          await userService.deleteUserById(id);
          this.users = this.users.filter((user) => user.id !== id);
          alert("Người dùng đã được xóa.");
        } catch (error) {
          console.error("Lỗi khi xóa người dùng:", error.message);
          alert("Không thể xóa người dùng.");
        }
      }
    },
    changePage(page) {
      this.fetchUsers(page);
    },
  },
  created() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
@import '../assets/Admin.css';
</style>
