import "./assets/main.css";

import { createApp, h, provide } from "vue";
import { createPinia } from "pinia";
import { DefaultApolloClient } from "@vue/apollo-composable";

import App from "./App.vue";
import { apolloClient } from "./apollo/client";
const store = createPinia();
const app = createApp({
	setup() {
		provide(DefaultApolloClient, apolloClient);
	},
	render: () => h(App),
});
app.use(store);

app.mount("#app");
