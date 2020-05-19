$(document).ready(function(){
	var source = $("#todo-list-template").html();
	var template = Handlebars.compile(source);
	
	//定位div(contenteditable = "true")
	//方法一:
	// function set_pos_last(obj) {
	// 	var range = window.getSelection();//創建range
	// 	range.selectAllChildren(obj);//range 選擇obj下所有子內容
	// 	range.collapseToEnd();//光標移至最后
	// }
	//方法二:
	function po_Last_Div(obj) {
		if (window.getSelection) {//ie11 10 9 ff safari
			obj.focus(); //解决ff不獲取焦點無法定位问题
			var range = window.getSelection();//創建range
			range.selectAllChildren(obj);//range 選擇obj下所有子内容
			range.collapseToEnd();//光標移至最后
		}
		else if (document.selection) {//ie10 9 8 7 6 5
			var range = document.selection.createRange();//創建選擇对象
			//var range = document.body.createTextRange();
			range.moveToElementText(obj);//range定位到obj
			range.collapse(false);//光標移至最后
			range.select();
		}
	}

	//Read, prepare all todo list items
	var todoTemplateUI = '';
	$.each($todos, function(index, content){
		html= template(content);
		// console.log(typeof html);
		todoTemplateUI= todoTemplateUI+html;
	});
	$('.new').before(todoTemplateUI);
	$('.complete').find('input').prop('checked', true);
	
	//Create
	$('#todo-list').on('blur', '.content', function (e){
		var isNew = $(e.currentTarget).closest('li').is('.new');
		
		if(isNew){
			var todo = $(e.currentTarget).text().trim();
			var order = $('#todo-list').find('li:not(.new)').length+1

			if(todo.length >0){
				//AJAX create
				$.post('todo/create.php', {content: todo, order:order}, function (data,textStatus, xhr){
					var context = {id: data.id, content:todo, is_complete:0};
					var li = template(context);

					$(e.currentTarget).closest('li').before(li);
				}, 'json');
			}
			$(e.currentTarget).empty();
		}
		else{
			//AJAX update
			var id = $(e.currentTarget).closest('li').data('id');
			var todo = $(e.currentTarget).text();
			$.post('todo/update.php', {id:id, content:todo});
			$(e.currentTarget).prop('contenteditable', false);
		}
	});
	

	//Update enter editor mode
	$('#todo-list').on('dblclick', '.content', function (e){
		$(this).prop('contenteditable', 'true').focus();
		po_Last_Div(this);
	});

	//Delete
	$('#todo-list').on('click', '[data-action="delete"]', function (e){
		var result = confirm('Are you sure you want to delete?');
		var id = $(this).closest('li').data('id');
		var li = $(this).closest('li');

		if(result){
			//AJAX delete, prepare id to php to remove
			$.post('todo/delete.php', {id: id}, function (data,textStatus, xhr){
				li.remove();
			}, 'json');	
		}
	})

	//complete
	$('#todo-list').on('click','[type="checkbox"]', function (e){
		var id = $(this).closest('li').data('id');
		var li = $(this).closest('li');
		//AJAX prepare id to php change complete state
		$.post('todo/complete.php', {id: id}, function (data,textStatus, xhr){
			li.toggleClass('complete');
		}, 'json');
	});

	//sort
	$('#todo-list').sortable({
		items: 'li:not(.new)',
		// cancel:'[contenteditable]' //sortable and contenteditable can't work together
		stop: function (){
			//get each id and give new order to php 
			orderPair =[];

			$('#todo-list').find('li:not(.new)').each(function (index, li){
				var id =$(li).data('id');
				var order = index+1;
				
				orderPair.push({
					id:id,
					order:order
				});
			});

			//AJAX
			$.post('todo/sort.php', {orderPair: orderPair});
		}
	});
	
});
