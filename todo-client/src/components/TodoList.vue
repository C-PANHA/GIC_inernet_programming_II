<template>
  <ul class="todoLists">
    <template v-if="status == 'completed'">
      <TodoItem
        v-for="todo of completedTasks"
        :key="todo.id"
        icon="uil-adobe-alt"
        :todo="todo"
      />
    </template>
    <template v-else>
      <TodoItem
        v-for="todo of pendingTasks"
        :key="todo.id"
        icon="uil-adobe-alt"
        :todo="todo"
      />
    </template>
  </ul>
</template>
<script>
import { mapState } from "pinia";
import TodoItem from "./TodoItem.vue";
import { useTodoStore } from "../stores/todo";

export default {
  setup() {
    const todoStore = useTodoStore();
    return { todoStore };
  },
  name: "TodoList",
  props: ["status"],
  components: {
    TodoItem,
  },
  data() {
    return {
      color: "red",
    };
  },
  computed: {
    ...mapState(useTodoStore, ["todos", "countTodos"]),
    completedTasks() {
      if (this.todos) {
        return this.todos.filter((todo) => todo.completedAt != null);
      }
      return [];
    },
    pendingTasks() {
      if (this.todos) {
        // if (this.todos.length > 2) {
        //   this.todos.push({ task: "new" });
        // }
        return this.todos.filter((todo) => todo.completedAt == null);
      }
      return [];
    },
  },
};
</script>
