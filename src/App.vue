<template>
	<div id="app">
		<canvas id="canvas" v-bind:width="canvasWidth" v-bind:height="canvasHeight"></canvas>
		<div id="heart-block">
			<div id="heart-counter" class="text-center">
				<img class="heartImg noSelect" src="@/assets/heart.svg" v-on:click=increaseCounter width="150" height="150" draggable="false"/>
				<p class="heartCount lead text-center noSelect" style="word-wrap: break-word; max-width: 100px; width: 100px" v-on:click=increaseCounter><strong><span v-if="totalCount === 0"></span><span v-else>{{totalCount}}</span></strong></p>
			</div>
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

	#heart-counter {
		position: relative;
	}

	.heartCount {
		position: absolute;
	}

	.heartCount{
		/* TODO: Remove hard coded magic numbers */
		top: 55px;
		left: 24px;
	}

	/* https://jsfiddle.net/dcwn63a2/3/ */
	/* TODO: When heartCount clicked, give heartImg shadow */
	.heartCount:active + .heartImg {
		-webkit-filter: drop-shadow(2px 2px 2px #222222);
		filter: drop-shadow(2px 2px 2px #853322);
	}

	.heartImg:active{
		-webkit-filter: drop-shadow(2px 2px 2px #222222);
		filter: drop-shadow(2px 2px 2px #853322);
	}

	/* https://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting */
	.noSelect {
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
	}

</style>
