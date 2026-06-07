<template>
  <ul class="todoLists">
    <template v-if="status == 'completed'">
      <TodoItem v-for="todo of completedTasks" :key="todo.id" :todo="todo" />
    </template>
    <template v-else>
      <TodoItem v-for="todo of pendingTasks" :key="todo.id" :todo="todo" />
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
  computed: {
    ...mapState(useTodoStore, ["completedTasks", "pendingTasks"]),
  },
};
</script>
