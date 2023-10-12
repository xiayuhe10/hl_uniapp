<template>
	<view>
		<view class="tagBall" @touchstart.stop.prevent="touchstartscene"
		@touchend.stop.prevent="touchendscene" @touchmove.stop.prevent="touchmovescene">
			<view class="tag" v-for="(item,index) in texts" :key="index" :style="liviews[index]">
				<view>{{item.studentName}}</view>
				<view class="dot"></view>
				<view>{{item.content}}</view>
			</view>
		</view>
	</view>
</template>
<script>
	var _self;
	export default {
		props:{
			speed:{
				type:Number,
				default:1
			},
			texts:{
				type:Array,
				default:null
			}
		},
		data() {
			return {
				tagEle: [],
				RADIUS: 300,
				fallLength: 400,
				angleX: Math.PI / 400,
				angleY: Math.PI / 400,
				tags: [],
				liviews: [],
				CX:0,
				CY:0,
				timer:null,
				clickX: 0,
				clickY: 0
			}
		},
		methods: {
			clearTimer(){
				clearInterval(this.timer);
			},
			getTags(option){
				this.tagEle=option.tagEle;
				this.CX=option.CX;
				this.CY=option.CY;
				this.innit();
			},
			rotateX() {
				var cos = Math.cos(this.angleX*this.speed);
				var sin = Math.sin(this.angleX*this.speed);
				for (var i = 0; i < this.tags.length; i++) {
					let t = this.tags[i]
					var y1 = t.y * cos - t.z * sin;
					var z1 = t.z * cos + t.y * sin;
					t.y = y1;
					t.z = z1;
				}
			},
			rotateY() {
				var cos = Math.cos(this.angleY*this.speed);
				var sin = Math.sin(this.angleY*this.speed);
				for (var i = 0; i < this.tags.length; i++) {
					let t = this.tags[i]
					var x1 = t.x * cos - t.z * sin;
					var z1 = t.z * cos + t.x * sin;
					t.x = x1;
					t.z = z1;
				}
			},
			innit() {
				for (var i = 0; i < this.tagEle.length; i++) {
					var a, b;
					var k = (2 * (i + 1) - 1) / this.tagEle.length - 1;
					var a = Math.acos(k);
					var b = a * Math.sqrt(this.tagEle.length * Math.PI);
					// var a = Math.random()*2*Math.PI;
					// var b = Math.random()*2*Math.PI;
					var x = this.RADIUS * Math.sin(a) * Math.cos(b);
					var y = this.RADIUS * Math.sin(a) * Math.sin(b);
					var z = this.RADIUS * Math.cos(a);
					var t = new this.tag(this.tagEle[i], x/2, y/2, z/2);
					this.tags.push(t);
					this.move(t, i)
				}
				
				this.animate(this.tags);
				//this.$forceUpdate()
			},
			tag: function(ele, x, y, z) {
				this.ele = ele;
				this.x = x;
				this.y = y;
				this.z = z;
			},
			move: function(t, i) {
				var scale = this.fallLength / (this.fallLength - t.z*1.3);
				var alpha = (t.z + this.RADIUS) / (2 * this.RADIUS);
				this.liviews.push({
					fontSize: 5 * scale + 'px',
					opacity: alpha + 0.5,
					filter: 'alpha(opacity = ' + (alpha + 0.5) * 100 + ')',
					zIndex: parseInt(scale * 100),
					left: t.x + this.CX - t.ele.offsetWidth / 2 + "px",
					top: t.y + this.CY - t.ele.offsetHeight / 2 + "px"
				});
			},
			animate(x) {
				_self=this;
				this.timer=setInterval(function() {
					_self.rotateX();
					_self.rotateY();
					_self.liviews=[];
					this.dotlist=[];
					for (var i = 0; i < x.length; i++) {
						_self.move(x[i], i);
					}
				}, 80)
			},
			touchstartscene(e) {
				this.clickX=e.touches[0].clientX;
				this.clickY=e.touches[0].clientY;
				clearInterval(this.timer);
			},
			touchendscene() {
				this.animate(this.tags)
			},
			touchmovescene(e) {
				var fx=this.getDirection(this.clickX,this.clickY,e.touches[0].clientX,e.touches[0].clientY)
				var x = this.clickX-e.touches[0].clientX - this.CX;
				var y = this.clickY-e.touches[0].clientY - this.CY;
				if(fx==1){
					x = e.touches[0].clientX-this.clickX;
					y = e.touches[0].clientY -this.clickY- this.CY;
				}else if(fx==2){
					x = e.touches[0].clientX-this.clickX;
					y = e.touches[0].clientY + this.CY;
				}else if(fx==3){
					x = e.touches[0].clientX - this.CX-this.clickX;
					y = e.touches[0].clientY - this.CY;
				}else{
					x = this.clickX-e.touches[0].clientX - this.CX;
					y = this.clickY-e.touches[0].clientY - this.CY;
				}
				this.angleY = x * 0.0001;
				this.angleX = y * 0.0001;
				_self.rotateX();
				_self.rotateY();
				_self.liviews=[];
				for (var i = 0; i < this.tags.length; i++) {
					_self.move(this.tags[i], i);
				}
			},
			getDirection(startx, starty, endx, endy) {
			        var angx = endx - startx;
			        var angy = endy - starty;
			        var result = 0;
			        if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
			            return result;
			        }
			        var angle =  Math.atan2(angy, angx) * 180 / Math.PI;;
			        if (angle >= -135 && angle <= -45) {
			            result = 1;
			        } else if (angle > 45 && angle < 135) {
			            result = 2;
			        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
			            result = 3;
			        } else if (angle >= -45 && angle <= 45) {
			            result = 4;
			        }
			 
			        return result;
			    }
		}
	}
</script>
<script module="renderTest" lang="renderjs">
	export default {
		data() {
			return {
				
			}
		},
		mounted() {
			var tagEle = document.querySelectorAll(".tag")
			let array=[];
			for (var i = 0; i < tagEle.length; i++) {
				array.push({offsetWidth:tagEle[i].offsetWidth,offsetHeight:tagEle[i].offsetHeight})
			}
			var paper = "querySelectorAll" in document ? document.querySelector(".tagBall") : getClass("tagBall")[0];
			var CX = paper.offsetWidth / 2,
			CY = paper.offsetHeight / 2
			this.$ownerInstance.callMethod('getTags',{tagEle:array,CX:CX,CY:CY})
		},
		methods: {
		}
	}
</script>
<style>
	.tagBall {
		width: 700rpx;
		height: 700rpx;
		margin: 0 auto;
		position: relative;
	}

	.tag {
		width: 150rpx;
		position: absolute;
		color: #FFFFFF;
		font-size: 15rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.dot{
		width: 12rpx;
		height: 12rpx;
		background-color: #FFFFFF;
		border-radius: 50%;
		margin-top: 10rpx;
	}
</style>
