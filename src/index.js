import "./index.scss";

//插入元素
var ele = document.createElement('h1');
ele.innerHTML = "Hello 大话主席!";
document.body.appendChild(ele);

//插入图片
var img = document.createElement('img');
img.src = "https://img.t.sinajs.cn/t6/style/images/global_nav/WB_logo.png";
document.body.appendChild(img);