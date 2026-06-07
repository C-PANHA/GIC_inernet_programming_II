<template>
  <li class="list pending" @click="toggleTodo(todo)">
    <input type="checkbox" :checked="todo.is_done" />
    <span class="task">{{ todo.title }}</span>
    <i class="uil uil-trash-alt" @click.stop="deleteTodo(todo.id)"></i>
  </li>
</template>
<script>
import { useTodoStore } from "../stores/todo";
export default {
  setup() {
    const todoStore = useTodoStore();
    return { todoStore };
  },
  props: ["todo"],
  methods: {
    async toggleTodo(todo) {
      await this.todoStore.toggleTodo(todo);
    },
    async deleteTodo(id) {
      await this.todoStore.deleteTodo(id);
    },
  },
};
</script>
