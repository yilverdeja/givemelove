<template>
	<div id="app">
		<img src="@/assets/heart.svg" v-on:click=increaseCounter width="150" height="150"/>
		<br>
		<p class="lead text-center" style="zindex: -1; word-wrap: break-word; max-width: 120px"><strong>Worldwide Love Counter <br><span v-if="totalCount === 0"></span><span v-else>{{totalCount}}</span></strong></p>
	</div>
</template>

<script>
import { firebase, db } from "@/firebase";
import { debounce } from "debounce";

const documentPath = "counter/counter"
const counterRef = db.doc(documentPath);
const waitTime = 1000;

export default {
	name: 'App',
	data() {
		return {
		count: 0,
		totalCount: 0,
		}
	},
	components: {
	},
	methods: {
		increaseCounter() {
			this.count = this.count + 1
			this.totalCount = this.totalCount + 1
			this.debouncedUpdate();
		},
		submitCounter() {
			const increment = firebase.firestore.FieldValue.increment(this.count)
			counterRef.update({ count: increment })
			this.count = 0
		},
		async getTotalCount() {
			let data = (await counterRef.get()).data();
			this.totalCount = data.count;
		},
		debouncedUpdate: debounce(function() {
			this.submitCounter()
		}, waitTime)
	},
	beforeCreate: async function() {
		await firebase.auth().signInAnonymously().then(() => {
			this.getTotalCount();
		});
	},
	// beforeDestroy() {
	// 	var user = firebase.auth().currentUser;
	// 	user.delete().then(() => {
	// 		console.log("anon user deleted")
	// 	}).catch(err => {
	// 		console.log(err)
	// 	})
	// }
}
</script>

<style>
	body {
		background-color: #fad1cf;
	}
	#app {
		background-color: #fad1cf;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	img:active {
		-webkit-filter: drop-shadow(2px 2px 2px #222222);
		filter: drop-shadow(2px 2px 2px #853322);
	}

</style>
