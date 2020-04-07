export default {
    "basic": {
        "name": "张珺",
        "e_name": "JOHN",
        "corp": "携程旅游网络技术有限公司",
        "job": "资深前端开发工程师",
        "sex": "男",
        "age": 30,
        "experience": "4",
        "city": "上海",
        "degree": "硕士",
        "tel": "188-1827-2094",
        "email": "zj_john@qq.com",
        "blog": "https://zj-john.github.io/",
        "github": "https://github.com/zj-john",
        "word": "用技术做点有意思的事儿"
    },
    "works": [
        {
            "corp": "携程旅游网络技术有限公司 技术保障中心",
            "time_from": "2015.07",
            "time_to": "至今",
            "content": "中后台工具设计、开发，目前负责前端开发、管理"
        }
    ],
    "study": [
        {
            "school": "华东师范大学 计算机应用技术 学术硕士",
            "time_from": "2012.09",
            "time_to": "2015.07",
            "content": "现代软件技术、遗传算法"
        }
    ],
    "skills": [
        "熟悉HTML、JS、CSS，熟悉HTML5、ES6、CSS3、WEBAPI规范、语法，可以写原生JS项目",
        "熟悉REACT、VUE等主流框架及其生态系统的使用",
        "了解Node后端开发，koa框架",
        "熟悉CDN、HTTP，熟悉前后端分离开发模式",
        "了解python，java等后端技术，可写脚本及web后台",
        "管理4-5人前端团队（制定前端开发协作规范，开展前端工程化培训，落地开源工具，打通CSR发布流程，搭建内部脚手架）"
    ],
    "projects": {
        "web": [
            {
                "name": "Webinfo",
                "desc": "1.自顶向下展示应用架构各维度数据。2.涵盖应用生命周期中功能操作。3.衍生产品（应用诊断，自动故障分析）。",
                "tech": "react16 + router3 + redux5 + webpack3 + react-intl + ravenjs",
                "work": "1. 框架搭建（前端结构，node层接SSO，做service转发，自动发布脚本） 2.routeManager（代理所有路由行为，实现glider书签效果） 3.i18n（实现中英双语展示） 4.自定义个人页（localstorage储存、flex布局） 5.codereview,组件重构"
            },
            {
                "name": "Site_Controller",
                "desc": "1.日常流量调度。2.灾备切换。3.数据中心级别一键切换、恢复",
                "tech": "Angular1 + bootstrap4 + gulp + bower + echarts",
                "work": "1.数据中心切换动画效果（多background-image画数据中心地图，div画线，伪类画箭头，设置动画）。 2. 宏任务管理（切换过程中需要轮询更新多个数据，保持后端接口唯一调用的同时，实现Dom节流）。3. 多Echarts图例绑定展示"
            },
            {
                "name": "Monkey",
                "desc": "混沌工程，故障注入",
                "tech": "vue2 + router3 + vuex3 + less + axios + vis + ElementUI",
                "work": "1.框架搭建。2.vis绘制依赖关系"
            },
            {
                "name": "Seer",
                "desc": "异常检测平台，覆盖时序数据异常检测实验运行的整个生命周期，支持数据接入、算法选择、参数定制等",
                "tech": "react16 + router4 + redux6 + materialUI + markdown + canvas",
                "work": "1.用canvas描述数据流图，动态添加节点。2.在线MD文件预览"
            },
            {
                "name": "Yapi",
                "desc": "高效、易用，功能强大的可视化接口管理平台（开源项目落地）",
                "tech": "react全家桶 +  koa全家桶 + Mongo + mockjs",
                "work": "1.接入SSO。2.增加权限管理模块"
            },
            {
                "name": "React_Material_Seed/Admin",
                "desc": "React全家桶 + MaterialUI的脚手架和模块集合看板",
                "tech": "react + materialui + compose + rc-tree + react-dnd + formsy-react",
                "work": "1. 框架搭建。2.各个模块(tree,transfer,form,bubble etc.)。3.codereview。"
            }
        ],
        "hybrid": [
            {
                "name": "EasyGo",
                "desc": "简单、实用、快速的行程规划App，根据起点和终点的位置（同城）、时间，选择或不选意向景点，动态生成出行规划。（3rd Hackathon竞赛最佳项目及CEO大会展示）",
                "tech": "JqueryMobile + Ionic + Django + LBS",
                "work": "1. 产品经理。2.前端开发。3.推荐算法。"
            },
            {
                "name": "HappyBox",
                "desc": "主打年轻化、社交化的周末游App，创建或加入活动（微创新优秀项目）",
                "tech": "vue2 + vuex3 + dcloudio/uni-ui",
                "work": "1. 产品。2.前端开发，Demo包含主页、列表页、详情页、新闻页、聊天页等内容，风格功能参照点评和小红书。"
            },
            {
                "name": "Travel_Order_Share",
                "desc": "订单后分享流程，生成订单后，选择样式模板，加入自定义文案和图片，一键生成图片，便于分享。",
                "tech": "react15 + antd-mobile + canvas",
                "work": "1. 前端开发。 2. canvas画板，导出图片"
            }
        ],
        "github": [
            {
                "name": "GitHub_MockServer",
                "desc": "通过service-worker做代理，把github可访问的静态JSON文件，解析为http返回，实现mock功能。JSON文件中可以自定义响应码，返回时间。"
            },
            {
                "name": "Relieve_DNS_Hijacking_by_SW",
                "desc": "缓解DNS劫持探索。在service-worker中添加多个hosts，当其中某一个host访问不通（如被劫持），将尝试使用备用host访问，并加入缓存。"
            },
            {
                "name": "Node_Scripts",
                "desc": "1. 房产网站爬虫，爬取某网站二手房信息，入库和导出excel。2.把通过灰度反转，字符串填充的方式，把图片用字符样式代替。3.生成NPMdependency树。"
            },
            {
                "name": "drawing_Board",
                "desc": "通过图片、气泡、文字等canvas元素，自定义生成四格漫画。"
            },
            {
                "name": "simplify-best-resume-ever(fork)",
                "desc": "通过配置文件、自定义模板生成简历"
            }
        ]
    }
}