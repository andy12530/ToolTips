##ToolTips##

ToolTips 是一个在网页显示小提示的组件，它依赖于jQuery.

实现tooltips的技巧在于小箭头并没有用图片代替，而用css的两个border进行覆盖生成的；这样做的好处在于
可以减少合并图片的麻烦，以后自定义箭头位置和颜色只需要改一行css即可。

tooltips组件兼容所有的浏览器（IE6+）。

###技巧：###

生成箭头，对于非IE6的浏览器来说，使用``border-color: transparent transparent #FFF7E3 transparent;``

而对于IE6来说，如果需要透明，它的borderStyle也要修改为dashed: ``border-style: dashed dashed solid dashed;``
    

