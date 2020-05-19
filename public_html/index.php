<?php include('header.php') ?>
<?php include('data.php') ?>

<div class="title text-center">CRUD Demo</div>
<ul id="todo-list" class="list-unstyled mb-0 mx-auto">
	<!-- <li class="d-flex align-items-center">
		<input class="mr-4" type="checkbox">
		<div class="content">todo item</div>
		<button class="btn delete" data-action="delete">x</button>
	</li>
	<li class="d-flex align-items-center">
		<input class="mr-4" type="checkbox">
		<div class="content">todo item</div>
		<button class="btn delete" data-action="delete">x</button>
	</li>
	<li class="d-flex align-items-center">
		<input class="mr-4" type="checkbox">
		<div class="content">todo item</div>
		<button class="btn delete" data-action="delete">x</button>
	</li> -->
	<li class="new d-flex align-items-center">
		<input class="mr-4" type="checkbox">
		<div class="content" contenteditable="true"></div>
	</li>
</ul>

<script id="todo-list-template" type="text/x-handlebars-template">
	<li data-id="{{id}}" class="d-flex align-items-center {{#if is_complete}}complete{{/if}}">
		<input class="mr-4" type="checkbox">
		<div class="content">{{content}}</div>
		<button class="btn delete" data-action="delete">x</button>
	</li>
</script>

<?php include('footer.php') ?>