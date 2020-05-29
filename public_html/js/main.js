$(document).ready(function(){
	var source = $("#todo-list-template").html();
	var template = Handlebars.compile(source);

	
	
	//Read, prepare all todo list items
	var todoTemplateUI = '';
	$.each($todos, function(index, content){
		html= template(content);
		todoTemplateUI= todoTemplateUI+html;
	});
	$('li.new').before(todoTemplateUI);
	$('.complete').find('input').prop('checked', true);

	//way 2
	// var todoTemplateUI='';
	// $.post('data.php', {}, function (data,textStatus, xhr){
	// 	// console.log('1');
	// 	$.each(data, function (index, object){
	// 		html = template(object);
	// 		todoTemplateUI = todoTemplateUI+html;
	// 	});
	// 	// console.log('2');
	// 	$('li.new').before(todoTemplateUI);
	// }, 'json');
	// // console.log('3');
	// $('.complete').find('input').prop('checked', true);

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
	
	function set_cursor_last(obj) {
		let item = window.getSelection();
		item.selectAllChildren(obj);
		item.collapseToEnd();
	}
	//Update enter editor mode
	$('#todo-list').on('dblclick', '.content', function (e){
		$(this).prop('contenteditable', 'true').focus();
		set_cursor_last(this);
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
