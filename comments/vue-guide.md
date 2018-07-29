### 预期
- 会写简单的html页面并且会写一点js, 甚至可以不会用jquery,不会写css  

### 目的  
- 可以比较迅速的开始开发后台的前端项目中的简单页面  

### 关于后台的前端项目  
- webapp(单页面应用)  
- [vue](https://cn.vuejs.org/)  
- 组件库[element-ui](http://element-cn.eleme.io/#/zh-CN)  

### 准备工作
1. 编辑器 : [VSCode](https://code.visualstudio.com/) 编辑器插件: Vetur, ESLint
2. 环境 : [Node.js](https://nodejs.org/en/) 版本选8.11.3  
 (想多个版本nodejs的,nvm了解一下)
3. ---- 至此已经可以clone项目来玩了
4. 在项目目录运行`npm install` (简写`npm i`) 来安装
5. 本地启动项目,运行`npm run dev`  


### 关于vue
- 一个前端框架, 主要特点是支持数据双向绑定, 组件化  
- [官方简明教程](https://cn.vuejs.org/v2/guide/index.html)  看到组件之前即可  

### 一个页面的组成
- 由于组件可以嵌套, 组件和页面没有明显的界限
- 组件的实际使用,一般都是替换原来html中的某一个空的标签比如div来显示在页面上  
比如index.html中的id为app的div就是要被替换成App.vue这个页面(或者叫组件)的
- 一般是一个.vue文件
- 三部分 template(html模板) script(逻辑处理,js代码) style(样式调整)

#### template部分: 
1. 基本思路, cp element-ui的样例代码
2. 注意事项: 必须只能有一个根节点    
正确代码 ↓
``` html
<template>
    <div> <!-- 根节点  -->
        <!-- 内容都写这里  -->
        <p>姓名: {{name}}</p> <!-- vue 模板语法, 此处将会和组件script中的data.name建立绑定  -->
        <div>年龄: {{formatedAge}}</div>
    </div>
</template>
```  
错误代码 ↓  
``` html
<template>
    <div>
        <!-- 内容都写这里  -->
    </div>
    <div>sth else</div> 
</template>
```
#### script部分
``` html
<script>
    // 导出一个json对象的语法, 这个json不是vue组件的类,而是生成这个组件的`配置文件`,理解成组件也影响不大
    export default {
        data(){  // js新语法,跟vue无关,等价于 data: function() {}
            return {
                name: 'someStr', // 之后就可以通过this.name 拿到这个值而不是this.data
                age: 100, //末尾多个逗号不属于语法错误, 某些语法规范甚至鼓励这种写法
                list: [],
            }
        },
        computed: {
            formatedAge(){ // 参考data . 等价于formatedAge: function(){} 
                return this.age + '岁';
            },
        },
        methods: {
            fetchData(){ //类比data,之后就可以通过this.fetchData()来调用
                let data; // 基本用var的地方都可以用let,甚至可以用const. 语法规范
                // api.ajax.get('some url') 拿到data
                data = {list:[1,2,3,4]} //假装拿到数据
                this.list = data.list; // 如果list和template中某个组件有绑定关系,那么现在已经更新了
            },
        },
        filters: { //一般用作格式化,逻辑简单,复杂处理请放到计算属性
            nameFilter(name) {
                return name+'先生'; //或者首字母大写处理,全小写, 加货币符号之类的
            },
        },
    }
</script>
```
1. 导出一个json对象,这个json对象包括了这个页面或者叫组件的属性:  
    - `data`: __数据的集合__ 一个方法,返回一个json, 返回值中的参数用于组件中的数据绑定或者就是一些变量    
        data要 __用方法返回__ 是因为组件在复用的时候不能使用同一份data数据, 大概像每次新建对象都要需要new
    - `computed`: __计算属性__ 的集合 一个json, 里边是一堆方法
    - `methods`: __一般方法__ 的集合 一个json, 里边是放一堆方法, 用于自己调用或者绑定组件的事件  
    - `created`: 一个方法,如果写了,那么组件被 __创建__ 之后会被调用一次  
    - `mounted`: 一个方法,如果写了,那么组件替换掉对应的标签之后( __挂载__ )就会被调用一次  
    - `created`, `mounted`属于组件生命周期(创建,挂载,更新,卸载,销毁等)中的一些回调, 常用的就这俩  
    - `filters`: 过滤器, 一般用这个来格式化显示一些东西数据, 用法有点像shell中的管道 `{{ name | nameFilter}}`  

#### style部分  
``` html
<style scoped>
    .price {
        color:gold;
    }
</style>
```
- 预期是基本不写css, 可能实际用到的就是给一些原始标签加个clss,改个字体颜色啥的  
- `scoped` 这个东西可以保证你这里写的class样式不会影响到别的地方  

#### 添加和使用api
- 参照之前写好的写就好了 
- // 使用的发送ajax请求的库是`axios`  

#### 搬运指南1
- 这里讲怎么从element-ui那里cp代码, 搬运table  
- 拿到第一个table样例的代码,纯cp  ,加了注释
``` html
  <template>
    <!-- 
        因为就一个table,所以直接放在了根节点
        如果table以外还有别的比如分页部分,就把这个table包在div里边
        :data="tableData" 把这个表格的每行的数据和data中的tableData绑定
        所以这里的tableData 应该是一个数组,每一项是一个json
        :data 为 v-bind:data= 的简写
        style="width: 100%" 属性设置,样式
    -->
    <el-table 
      :data="tableData"
      style="width: 100%">
      <!-- 
          el-table-column表格的列
          prop 对应的json中的key
       -->
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </template>

  <script>
    export default {
      // 一般场景下,tableData应该是空的 [] ,然后在created的时候通过api拿到tableData的值
      data() {
        return {
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
        }
      }
    }
  </script>
```  
- 拿过来之后加到自己的页面, 各自放到各自的位置即可,像是合并代码  
``` html
<template>
    <div>
        <div>
            页面的一些元素
        <div>
        <el-table>..table模板丢这里..</el-table>
    </div>
</template>
<script>
    // 使用之前定义好的api之前,先引入一下
    import someapi from '@/api/someapi'; 

    export default {
        data(){
            return {
                name: "之前的一些值",
                tableData:[], //添加到这里tableData, 不想用这个变量名字,换个就好,对应的template绑定的名字也得改成一样的
            }
        },
        methods: {
            fetchList(){ //可能需要加一个方法用来拉取数据
                // ajax请求拿到数据给我们的tableData赋值
                someapi.someFunc().then((res)=>{
                    // res 就是 状如 {code:200,data:[],msg:''} 的对象了
                    this.tableData = res.data;
                })
            },
            someotherMethod() { //其他方法

            },
        },
        created() { //创建的时候,就去拉取一下数据
            this.fetchList();
        },
    }
</script>
``` 
##### 搬运完成了,只是简单的list还没有分页   
------
#### 搬运指南1
- 这里讲怎么从element-ui那里cp代码, 搬运分页  
- 按照cp table的思路,从pagination样例中找一个完整功能的代码,去掉了不需要的  

``` html
<template>
  <div class="block">
    <span class="demonstration">完整功能</span>
    <!-- 
        可以只拷贝el-pagination部分
        element-ui每个组件样例后边都有文档,关于属性设置,事件触发等
        @size-change="handleSizeChange"  每页数量变化的时候触发我们写好的handleSizeChange方法
        缩写,完整写法是 v-on:size-change="handleSizeChange" 
        然后我们就可以在handleSizeChange中重新拉取一次数据,当然这次要带上参数  
        :current-page="currentPage4"  当前页码和data.currentPage4 绑定  
        :page-size="100"  我们需要修改这个为 :page-size="pageSize" 来和data.pageSize绑定
        之后请求的时候, this.currentPage4 和 this.pageSize 就是我们的分页参数了
        :total="400" 这个肯定得是api请求回来才能设置的东西了, 改成:total="pageTotal"
    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.fetchList(); // 拉取数据
      },
      // table那边的fetchList方法
      fetchList(){
        // 参数怎么约定看api,
        someapi.someFunc({limit:this.this.pageSize,otherParam:'2635'}).then((res)=>{
            // res 就是 状如 {code:200,data:{list:[],total:2134},msg:''} 的对象了
            // 填充数据
            this.tableData = res.data;

            // 修改我们的pageTotal
            this.pageTotal = res.data.total;
        })
      },
    },
    data() {
      return {
        currentPage4: 4,
        pageSize: 100,
        pageTotal: 0,
      };
    }
  }
</script>
```






### 一些可能需要的非专业名词解释
- 单页面应用 : 一般表现为页面没有显式刷新，请求大都通过ajax 
- 组件 : 比如按钮, 输入框, 弹出框等. 界面元素或者容器  
- npm : node package manager(包管理器)  
- 方法 : method 就是函数
- 标签 : 指的HTML中的body div p a input等等, html即标签语言  



### 其他
- 前期应该基本看不懂的东西
- 模板作者为模板写的[说明文档](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)
- 模板作者写的[相关博客](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
- 浏览器比较建议使用chrome, 嗯倒是无关紧要
- 浏览器的[调试插件](https://github.com/vuejs/vue-devtools)