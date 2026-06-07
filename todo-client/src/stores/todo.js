import { defineStore } from "pinia";
import { apolloClient } from "@/apollo/client";
import { GET_TODOS, ADD_TODO, TOGGLE_TODO, DELETE_TODO, TODOS_SUB } from "@/graphql/todos";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
    loading: false,
    error: null,
  }),

  getters: {
    countTodos: (state) => state.todos.filter((todo) => !todo.is_done).length,
    completedTasks: (state) => state.todos.filter((todo) => todo.is_done),
    pendingTasks: (state) => state.todos.filter((todo) => !todo.is_done),
  },

  actions: {
    async fetchTodos() {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await apolloClient.query({
          query: GET_TODOS,
          fetchPolicy: "network-only",
        });

        this.todos = data?.todos ?? [];
      } catch (e) {
        this.error = e?.message ?? "Failed to load todos";
      } finally {
        this.loading = false;
      }
    },

    async addTodo(title) {
      const cleanTitle = title?.trim();
      if (!cleanTitle) {
        return;
      }

      this.error = null;

      try {
        await apolloClient.mutate({
          mutation: ADD_TODO,
          variables: { title: cleanTitle },
        });

        await this.fetchTodos();
      } catch (e) {
        this.error = e?.message ?? "Failed to add todo";
      }
    },

    async toggleTodo(todo) {
      this.error = null;

      try {
        await apolloClient.mutate({
          mutation: TOGGLE_TODO,
          variables: { id: todo.id, done: !todo.is_done },
        });

        await this.fetchTodos();
      } catch (e) {
        this.error = e?.message ?? "Failed to update todo";
      }
    },

    async deleteTodo(id) {
      this.error = null;

      try {
        await apolloClient.mutate({
          mutation: DELETE_TODO,
          variables: { id },
        });

        await this.fetchTodos();
      } catch (e) {
        this.error = e?.message ?? "Failed to delete todo";
      }
    },

    async clearAll() {
      const ids = this.todos.map((todo) => todo.id);

      for (const id of ids) {
        await this.deleteTodo(id);
      }
    },

    startRealtime() {
      const obs = apolloClient.subscribe({
        query: TODOS_SUB,
      });

      const sub = obs.subscribe({
        next: ({ data }) => {
          if (data?.todos) {
            this.todos = data.todos;
          }
        },
        error: (e) => {
          console.error("Subscription error", e);
        },
      });

      return () => sub.unsubscribe();
    },
  },
});
