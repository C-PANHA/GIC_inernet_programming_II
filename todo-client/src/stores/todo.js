import { defineStore } from "pinia";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3100";
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
  }),

  getters: {
    countTodos: (state) => state.todos.length,
  },

  actions: {
    async getOrCreateDefaultUserId() {
      const usersResponse = await api.get("/users");
      const users = usersResponse.data ?? [];

      if (users.length > 0) {
        return users[0].id;
      }

      const token = Date.now();
      const newUserResponse = await api.post("/users", {
        username: `user${token}`,
        email: `user${token}@itc.edu.kh`,
        password: "demo@12",
      });

      return newUserResponse.data.id;
    },

    // 🔹 GET all tasks
    async fetchTodos() {
      try {
        const response = await api.get("/tasks");
        this.todos = response.data;
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    },

    // 🔹 Toggle complete status
    async toggleStatus(id) {
      const todo = this.todos.find((t) => t.id == id);
      if (!todo) return;

      const updatedData = {
        completedAt:
          todo.completedAt != null ? null : new Date().toISOString(),
      };

      try {
        await api.patch(`/tasks/${id}`, updatedData);

        // refresh data after update
        await this.fetchTodos();
      } catch (error) {
        console.error("Failed to update todo:", error);
      }
    },

    // 🔹 Add new task
    async addTodo(todoName) {
      try {
        const userId = await this.getOrCreateDefaultUserId();

        await api.post("/tasks", {
          name: todoName,
          description: "description",
          userId,
        });

        await this.fetchTodos();
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    },

    // 🔹 Delete task
    async deleteTodo(id) {
      try {
        await api.delete(`/tasks/${id}`);

        this.todos = this.todos.filter((t) => t.id !== id);
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    },

    // 🔹 Clear all (optional)
    async clearAll() {
      for (const todo of this.todos) {
        await api.delete(`/tasks/${todo.id}`);
      }
      this.todos = [];
    },
  },
});