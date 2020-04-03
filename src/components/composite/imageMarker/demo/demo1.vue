<template>
	<div>
		<div style="margin-bottom:20px;">
			<np-button color="primary" @click="setImage">开始</np-button>
			<np-button color="primary" @click="resize">变更尺寸</np-button>
			<np-button :color="currentType=='LINE'?'success':'white'" @click="changeType('LINE')">直线</np-button>
			<np-button :color="currentType=='ARROWS'?'success':'white'" @click="changeType('ARROWS')">箭头</np-button>
			<np-button :color="currentType=='RECT'?'success':'white'" @click="changeType('RECT')">矩形</np-button>
			<np-button :color="currentType=='ELLIPSE'?'success':'white'" @click="changeType('ELLIPSE')">椭圆</np-button>
			<np-button :color="currentType=='ELLIPSE'?'success':'white'" @click="changeType('FONT')">文字</np-button>
			<np-button color="danger" @click="changeColor('red')">红</np-button>
			<np-button color="warning" @click="changeColor('yellow')">黄</np-button>
			<np-button color="primary" @click="changeColor('blue')">蓝</np-button>
			<np-button color="white" @click="backspace()">撤销</np-button>
			<np-button color="white" @click="recover()">恢复</np-button>
			<np-button color="white" @click="getMarks()">获取</np-button>
			<np-button color="white" @click="setMarks()">添加</np-button>
			<np-button color="white" @click="clearMarks()">清除</np-button>
			<np-button color="primary" @click="createSnapshoot()">生成快照</np-button>
		</div>
		<div style="border:1px solid #09c;">
			<np-image-marker ref="marker" :width="350" :height="200" @inited="setMarks" @mark-font="onMarkFont"></np-image-marker>
		</div>
		<img ref="sss" src="" alt="">
		<div class="text-input" v-show="inputShow" :style="inputTextPos">
			<input type="text" autofocus="true" v-model="inputVal" />
			<button @click="makeFont">确定</button>
		</div>
		<div ref="test" style="width:400px;height:300px;border:1px solid #ddd;margin:10px;">
			<svg id="svg_my" style="width:100%;height:100%;" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path ref="path" stroke="black" fill="green" stroke-width="2" fill-opacity="0" />
			</svg>
		</div>
	</div>
</template>

<script>
export default {
	methods: {
		resize() {
			this.width = 500;
			this.$nextTick(() => {
				this.$refs.marker.resize();
			});
		},
		setImage() {
			var url1 = "/co160520093010-6.jpg";
			//"http://android.tgbus.com/bizhi/UploadFiles_7790/201204/20120423124456526.jpg";//"http://img.taopic.com/uploads/allimg/140729/240450-140HZP45790.jpg";
			// "http://192.168.60.205/vdtimg/aHR0cDovLzE5Mi4xNjguNjAuMTI3OjY1NTEvRG93bkxvYWRGaWxlP2ZpbGVuYW1lPVBGU0I6L2JpbWcvYmltZy9kYXRhLzIwMTgwNDE4LzE1XzAvZDE1M2UyYjFlODgyMGJiMGYxNzlkMzdhZGQyOThhOWE%3D&encode=1";
			// var url2 =
			// "http://192.168.60.126/vdtimg/UEZTQjovdmR0aW1nL2JpbWcvZGF0YS8yMDE4MDQyMC8xM18wLzRlMmQ5M2FjMzE4ODgyNjRiZjQ4ZDBiZWNkYTE4ZjU4&encode=1&osd=eyJyZWN0cyI6W3sicG9zIjoiMCwwLDEyMiwxNjAiLCJsaW4iOjMsInIiOjI1NSwiZyI6MCwiYiI6MH1dfQ==";
			this.$refs.marker.setImage(url1);
		},
		getMarks() {
			var marks = this.$refs.marker.getMarks();
			console.log(JSON.stringify(marks));
		},
		setMarks() {
			var a = `[{"type":"ARROWS","params":{"sx":65.6934306569343,"sy":87.5912408759124,"ex":919.7080291970802,"ey":554.7445255474452},"style":{"lineColor":"red","lineWidth":2,"fontColor":"red","fontStyle":"normal 14px arial,sans-serif"}},{"type":"ARROWS","params":{"sx":854.0145985401459,"sy":138.6861313868613,"ex":116.7883211678832,"ey":576.6423357664233},"style":{"lineColor":"red","lineWidth":2,"fontColor":"red","fontStyle":"normal 14px arial,sans-serif"}}] `;
			this.$refs.marker.addMarks(JSON.parse(a));
		},
		clearMarks() {
			this.$refs.marker.clearMarks();
		},
		makeFont() {
			var val = this.inputVal;
			this.inputShow = false;
			this.$refs.marker.markFont(val, this.cachePos);
		},
		onMarkFont(pos) {
			this.cachePos = {};
			this.cachePos.sx = pos.sx;
			this.cachePos.sy = pos.sy;

			//业务层获取标注锚点，自定义输入交互后，将文本内容同锚点一起传参调用markFont接口

			this.inputVal = "";
			this.inputShow = true;

			var e = window.event;
			this.inputTextPos = {
				left: e.clientX + "px",
				top: e.clientY + "px"
			};
			setTimeout(() => {
				// this.$refs.marker.markFont(this.inputVal, pos);
			}, 1000);
		},
		changeType(t) {
			this.currentType = t;
			this.$refs.marker.setMarkType(t);
		},
		changeColor(c) {
			this.$refs.marker.setMarkStyle({
				lineColor: c
			});
		},
		backspace() {
			this.$refs.marker.backspace();
		},
		recover() {
			this.$refs.marker.recover();
		},
		createSnapshoot() {
			var data = this.$refs.marker.createSnapshoot();
			this.$refs.sss.src = data;
		}
	},
	data() {
		return {
			width: 800,
			currentType: "LINE",
			options: {},
			inputShow: false,
			inputVal: "",
			inputTextPos: {}
		};
	},
	mounted() {
		var path = this.$refs.path;
		var points = []; //"M250 150 L150 350 L350 350 Z"
		$(path).on("click", function() {
			// alert("click");
		});
		this.$refs.test.addEventListener("click", ev => {
			points.push({ x: ev.offsetX, y: ev.offsetY });
			$(path).attr(
				"d",
				points.reduce((res, item, index) => {
					if (index == 0) {
						res.push(`M${item.x} ${item.y}`);
						return res;
					} else if (index == points.length - 1) {
						res.push(`L${item.x} ${item.y}`);
						if (item.x == points[index - 1].x && item.y == points[index - 1].y) {
							res.push(`Z`);
						}
						return res.join(" ");
					} else {
						res.push(`L${item.x} ${item.y}`);
						return res;
					}
				}, [])
			);
		});
	}
};
</script>
<style lang="less" scoped>
.text-input {
	position: fixed;
	top: -100px;
	width: 230px;
	height: 20px;
	display: inline-block;
	z-index: 10000;
	input {
		border: 1px dashed #555;
		width: 170px;
		height: 20px;
		background: rgba(197, 189, 189, 0.34);
	}
}
</style>

