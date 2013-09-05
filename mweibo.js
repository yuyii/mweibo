//sina_login.js
var casper = require('casper').create();
var user = "";
var passwd = "";

casper.start('http://login.weibo.cn/login/',function(){	
	this.echo("**************** " + new Date() + " ******************");
	this.echo("页面已载入");
})

casper.then(function() {
    this.wait(1000,function() {
        this.echo("开始尝试登录");
    });
});

casper.then(function() {
	passname = this.getElementAttribute('input[type="password"]', 'name');
	var form = {}
	form['mobile'] = user;
	form[passname] = passwd;
	this.fill('form', form, true);
	
})

casper.then(function() {
    this.echo('当前链接：' + this.getCurrentUrl());
	url = this.getElementAttribute('a', 'href');
	this.open(url).then(function(){
		this.open("http://weibo.cn/at/weibo");
	})
});


casper.then(function(){
	form = this.getHTML("div#pagelist form");
	//this.capture("logined1.png");
	//this.echo(form);
	re = /(\d+)\/(\d+)页/;
	ret = form.match(re);
	if (ret) {
		var max_page = ret[2];
		current_page = ret[1];
		this.echo("一共" + max_page + "页");
		var arr = [];
		for(i = 1;i <= max_page;i++){
			arr.push(i);
		}
		var result = [];
		this.each(arr,function(self,page){
			self.thenEvaluate(function(page) {
			    document.querySelector('div#pagelist form input[name=page]').setAttribute('value', page);
			    document.querySelector('div#pagelist form').submit();
			},page);
			
			self.then(function(){
				this.echo("处理第" + page + "页");
				var content = this.getHTML();
				var regExp= /<div class="c" id=".*?"><div>(.*?#百万校园娘#.*?)<\/div><\/div>/gi; 
				var match;
				while( match=regExp.exec(content)){
					r = match[1];
					r = r.replace(/(<.*?>)|(<\/.*?>)/g,"");
					r = r.replace(/&nbsp;/g," ");
					r = "[" + (result.length + 1) + "] " + r;
					result.push(r);
				}
				//this.capture("logined" + page + ".png");
			})
		})
		
		this.then(function(){
			this.echo("**************** " + new Date() + " ******************");
			this.echo("");
			for (v in result) {
				this.echo(result[v])
			}
		})
	}
	else {
		this.echo("分页没找到");
	}
})

casper.run();
