<template>
	<div id="app">
		<canvas id="canvas" v-bind:width="canvasWidth" v-bind:height="canvasHeight"></canvas>
		<div id="heart-block">
			<div id="heart-counter" class="text-center" v-if="dataRetrieved">
				<p class="heartCount lead text-center noSelect disable-dbl-tap-zoom" style="z-index: 1; word-wrap: break-word; max-width: 100px; width: 100px" v-on:click=increaseCounter><strong>{{ getTotalCountString }}</strong></p>
				<img class="heartImg noSelect disable-dbl-tap-zoom" src="@/assets/heart.svg" v-on:click=increaseCounter width="150" height="150" draggable="false"/>
			</div>
		</div>
		<div id="nav-header" style="margin: 10px 0px; padding: 0px 20px" v-if="dataRetrieved">
			<div class="container">
				<div class="row">
					<div class="col-8">
					</div>
					<div class="col-2"></div>
					<div class="col-1 text-center">
						<b-button @click=swapMode id="b-mode" size="sm" :variant=modeType class="mb-2" style="background-color: rgb(255, 255, 255, 0); border-color: white" pill>
							<b-icon id="b-icon" :icon=modeIcon></b-icon>
						</b-button>
					</div>
					<div class="col-1 text-center">
						<b-button @click=openUserScreen size="sm" id="b-user" :variant=modeType class="mb-2" style="background-color: rgb(255, 255, 255, 0); border-color: white" pill>
							<b-icon id="b-icon" icon="person"></b-icon>
						</b-button>
					</div>
				</div>
			</div>
		</div>
		<div id="footer" v-if="dataRetrieved">
			<div class="container-fluid">
				<div class="row">
					<div class="footer-col col-12 col-sm-6 order-3 order-sm-1">
						<p class="small">givemelove © <span>{{ copyrightYear }}</span>, Designed by <a href="https://yve.life" target="_blank">yve.</a></p>
					</div>
					<div class="footer-col col-12 col-sm-6 order-2">
						<p class="lead">Updated {{ getLastUpdated }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { firebase, db } from "@/firebase";
import { debounce } from "debounce";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const documentPath = "counter/counter"
const counterRef = db.doc(documentPath);
const waitTime = 1000;

export default {
	name: 'App',
	components: {
	},
	data() {
		return {
			count: 0,
			totalCount: 0,
			lastUpdated: null,
			dataRetrieved: false,
			canvasHeight: 0,
			canvasWidth: 0,
			modeIcon: "moon",
            modeType: "light",
		}
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
			const timestamp = firebase.firestore.Timestamp.fromDate(new Date());
			counterRef.update({ count: increment, lastUpdated:  timestamp})
			this.count = 0
			this.lastUpdated = Date.now();
		},
		async getData() {
			let data = (await counterRef.get()).data();
			this.totalCount = data.count;
			this.lastUpdated = data.lastUpdated.toDate().getTime();
			this.dataRetrieved = true;
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
		getLengthOfNum(num) {
			return num.toString().length;
		},
		swapMode(){
            if (this.modeIcon === "moon"){
                this.modeIcon = "sun";
                this.modeType = "dark";
            } else {
                this.modeIcon = "moon";
                this.modeType = "light";
			}
			document.body.classList.toggle("dark-theme")
			this.drawHearts();
        },
		openUserScreen() {
			// open on the right side of screen for computers (md) and push content to the left
			// open overlayed on the screen for tablets and phones (sm, xs)
			// use vue-screen: https://www.npmjs.com/package/vue-screen
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
			this.getData();
		});
	},
	beforeDestroy: function (){
		window.removeEventListener("resize", this.resizeCanvas);
	},
	computed: {
		getTotalCountString: function() {
			var shortenDict = {4: "k", 7: "M", 10: "B", 13: "T",}
			for (var key in shortenDict) {
				var len = this.lengthOfCount;
				var num = parseInt(key, 10);
				if (len >= num && len < num+3) {
					return (this.totalCount / (Math.pow(10, num-1))).toFixed(3) + shortenDict[key]
				}
			}
			return this.totalCount + ""
		},
		lengthOfCount: function() {
			return this.totalCount.toString().length; 
		},
		getLastUpdated: function () {
			var timeDiff = Date.now() - this.lastUpdated;
			return timeAgo.format(Date.now() - timeDiff, "round")
		},
		copyrightYear: function() {
			return new Date().getFullYear();
		}
	}
}
</script>

<style>
	body {
		background-color: #fad1cf;
	}

	body a {
		color: black;
	}

	#app {
		background-color: #fad1cf;
		position: relative;
		height: 100vh;
	}

	#canvas, #heart-block, #lastUpdated {
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

	#textBlock {
		text-align: right;
		margin-right: 15px;
	}

	#footer {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100vw;
		padding: 0 10px;
	}

	#nav-header {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
	}

	.footer-col {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.dateText {
		margin: 20px;
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
	.heartCount:active ~ .heartImg {
		-webkit-filter: drop-shadow(2px 2px 2px #853322);
		filter: drop-shadow(2px 2px 2px #853322);
	}

	.heartImg:active{
		-webkit-filter: drop-shadow(2px 2px 2px #853322);
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

	/* https://stackoverflow.com/questions/10614481/disable-double-tap-zoom-option-in-browser-on-touch-devices */
	.disable-dbl-tap-zoom {
		touch-action: manipulation;
	}

	#b-mode:focus {
        outline: none;
        box-shadow: none;
    }

	/* dark theme */
	/* https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/ */
	body.dark-theme p {
		color: white;
	}

	body.dark-theme a {
		color: white;
	}

	body.dark-theme #app {
		background-color: black;
	}

</style>
