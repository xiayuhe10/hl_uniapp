<h1 align="center">UEasyDict</h1>
<h3 align="center">简便的Uniapp字典数据管理插件</h3>
------

## 介绍

UEasyDict是一个**简便的Uniapp字典数据管理插件**，可以用简便的配置**管理静态或后端提供的字典数据**。

## 开始使用（<a onclick="download_plugin(1, 1)" style="color: #0366d6;border-radius: 8px;cursor: pointer;">点击使用 HBuilderX 导入示例项目</a>）

1. 在项目目录下建立dict文件夹，并在该目录新建index.js配置文件(配置说明参考<a href="https://github.com/yedsn/vue-easy-dict#%E9%85%8D%E7%BD%AE%E5%AD%97%E6%AE%B5" target="_blank">API参考->配置字段</a>)，内容如下

   ```js
	import Vue from 'vue'
	import UEasyDict from '@/uni_modules/u-easy-dict/index.js'
	Vue.use(UEasyDict, {
       types: [
           {
               dictKey: 'status',
               data: [
                   { label: '启用', value: 1, color: 'red' },
                   { label: '禁用', value: 0, color: 'green' }
               ]
           }
       ]
   })
   ```

2. 在项目main.js导入刚刚建立的文件

   ```js
   import Vue from 'vue'
   import './dict/index.js' // 导入字典配置文件
   
   Vue.config.productionTip = false
   App.mpType = 'app'
   const app = new Vue({
       ...App
   })
   app.$mount()
   ```

3. 在页面上使用字典

   ```vue
   <template>
     <div>
       <div v-for="item in $dict.getType('status')" :key="item.value"> {{ item.label }} </div>
     </div>
   </template>
   <script>
   export default {
     mounted() {
       console.log(`字典内容：${this.$dict.getType('status')}`)
       console.log(`翻译字典值：${this.$dict.selectDictLabel('status', 1)}`)
     }
   }
   </script>
   ```

## 更多
<h3><a href="https://github.com/yedsn/vue-easy-dict#%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B" target="_blank">📖示例Demo</a></h3>
<h3><a href="https://github.com/yedsn/vue-easy-dict#api%E5%8F%82%E8%80%83" target="_blank">📖API说明</a></h3>

## 源码与文档：
[Github：https://github.com/yedsn/vue-easy-dict](https://github.com/yedsn/vue-easy-dict)

[Npm：https://www.npmjs.com/package/vue-easy-dict](https://www.npmjs.com/package/vue-easy-dict)

[Gitee：https://gitee.com/hongxiaojian/vue-easy-dict](https://gitee.com/hongxiaojian/vue-easy-dict)

`如果对你有帮助，请市场五星，github点个star，你的反馈是我继续开源的动力`