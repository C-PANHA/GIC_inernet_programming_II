<template>
  <div class="container">
    <AddTodo @added="handleAddTodo" />
    <p v-if="store.loading" class="status-msg">Loading todos...</p>
    <p v-if="store.error" class="status-msg error">{{ store.error }}</p>

    <h3>Pending Tasks:</h3>
    <TodoLists status="pending" />

    <h3>Completed Tasks:</h3>
    <TodoLists status="completed" />
    <div class="pending-tasks">
      <span
        >You have <span class="pending-num"> {{ nbOfTodo }} </span> tasks
        pending.</span
      >
      <button class="clear-button" :disabled="!store.todos.length" @click="clearAllTodos">
        Clear All
      </button>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { onBeforeUnmount, onMounted } from "vue";
import AddTodo from "./components/AddTodo.vue";
import TodoLists from "./components/TodoList.vue";

import { useTodoStore } from "./stores/todo";
export default {
  name: "App",
  setup() {
    const store = useTodoStore();

    let stopRealtime = null;
    onMounted(async () => {
      await store.fetchTodos();
      stopRealtime = store.startRealtime();
    });

    onBeforeUnmount(() => {
      if (stopRealtime) {
        stopRealtime();
      }
    });

    return {
      store,
    };
  },
  components: {
    AddTodo,
    TodoLists,
  },
  computed: {
    ...mapState(useTodoStore, {
      nbOfTodo: "countTodos",
    }),
  },
  methods: {
    async handleAddTodo(todo) {
      await this.store.addTodo(todo);
    },
    async clearAllTodos() {
      await this.store.clearAll();
    },
  },
};
</script>
<style>
@import "https://unicons.iconscout.com/release/v4.0.0/css/line.css";

.status-msg {
  margin: 12px 0;
  color: #334155;
}

.status-msg.error {
  color: #dc2626;
}
</style>
