<template>
	<div id="app">
		<canvas id="canvas" v-bind:width="canvasWidth" v-bind:height="canvasHeight"></canvas>
		<div id="heart-block">
			<img src="@/assets/heart.svg" v-on:click=increaseCounter width="150" height="150"/>
			<br>
			<p class="lead text-center" style="zindex: -1; word-wrap: break-word; max-width: 120px"><strong>Worldwide Love Counter <br><span v-if="totalCount === 0"></span><span v-else>{{totalCount}}</span></strong></p>
		</div>
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
		canvasHeight: 0,
		canvasWidth: 0,
		}
	},
	components: {
	},
	methods: {
		increaseCounter() {
			this.count = this.count + 1
			this.totalCount = this.totalCount + 1
			this.drawHearts();
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
			this.drawHearts();
		},
		resizeCanvas() {
			this.canvasHeight = window.innerHeight;
			this.canvasWidth = window.innerWidth;
			this.$nextTick(() => {
				this.drawHearts();
			})
		},
		getRandom(multiplier) {
			return Math.floor(Math.random() * multiplier)
		},
		drawHearts() {
			console.log("draw hearts now!")
			var canvas = document.getElementById("canvas");
			var context = canvas.getContext("2d");
			context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			var id = context.getImageData(0, 0, this.canvasWidth, this.canvasHeight)
			var pixels = id.data;

			for (var i = 0; i < this.totalCount; i++) {
				var x = this.getRandom(this.canvasWidth);
				var y = this.getRandom(this.canvasHeight);
				var r = this.getRandom(256);
				var g = this.getRandom(256);
				var b = this.getRandom(256);
				var offset = (y * id.width + x) * 4;
				pixels[offset] = r;
				pixels[offset + 1] = g;
				pixels[offset + 2] = b;
				pixels[offset + 3] = 255;
			}

			context.putImageData(id, 0, 0);

		},
		debouncedUpdate: debounce(function() {
			this.submitCounter()
		}, waitTime)
	},
	mounted() {
		window.addEventListener("resize", this.resizeCanvas)
		this.resizeCanvas();
	},
	beforeCreate: async function() {
		await firebase.auth().signInAnonymously().then(() => {
			this.getTotalCount();
		});
	},
	beforeDestroy: function (){
		window.removeEventListener("resize", this.resizeCanvas);
	}
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
		position: relative;
		height: 100vh;
	}

	#canvas, #heart-block {
		position: absolute;
	}

	#heart-block {
		height: 100vh;
		width: 100vw;
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
