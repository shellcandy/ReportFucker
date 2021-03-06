//对应的地址表
window.addressTable = {

	}
//Kaizen动画对象
window.KZ=new KaiZen();
//本地存储操作对象
window.DB = new localDB();
//顶级状态管理器
window.TopState = {
	serverState: '',
};
//动画缓动
window.running=true;
//消息管理器
window.msg = new Message();
//任务管理器
window.TM = new TaskManage();
//列表管理
window.TL = new TaskList();
//服务器状态通信
window.NS = new NetServer();
//网络链接状态
window.serverState = true;
//服务器错误控制
window.serverErr=true;
//本地操作任务队列
window.LocalTaskList = window.DB.getTaskList();
$(function() { //设置窗的弹出动画
	$("#btn-set").click(function() {
		$("#setting").show();
		$("#bg").fadeIn("slow");
		$("#setting").animate({
			'right': '1px'
		}, "1500");

	});
	$("#btn-return").click(function() {
		$("#bg").fadeOut("slow");
		$("#setting").animate({
			'right': '-90%'
		}, "1500");
	});
})

//时间选择控件
$(function() {
	window.sum = 4; //每次增加的日期块数量
	$("#datelist").scroll(function() {
		//如果滚动到顶部
		if($("#datelist").scrollTop() <= 3) {
			getTopNode();
			$("#datelist").scrollTop(4);
		}
		//如果滚动到底部
		if($("#datelist").scrollTop() + $("#datelist").height() == $("#datelist ul").height()) {
			getBottomNode();
		}
	});

	function getTopNode() { //根据现在的日期拼接未来的时间块
		var html = "";
		var times = getTopTime();
		var tlist = [];
		for(var i = 0; i < sum; i++) {
			var thtml = "";
			times = getopPreTimeStr(times);
			thtml += "<li class='btn-pulse' onclick='dateClick(this)' date-time='" + times[0] + "." + times[1] + "." + times[2] + "'>";
			thtml += times[0] + "年" + times[1] + "月" + times[2] + "日";
			thtml += "</li>";
			tlist.push(thtml);
		}
		if(tlist.length > 0) {
			for(var i = tlist.length; i > 0; i--) {
				html += tlist[i - 1];
			}
		}
		//链接时间块
		$("#datelist ul").prepend(html);
		//释放底部的的日期块
		if($("#datelist ul>li").length > 1000) {
			for(var i = 0; i < 4; i++) {
				$("#datelist ul>li").last().remove();
			}
		}
	}

	function getBottomNode() { //根据现在的日期拼接过去的时间块
		var html = "";
		var times = getBottomTime();
		for(var i = 0; i < sum; i++) {
			times = getopNextTimeStr(times);
			html += "<li class='btn-pulse' onclick='dateClick(this)' date-time='" + times[0] + "." + times[1] + "." + times[2] + "'>";
			html += times[0] + "年" + times[1] + "月" + times[2] + "日";
			html += "</li>";
		}
		//链接时间块
		$("#datelist ul").append(html);
		//释放底部的的日期块
		if($("#datelist ul>li").length > 1000) {
			for(var i = 0; i < 4; i++) {
				$("#datelist ul>li").first().remove();
			}
		}

	}

	function getTopTime() { //获取顶部块的时间
		var timestr = $("#datelist ul>li").first().attr("date-time");
		return timestr.split(".");
	}

	function getBottomTime() {
		var timestr = $("#datelist ul>li").last().attr("date-time");
		return timestr.split(".");
	}
	Date.prototype.Format = function(fmt) { //日期时间格式化
		var o = {
			"M+": this.getMonth() + 1, //月份   
			"d+": this.getDate(), //日   
			"h+": this.getHours(), //小时   
			"m+": this.getMinutes(), //分   
			"s+": this.getSeconds(), //秒   
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
			"S": this.getMilliseconds() //毫秒   
		};
		if(/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	function getopNextTimeStr(preTimes) { //获取下一个块的时间字符串
		var str = preTimes[0] + "." + preTimes[1] + "." + preTimes[2];
		var time = Math.round(new Date(str).getTime() / 1000)
		time -= 86400; //减去一天的毫秒值
		time = new Date(time * 1000);
		return time.toLocaleDateString().split('/');
	}

	function getopPreTimeStr(NextTimes) { //获取上一个块的时间字符串
		var str = NextTimes[0] + "." + NextTimes[1] + "." + NextTimes[2];
		var time = Math.round(new Date(str).getTime() / 1000)
		time += 86400; //减去一天的毫秒值
		time = new Date(time * 1000);
		return time.toLocaleDateString().split('/');
	}

	//日期控件初始化
	var time = new Date();
	var times = time.toLocaleDateString().split("/");
	var html = "";
	html += "<li class='active' onclick='dateClick(this)' date-time='" + times[0] + "." + times[1] + "." + times[2] + "'>";
	html += times[0] + "年" + times[1] + "月" + times[2] + "日";
	html += "</li>";
	$("#datelist ul").html(html);
	getBottomNode();
	getTopNode();
	$("#datelist").scrollTop(4);

})

function dateClick(mythis) { //日期选择块的日期选择事件
	$("#datelist li").removeClass('active');
	$(mythis).addClass('active');
	window.TM.setDate($(mythis).attr('date-time'));
	$("#tasklist ul").html(window.TL.getTaskListStrutsByDate());
}
$(function() {
	$("#btn-close").click(function() { //退出程序
		nw.App.quit();
	});
	$("#btn-small").click(function() {//缩小	
		var win = nw.Window.get();
		win.minimize();
	});
	$("#btn-refresh").click(function() {//刷新
		location.reload();
	});
})
$(function() { //任务列表向下滚动
		$("#tasklist").scroll(function() {
			//如果滚动到底部
			if($("#tasklist").scrollTop() + $("#tasklist").height() == $("#tasklist ul").height()) {
				if($("#tasklist>ul>li").length < 100) {
					var html = "";
					for(var i = 0; i < 4; i++) {
						html += "<li onblur='taskliBlur(this,event)' ondblclick='addOrEditTask(this, event)' data-hasetask='false' class='taskblock tasknullbg' onclick='taskClick(this)'><div  class='taskcontent' ></div><div data-show='false' class='btns'>\
						<ul>\
								<li class='complete '  onclick='taskSuccess(this,event)' data-taskstate='false'>完成</li>\
								<li class='delete' onclick='taskDelete(this,event)'>删除</li>\
							</ul>\
						</div></li>";
					}
					$("#tasklist>ul").append(html);
				}

			}
		});
		//任务列表初始化
		$("#tasklist ul").html(window.TL.getTaskListStrutsByDate());
	})
	//任务列表按钮弹出事件
function taskClick(mythis) {
	if($(mythis).attr('data-hasetask') == 'true') {
		if($(mythis).find(".btns").attr("data-show") == 'true') {
			$(mythis).find(".btns").animate({
				'right': '-51px'
			}, 100);
			$(mythis).find(".btns").attr("data-show", 'false');
		} else {
			//缩回所有已有的任务按钮盘
			$(".btns").animate({
				'right': '-51px'
			}, 50);
			$(".btns").attr("data-show", 'false');

			$(mythis).find(".btns").animate({
				'right': '0'
			}, 100);
			$(mythis).find(".btns").attr("data-show", 'true');
		}
	}
}
//任务完成	
function taskSuccess(mythis, e) {
	if($(mythis).attr("data-taskstate") == "true") { //如果任务完成
		$(mythis).text("完成");
		$(mythis).attr("data-taskstate", 'false');
		$(mythis).parents(".taskblock").eq(0).removeClass("taskcp");
		//			e.stopPropagation()
		window.TM.updateTask({
			localid: $(mythis).parents(".taskblock").eq(0).attr('data-localid'),
			state: 'undone',
		});
	} else {
		$(mythis).text("撤销");
		$(mythis).attr("data-taskstate", 'true');
		$(mythis).parents(".taskblock").eq(0).addClass("taskcp");
		//			e.stopPropagation()
		window.TM.updateTask({
			localid: $(mythis).parents(".taskblock").eq(0).attr('data-localid'),
			state: 'complete',
		});
	}
}
//删除任务
function taskDelete(mythis, e) {
	var node = $(mythis).parents('.taskblock').eq(0);
	node.find(".taskcontent").text('');
	node.attr('data-hasetask', 'false');
	node.removeClass("taskcp");
	node.addClass("tasknullbg");
	node.find('.complete').text("完成");
	node.find('.complete').attr("data-taskstate", 'false');
	//缩回所有已有的任务按钮盘
	node.find(".btns").animate({
		'right': '-51px'
	}, 100);
	node.find(".btns").attr("data-show", 'false');
	
	var lid = node.attr('data-localid');
	node.attr('data-localid','');
	window.TM.deleteTask(lid);
}
//添加和编辑任务
function addOrEditTask(mythis, e) {
	$(mythis).find(".taskcontent").css('text-indent', '0px');
	$(mythis).removeClass("tasknullbg");
	$(mythis).addClass("addtask");
	var node = "<textarea class='ta' onblur='taskBlur(this,event)'></textarea>"
	var str = $(mythis).find(".taskcontent").text();
	$(mythis).find(".taskcontent").html(node);
	$(mythis).find(".ta").text(str);
	$(mythis).find(".ta").focus();
}
//任务编辑框失去焦点之后
function taskBlur(mythis, e) {
	$(mythis).parents(".taskcontent").eq(0).css('text-indent', '20px');
	var str = $(mythis).val();
	$(mythis).parents('.taskblock').eq(0).attr('data-hasetask', 'true');
	var lid = $(mythis).parents('.taskblock').eq(0).attr('data-localid');
	if(lid != null && lid != '') {
		window.TM.updateTask({
			content: str,
			localid: lid
		});
	} else {
		lid = getLocalId();
		$(mythis).parents('.taskblock').eq(0).attr('data-localid', '' + lid);
		window.TM.createTask({
			name: '',
			content: str,
			state: 'undone', //任务状态未完成
			localid: lid,
		});
	}

	$(mythis).parents(".taskcontent").eq(0).text(str);

}
//任务框失去焦点之后
function taskliBlur(mythis, e) {
	taskClick(mythis);
}

//禁止向窗口拖放东西
$(window).on('dragover', function(e) {
	e.preventDefault();
	e.originalEvent.dataTransfer.dropEffect = 'none';
});
$(window).on('drop', function(e) {
	e.preventDefault();
});
//屏蔽右键按钮
document.oncontextmenu = function() {
	return false;
}

//本地数据库读取
function localDB() {
	//数据源
	this.Data = null;

	//保存ServerTaskList
	this.saveTaskList=function(list){
		try {
				localStorage.TaskList = JSON.stringify(list);
			} catch(error) {
				return false;
			}
			return false;
	}
	//读取ServerTaskList
	this.getTaskList=function(){
		try {
				var list=JSON.parse(localStorage.TaskList);
				if(list==null){
					return [];
				}else{
					return list;
				}
			} catch(error) {
				return [];
			}
	}

	//将数据持久化
	this.saveStorage = function(obj) {
			try {
				localStorage.Data = JSON.stringify(obj);
			} catch(error) {
				return false;
			}
			return true;
		}
		//获取持久化的数据
	this.getStorage = function() {
			try {
				return JSON.parse(localStorage.Data);
			} catch(error) {
				return null;
			}
		}
		//读取某一天的数据
	this.getDataByDate = function(date) {
			if(window.serverState) {//如果网络状况是联通的
				window.NS.getListByDate({//此处只能异步的处理数据
					'date':date,
				},function(obj){
					if(obj.state=='success'){
						if(obj.data&&obj.data.length>0){
							var date=obj.data[0].date;
							var list=[];
							for(var i=0;i<obj.data.length;i++){
								var node=obj.data[i];
								list.push({
									date:node.date,
									name:'',
									id:node.id,
									isTB:false,
									content:node.content,
									state:node.state,
									localid:node.localid,
									
								});
							}
							if(window.DB.Data!=null){
									window.DB.Data[date]=list;//覆盖本地得缓存
							}else{
								window.DB.Data={};
							}

							//将内存中得状态缓存到文件
							window.DB.saveStorage(window.DB.Data);
							//重新加载页面任务列表
							$("#tasklist ul").html(window.TL.getTaskListStrutsByDate(window.DB.Data[date]));
						}
					}
				});
				//异步得话没办法,先返回一个结构给
				if(this.Data!=null&&this.Data[date] != null) {
					return this.Data[date];
				} else {
					return null;
				}
				
			} else {
				if(this.Data!=null&&this.Data[date] != null) {
					return this.Data[date];
				} else {
					return null;
				}

			}
		}
	//更具localid获取taskID
	this.getTaskIdByLocalId=function(date,localid){
			for(var i = 0; i < this.Data[date].length; i++) {
				if(this.Data[date][i].localid == localid) {
					return this.Data[date][i].id;
				}
			}
	}
		//跟新某一天的数据
	this.updateTask = function(date, data) {
			for(var i = 0; i < this.Data[date].length; i++) {
				if(this.Data[date][i].localid == data.localid) {
					var powertable = {
						'date': true,
						name: true,
						id: true,
						isTb: true,
						content: true,
						state: true,
						localid: false, //内部id,标识每天的几号任务
					};
					for(var n in data) {
						if(powertable[n]) {
							this.Data[date][i][n] = data[n];
						}
					}
				}
			}
			this.saveStorage(this.Data);
		}
		//增加某一天的数据
	this.setDateByDate = function(date, data) {
			//如果本地数据存在,则更新,若不存在,则增加
			if(this.Data[date] != null) {
				this.Data[date + ''].push({
					'date': date,
					name: data.name,
					id: data.id,
					isTb: data.isTb,
					content: data.content,
					state: data.state,
					localid: data.localid, //内部id,标识每天的几号任务
				});
			} else {
				this.Data[date + ''] = [];
				this.Data[date + ''].push({
					'date': date,
					name: data.name,
					id: data.id,
					isTb: data.isTb,
					content: data.content,
					state: data.state,
					localid: data.localid, //内部id,标识每天的几号任务
				});
			}
			//标记为未上传,调用上传模块进行扫描更新
			this.saveStorage(this.Data);
		}
		//删除某项任务
	this.deleteTask = function(date, localid) {
			var tasklist = this.Data[date];
			if(tasklist) {
				for(var i = 0; i < tasklist.length; i++) {
					if(tasklist[i].localid == localid) {
						tasklist.splice(i, 1); //删除数组中的
					}
				}
			}
			this.saveStorage(this.Data);
		}
	//获取登陆key
	this.getKey=function(){
		if(localStorage.UserKey){
			return localStorage.UserKey;
		}else{
			return null;
		}
	}
	//设置登陆key
	this.setKey=function(key){
		
			localStorage.UserKey=key;
		
	}
		//构造函数

	if(localStorage.Data != null) {
		this.Data = this.getStorage();
	} else {
		this.saveStorage({});
		this.Data = this.getStorage();
	}

}
//任务管理器
function TaskManage() {
	//当前操作日期
	var time = new Date();
	var times = time.toLocaleDateString().split("/");
	this.curdate = times[0] + '.' + times[1] + '.' + times[2];
	//新建任务
	this.createTask = function(obj) {
			if(obj) {
				obj.date = this.curdate;
				obj.id = null;
				obj.isTb = false;
			}
			window.DB.setDateByDate(this.curdate, obj);
			window.LocalTaskList.push({
				com: 'createTask',
				param: obj,
			});
			window.msg.console('[离线]-新建任务');
		}
		//删除任务
	this.deleteTask = function(localid,id) {
			
			window.LocalTaskList.push({
				com: 'deleteTask',
				param: {
					date: this.curdate,
					'localid': localid,
					taskid:window.DB.getTaskIdByLocalId(this.curdate,localid),
				},
			});
			window.DB.deleteTask(this.curdate, localid);
			window.msg.console('[离线]-删除任务');
		}
		//更新任务
	this.updateTask = function(obj) {
			window.DB.updateTask(this.curdate, obj);
			window.LocalTaskList.push({
				com: 'updateTask',
				param: {
					date: this.curdate,
					'localid': obj.localid,
					content: obj.content,
					state: obj.state,
					taskid:window.DB.getTaskIdByLocalId(this.curdate,obj.localid)
				},
			});
			window.msg.console('[离线]-更新当前任务');
		}
		//更改指示日期
	this.setDate = function(date) {
			if(date) {
				this.curdate = date;
			}
		}
		//获取localid
	this.getLocalId = function() {
			return new Date().getTime();
		}
		//获取某一天的任务列表
	this.getTaskListByDate = function() {
		return window.DB.getDataByDate(this.curdate);
	}
	
}

//获取当前时间戳
function getLocalId() {
	return new Date().getTime();
}
//任务列表对象
function TaskList() {
	//获取某一天的任务列表结构
	this.getTaskListStrutsByDate = function(tlist) {
		var tasklist;
		if(tlist!=null){
			tasklist=tlist;
		}else{
			 tasklist = window.TM.getTaskListByDate(); //获取当前日期tasklist
		}
		if(tasklist && tasklist.length > 0) {
			var html = "";
			for(var i = 0; i < tasklist.length; i++) {
				var taskcp = tasklist[i].state == 'complete' ? 'taskcp' : '';
				html += "<li onblur='taskliBlur(this,event)' ondblclick='addOrEditTask(this, event)' data-hasetask='true' class='taskblock  " + taskcp + "' data-localid='" + tasklist[i].localid + "' onclick='taskClick(this)'><div class='taskcontent' >" + tasklist[i].content + "</div><div data-show='false' class='btns'>\
							<ul>\
								<li class='complete '  onclick='taskSuccess(this,event)' data-taskstate='false'>完成</li>\
								<li class='delete ' onclick='taskDelete(this,event)'>删除</li>\
							</ul>\
						</div></li>";
			}
			var max = 0;
			if(tasklist.length <= 12) {
				max = 12 - tasklist.length;
			} else {
				max = Math.ceil(tasklist.length / 4) * 4;
			}
			for(var n = 0; n < max; n++) {
				html += "<li onblur='taskliBlur(this,event)' ondblclick='addOrEditTask(this, event)' data-hasetask='false' class='taskblock tasknullbg' onclick='taskClick(this)'><div class='taskcontent' ></div><div data-show='false' class='btns'>\
							<ul>\
								<li class='complete '  onclick='taskSuccess(this,event)' data-taskstate='false'>完成</li>\
								<li class='delete ' onclick='taskDelete(this,event)'>删除</li>\
							</ul>\
						</div></li>";
			}
			return html;
		} else {
			var html = "";
			for(var i = 0; i < 12; i++) {
				html += "<li onblur='taskliBlur(this,event)' ondblclick='addOrEditTask(this, event)' data-hasetask='false' class='taskblock tasknullbg' onclick='taskClick(this)'><div class='taskcontent' ></div><div data-show='false' class='btns'>\
							<ul>\
								<li class='complete '  onclick='taskSuccess(this,event)' data-taskstate='false'>完成</li>\
								<li class='delete ' onclick='taskDelete(this,event)'>删除</li>\
							</ul>\
						</div></li>";
			}
			return html;
		}
	}
}
//检测服务器连接状态
function checkNET(c) {
	var callback = function() {
		$('#serverstate').text('已连接到服务器');
		$('#serverstate').css('color', '#4D89C1');
		window.serverState = true;
	}
	var ecallback = function() {
		$('#serverstate').text('与服务器失去联系');
		$('#serverstate').css('color', '#ff0000');
		window.serverState = false;
	}
	if(c != null) {
		$.ajax({
			type: 'POST',
			url: window.NS.servertable.base+"/checknet?time=" + getLocalId(),
			data: {},
			dataType: "text",
			cache: false,
			async: true,
			success: function(obj) {
				callback(obj);
				window.serverErr=false;
				window.msg.console('[同步]>>30S后再次尝试同步....');
				setTimeout(function(){
					window.serverErr=true;
					window.msg.console('[同步]>>同步锁打开.');
				},30*1000);
				window.msuo = true; //这个锁怎么都得放开了
			},
			error: function(obj) {
				ecallback(obj);
				window.msuo = true;
				
			},
		})
	} else {
		ajaxPackage(window.NS.servertable.base+"/checknet?time=" + getLocalId(), "Post", {}, "text", false, callback, ecallback);
	}

}
$(function() {
		checkNET();
		window.serverStateTimer = setInterval(function() {
			checkNET();
		}, 60000);
	})
	//服务器管理类
function NetServer() {
	//获取地址列表的地址
	 var addressListTable='http://www.shellcandy.cn/reportfucker';
	//服务器地址列表
	this.servertable = {
		base: 'http://127.0.0.1:8888',
		login: 'login',
		regist: 'regist',
		editpass: 'editpass',
		logout: 'logout',
		getListByDate: 'getListByDate',
		getSetInfo: 'getSetInfo',
		setEmailInfo: 'setEmailInfo',
		testEmail: 'testEmail',
		setReportTimer: 'setReportTimer',
		addAutoTask: 'addAutoTask',
		setAutoSend: 'setAutoSend',
		getAutoTask:'getAutoTask',
		deleteAutoTask: 'deleteTcTask',
		deleteTcTask:'deleteTcTask',
		addTask: 'addTask',
		deleteTask: 'deleteTask',
		updateTask: 'updateTask',
	};
		//保存addressListTable
	var saveAddressTable=function(list){
		localStorage.AddressTable= JSON.stringify(list);
	}
	//获取addressListTable
	var getAddressTable=function(){
		try {
				var list=JSON.parse(localStorage.AddressTable);
				if(list==null){
					return null;
				}else{
					return list;
				}
			} catch(error) {
				return null;
			}
	}
	//加载机制
	if(getAddressTable()!=null){
		this.servertable=getAddressTable();
	}else{
		saveAddressTable(this.servertable);
	};
	//从服务器加载地址表
	var getaddress=function(){
			var data = {};
			var success=function(obj){
						if(obj!=null){
							if(obj.state=='success'&&obj.table!=null){
								saveAddressTable(obj.table);
								this.servertable=obj.table;
							}
					}
			}
			ajaxPackage(addressListTable, "POST", data, "json", false, success,function(){});
	};
	getaddress();

	//登录
	this.login = function(param, success, warn) {
			var address = this.servertable.base + '/' + this.servertable.login;
			var data = {
				name: param.name,
				pass: param.pass,
			};
			var success=function(obj){
				if(obj!=null){
					if(obj.state=='success'&&obj.key!=null){
						window.DB.setKey(obj.key);
					}else{
						if(obj.msg){
							window.msg.show(obj.msg);							
						}else{
							window.msg.show('登陆失败!');
						}
					}
				}
				window.msuo = true; //释放锁
				window.LocalTaskList.shift();
			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//注册
	this.regist = function(param, success, warn) {
			var address = this.servertable.base + '/' + this.servertable.regist;
			var data = {
				name: param.name,
				pass: param.pass,
				email: param.email,
			}
			var success=function(obj){
				if(obj!=null){
					if(obj.state=='success'){
						if(obj.msg){
							window.msg.show(obj.msg);							
						}			
					}else{
						if(obj.msg){
							window.msg.show(obj.msg);							
						}else{
							window.msg.show('注册失败!');
						}
					}
				}
			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//修改密码
	this.editpass = function(param) {
			var address = this.servertable.base + '/' + this.servertable.editpass;
			var data = {
				key:window.DB.getKey(),
				oldpass: param.oldpass,
				newpass: param.pass,
			}
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.msg) {
						window.msg.show('密码修改成功!');
					}
				}else{
					if(obj.msg) {
						window.msg.show(obj.msg);
					}
				}
			}
			var warn = function(obj) {
				window.msg.show('修改密碼失敗啦,看看是不是網斷掉了!');
			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//退出登录
	this.logout = function() {
			var address = this.servertable.base + '/' + this.servertable.logout;
			var data = {
				key:window.DB.getKey()
			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.msg) {
						window.msg.show(obj.msg);
					}
					//无论退出成功与否,都会将本地的登陆状态删除
					window.DB.saveStorage(null);
					window.DB.setKey('');
					window.DB.saveTaskList([]);
					//隐藏当前页面,跳回登陆页
					
				}
			}   
			window.DB.setKey('');
			location.reload();
			var warn = function(obj) {
				window.msg.show('退出失败,天了噜!');
			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//获取某个日期的任务列表
	this.getListByDate = function(param,tsuc) {
			var address = this.servertable.base + '/' + this.servertable.getListByDate;
			var data = {
				key:window.DB.getKey(),
				date: param.date,
			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.data) {
						tsuc(obj);
						
					}
				}else{
					if(obj.msg!=null){
						window.msg.show(obj.msg);
					}else{
						window.msg.show('获取日期请求失败!');
					}
					
				}
			}
			var warn = function(obj) {

			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//获取设置信息
	this.getSetInfo = function() {
			var address = this.servertable.base + '/' + this.servertable.getSetInfo;
			var data = {
				key:window.DB.getKey(),
			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.data) {
						if(obj.data.name) {
							$("#st-username").text(obj.data.name);
							window.msg.console('['+obj.data.name+']: 用户已登入!');
						}
						if(obj.data.useremail) {
							$("#st-myemail").val(obj.data.useremail);
						}
						if(obj.data.emailserver) {
							$("#st-myemailaddress").val(obj.data.emailserver);
						}
						if(obj.data.reciveaddress) {
							$("#st-reciveaddress").val(obj.data.reciveaddress);
						}
						if(obj.data.autosend != null) {
							if(obj.data.autosend) {
								$('#radio-autosend').attr('checked', 'checked');
								$('#stateautosend').text('开启');
							} else {
								$('#radio-closesend').attr('checked', 'checked');
								$('#stateautosend').text('关闭');
							}
						}
						if(obj.data.sendfrequency) {
							if(obj.data.sendfrequency == 'day') {
								$('#radio-day').attr('checked', 'checked');
								$('.atuo-day').show();
								$('.atuo-week').hide();
							}
							if(obj.data.sendfrequency == 'week') {
								$('#radio-week').attr('checked', 'checked');
								$('.atuo-day').hide();
								$('.atuo-week').show();
							}

						}
						if(obj.data.sendday) {
							$('#select-day').val(obj.data.sendday);

						}
						if(obj.data.sendhour) {
							$('.select-hour').val(obj.data.sendhour);

						}
						if(obj.data.sendmine) {

							$('.select-mine').val(obj.data.sendmine);
						}

					}
				}
			}
			var warn = function(obj) {

			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//设置邮箱信息
	this.setEmailInfo = function(param) {
			var address = this.servertable.base + '/' + this.servertable.setEmailInfo;
			var data = {
				key:window.DB.getKey(),
				userpass: param.userpass,
				emailserver: param.emailserver,
				reciveaddress: param.reciveaddress,
				useremail: param.useremail,
			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.msg!=null){
						window.msg.show(obj.msg);
						window.NS.getSetInfo();
					}
				} else {
					window.msg.show('邮箱设置失败!天啦噜!');
				}
			}
			var warn = function(obj) {

			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//测试邮箱状态
	this.testEmail = function() {
			var address = this.servertable.base + '/' + this.servertable.testEmail;
			var data = {
				key:window.DB.getKey(),
			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.msg) {
						window.msg.show(obj.msg);
					}
				}
			}
			var warn = function(obj) {
						window.msg.show('网络不通!请稍后再试!');
			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//设置报周期及频率
	this.setReportTimer = function(param) {
			var address = this.servertable.base + '/' + this.servertable.setReportTimer;
			var data = {
				key:window.DB.getKey(),
				sendfrequency: param.sendfrequency,
				sendday: param.sendday,
				sendhour: param.sendhour,
				sendmine: param.sendmine,
				autosend:param.autosend,
			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.msg) {
						if(obj.msg) {
							window.msg.show(obj.msg);
						}
						window.NS.getSetInfo();
					}
				}
			}
			var warn = function(obj) {
				window.msg.show('网络不通!请稍后再试!');
			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//设置报表自动发送开关
//	this.setAutoSend = function(param) {
//			var address = this.servertable.base + '/' + this.servertable.setAutoSend;
//			var data = {
//				autosend: param.autosend,
//			};
//			var success = function(obj) {
//				if(obj.state == 'success') {
//					if(obj.msg) {
//						window.msg.show('设置成功');
//					}
//				}
//			}
//			var warn = function(obj) {
//
//			}
//			ajaxPackage(address, "Post", data, "json", false, success, warn);
//		}
		//增加自动回复
	this.addAutoTask = function(param) {
			var address = this.servertable.base + '/' + this.servertable.addAutoTask;
			var data = {
				key:window.DB.getKey(),
				content: param.content,
			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.msg) {
						window.msg.show('添加成功');
						
						window.NS.getAutoTask();
					}
				}else{
					if(obj.msg) {
						window.msg.show('添加失败');
					}
				}
			}
			var warn = function(obj) {

			} 
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
	//获取自动填充任务
	this.getAutoTask=function(param){
		var address = this.servertable.base + '/' + this.servertable.getAutoTask;
			var data = {
				key:window.DB.getKey(),
			};
			var success = function(obj) {
				if(obj.state == 'success') {
						if(obj.data) {
							if(obj.data.length > 0) {
								var html = '';
								for(var i = 0; i < obj.data.length; i++) {
									var node = obj.data[i];
									html += '<tr data-id="' + node.id + '">\
								<td>' + node.content + '</td>\
								<td><span onclick="deleteAutoTask(this)" data-tctaskid="'+node.id+'"  class="fa fa-close btn-swing"></span></td>\
								</tr>';
								}
								$('#tianchongsetter').html(html);
							}else{
								var html = '<tr >\
								<td>没有数据</td>\
								<td><span  class="fa fa-close btn-swing"></span></td>\
								</tr>';
								$('#tianchongsetter').html(html);
							}
							
						}
				}
			}
			var warn = function(obj) {

			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
	}
		//删除自动增加任务
	this.deleteAutoTask = function(param) {
			var address = this.servertable.base + '/' + this.servertable.deleteAutoTask;
			var data = {
				id: param.id,
				key:window.DB.getKey(),
			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.msg) {
						window.msg.show(obj.msg);
						window.NS.getAutoTask();
					}
				}else{
					if(obj.msg) {
						window.msg.show('删除失败');
					}else{
						window.msg.show('删除失败');
					}
				}
			}
			var warn = function(obj) {

			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//增加任务
	this.addTask = function(param, tsuccess, warn) {
			var address = this.servertable.base + '/' + this.servertable.addTask;
			var data = {
				key:window.DB.getKey(),
				date: param.date,
				content: param.content,
				state: param.state,
				localid: param.localid,
			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.msg) {
						window.msg.console('[SERVER]:'+obj.msg);
					}
					if(obj.taskid){
						window.DB.updateTask(window.TM.curdate,{
							id:obj.taskid,
							localid:obj.localid,
						});
						//为操作队列中没有id的任务增加id
						if(window.LocalTaskList.length>0){
							for(var i=0;i<LocalTaskList.length;i++){
								if(LocalTaskList[i].param.localid==obj.localid){
									LocalTaskList[i].param.taskid=obj.taskid;
									window.DB.saveTaskList(window.LocalTaskList);
								}
							}
						}
					}
					tsuccess();
				}else{
					if(obj.msg) {
						window.msg.console('添加失败');
					}else{
						window.msg.console('添加失败');
					}
				}
			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//删除任务
	this.deleteTask = function(param, success, warn) {
			var address = this.servertable.base + '/' + this.servertable.deleteTask;
			var data = {
				key:window.DB.getKey(),
				date: param.date,
				localid: param.localid,
				id:param.id,
			};
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//更新任务
	this.updateTask = function(param, success, warn) {
		var address = this.servertable.base + '/' + this.servertable.updateTask;
		var data = {
			key:window.DB.getKey(),
			date: param.date,
			content: param.content,
			state: param.state,
			localid: param.localid,
			id:param.id,
		};
		ajaxPackage(address, "Post", data, "json", false, success, warn);
	}

}

//弹窗消息类
function Message() {
	//提示消息
	this.show = function(str) {
		alert(str);
	}
	//指令控制台
	this.console=function(str){
		if(window.running){
			window.running=false;
			window.KZ.speak();
			setTimeout(function(){window.running=true},3000);
		}
		$('#log').append(str+'\n');
		var node=$('#log')[0];
		node.scrollTop=node.scrollHeight;
	}
}

//设置部分
$(function() {
		$('input[name=sendtime]').change(function() {
			if($(this).attr('data-time') == 'day') {
				$('.atuo-day').show();
				$('.atuo-week').hide();
			}
			if($(this).attr('data-time') == 'week') {
				$('.atuo-day').hide();
				$('.atuo-week').show();
			}
		});

		//填充设置页面信息
		window.NS.getSetInfo();
		window.NS.getAutoTask();
		//綁定退出按鈕
		$('#btn-layout').click(function() {
			if(confirm('确认要退出吗?(重要:退出会清除本地缓存的一切信息,如果有离线进行操作,请连接网络自动进行同步,防止信息丢失!)')){
				window.NS.logout();
				window.DB.saveStorage(null);
				window.DB.setKey('');
				window.DB.saveTaskList([]);
			}
		});
		//綁定修改密碼
		$("#btn-editpass").click(function() {
			var oldpass = $('#input-oldpass').val();
			var newpass = $('#input-newpass').val();
			window.NS.editpass({
				'oldpass': oldpass,
				'pass': newpass,
			});
		});
		//設置郵箱
		$('#btn-setemail').click(function() {
			window.NS.setEmailInfo({
				userpass: $('#st-myemailpass').val(),
				emailserver: $('#st-myemailaddress').val(),
				reciveaddress: $('#st-reciveaddress').val(),
				useremail: $('#st-myemail').val(),
			});
		});
		//测试邮箱
		$('#btn-testemail').click(function() {
			window.NS.testEmail();
		});


		//设置发动时间
		$('#btn-dateset').click(function() {
			var sf = $('input[name=sendtime]:checked').attr('data-time');
			var day, hour, mine,tautosend;
			if(sf == 'day') {
				hour = $('#sl-day-h').val();
				mine = $('#sl-day-m').val();
				if($('#radio-autosend')[0].checked) {
					tautosend=true;
				}
				if($('#radio-closesend')[0].checked) {
					tautosend=false;
				}
				window.NS.setReportTimer({
					sendfrequency: sf,
					sendday: '',
					sendhour: hour,
					sendmine: mine,
					autosend:tautosend,
				});
			}
			if(sf == 'week') {
				day = $('#sl-week-d').val();
				hour = $('#sl-week-h').val();
				mine = $('#sl-week-m').val();
					if($('#radio-autosend')[0].checked) {
					tautosend=true;
				}
				if($('#radio-closesend')[0].checked) { 
					tautosend=false;
				}
				window.NS.setReportTimer({
					sendfrequency: sf,
					sendday: day,
					sendhour: hour,
					sendmine: mine,
					autosend:tautosend,
				});
			}

		});
		//添加自动填充设置
		$('#btn-addAutoTask').click(function() {
			var str = $('#autotask').val();
			 $('#autotask').val('');
			if(str != null && str.length > 0) {
				window.NS.addAutoTask({
					content: str,
				});
			} else {
				window.msg.show('还没写东西呢!');
			}
		});
	})
	//删除自动填充设置
function deleteAutoTask(mythis) {
	window.NS.deleteAutoTask({
		id: $(mythis).attr('data-tctaskid')
	});
}

//任务执行器
$(function() {
	window.msuo = true; //防止任务时序冲突的锁
	window.TaskServerTimer = setInterval(function() {
		if(window.msuo && window.serverState && window.serverErr) {
			
			if(window.LocalTaskList.length > 0) {
				window.msg.console('尝试同步操作...');
				window.msuo = false; //加锁
				var node = window.LocalTaskList[0];
				if(node.com == 'createTask') {
					window.msg.console('[同步]>>创建任务');
					window.NS.addTask({
						date: node.param.date,
						content: node.param.content,
						state: node.param.state,
						localid: node.param.localid,
					}, function(obj) {
						window.msuo = true; //释放锁
						window.LocalTaskList.shift();
						window.msg.console('[同步]>>创建任务成功');
					}, function(obj) {
						if(obj.statusText == "error") {
							window.msg.console('[同步]>>创建任务失败');
							checkNET('tb'); 
						}
						
					});
				}
				if(node.com == 'deleteTask') {
					window.msg.console('[同步]>>删除任务');
					window.NS.deleteTask({
						date: node.param.date,
						id:node.param.taskid,
						localid: node.param.localid,
					}, function(obj) {
						window.msuo = true; //释放锁
						window.LocalTaskList.shift();
						window.msg.console('[同步]>>删除任务成功');
					}, function(obj) {
						if(obj.statusText == "error") {
							window.msg.console('[同步]>>删除任务失败');
							checkNET('tb'); 
						}
						
					});
				}
				if(node.com == 'updateTask') {
					window.msg.console('[同步]>>更新任务');
					window.NS.updateTask({
						date: node.param.date,
						content: node.param.content,
						state: node.param.state,
						localid: node.param.localid,
						id:node.param.taskid,
					}, function(obj) {
						window.msuo = true; //释放锁
						window.LocalTaskList.shift();
						window.msg.console('[同步]>>更新任务成功');
					}, function(obj) {
						if(obj.statusText == "error") {
							window.msg.console('[同步]>>更新任务失败');
							checkNET('tb');
						}
						
					});
				}
			}
		}
	}, 800);
})

//任务队列缓存机制
setInterval(function(){

		window.DB.saveTaskList(window.LocalTaskList);
	
},5);

//kaizen动画
function KaiZen(){
	
	//图片标签id
	var id='kaizenimg';
	//动画队列
	var tasklist=[];
	//表情队列
	var facetable={
		'静默上斜眼':'Kaizen_Silent_AITyping.png',
		'静默闭眼':'Kaizen_Silent_EyesClosed.png',
		'静默睁眼':'Kaizen_Silent_Normal.png',
		'伤心下斜眼':'Kaizen_Silent_Sad_EyesBottomRight.png',
		'伤心正眼':'Kaizen_Silent_Sad_EyesMid.png',
		'说话上斜眼':'Kaizen_Talking_AITyping.png',
		'说话闭眼':'Kaizen_Talking_EyesClosed.png',
		'说话下斜眼':'Kaizen_Talking_PlayerTyping.png',
		'说话伤心右斜眼':'Kaizen_Talking_Sad_EyesBottomRight.png',
		'说话伤心正眼':'Kaizen_Talking_Sad_EyesMid.png',
		'生气':'Kaizen_Transition_Anger.png',
		'说话睁眼':'Kaizen_Transition_Stress.png',
		'高兴':'Kaizen_Transition_Trust.png'
	};
	//kaizen说话
	this.speak=function(){
		var list=[
			'说话睁眼',
			'说话睁眼',
			'说话睁眼',
			'说话睁眼',
			'说话睁眼',
			'说话睁眼',
			'说话上斜眼',
			'说话上斜眼',
			'说话上斜眼',
			'说话下斜眼',
			'说话下斜眼',
			'说话下斜眼',
			'说话睁眼',
			'说话睁眼',
			'说话睁眼',
			'说话睁眼',
			'静默睁眼',
		];
		for(var i=0;i<list.length;i++){
			tasklist.push(list[i]);
		}
		
	}
	setInterval(function(){
			if(tasklist.length>0){
				var src=tasklist.shift();
				var str='img/kaizen/'+facetable[src];
				$('#'+id).attr('src',str);
			}
	},200);
	//每隔一段时间添加几个动画进入队列
	setInterval(function(){
		var list=[
			'静默睁眼',
			'静默闭眼',
			'静默睁眼',
			'静默睁眼',
			'静默睁眼',
			'静默睁眼',
			'静默上斜眼',
			'静默上斜眼',
			'静默上斜眼',
			'静默上斜眼',
			'静默上斜眼',
			'静默上斜眼',
			'静默上斜眼',
			'静默上斜眼',
			'静默上斜眼',
			'静默上斜眼',
			'静默睁眼',
			'静默睁眼',
			'静默闭眼',
			'静默睁眼',
			'静默睁眼',
			'静默睁眼',
			'说话下斜眼',
			'说话下斜眼',
			'说话下斜眼',
			'说话下斜眼',
			'说话下斜眼',
			'说话下斜眼',
			'说话下斜眼',
			'静默睁眼',
			'静默睁眼',
			'静默闭眼',
			'静默睁眼',
			'静默睁眼',
			
		];
		for(var i=0;i<list.length;i++){
			tasklist.push(list[i]);
		}
	},60*1000);
	
	setInterval(function(){
		var list=[
			'静默睁眼',
			'静默闭眼',
			'静默睁眼',
		];
		for(var i=0;i<list.length;i++){
			tasklist.push(list[i]);
		}
	},5*1000);
	
	
	setInterval(function(){
		var list=[
			'高兴',
			'高兴',
			'高兴',
			'高兴',
			'高兴',
			'高兴',
			'高兴',
			'高兴',
			'高兴',
			'高兴',
			'高兴',
			'高兴',
			'高兴',
			'静默睁眼',
		];
		for(var i=0;i<list.length;i++){
			tasklist.push(list[i]);
		}
	},5*60*1000);
	
	
}
