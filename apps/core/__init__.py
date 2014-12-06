<html>
	<head>
		<script src="jquery/jquery.js" type="text/javascript"></script>
		<link href="bootstrap/css/bootstrap.css" rel="stylesheet">
		<link href="bootstrap/css/bootstrap-theme.css" rel="stylesheet">
		<script src="polymer/components/webcomponentsjs/webcomponents.js"></script>
  		<script src="bootstrap/js/bootstrap.js" type="text/javascript"></script>
  		
  		<link rel="import"  href="polymer/components/core-header-panel/core-header-panel.html">
		<link rel="import"  href="polymer/components/core-toolbar/core-toolbar.html">
		<link rel="import"  href="polymer/components/paper-tabs/paper-tabs.html">

		<style>
			core-header-panel {
			  height: 10%;
			  overflow: auto;
			  -webkit-overflow-scrolling: touch;
			}
			core-toolbar {
			  background: #03a9f4;
			  color: white;
			}
			.full-width {
			  width: 100%;
			  margin: 0;
			  -webkit-user-select: none;
			  -moz-user-select: none;
			  -ms-user-select: none;
			  user-select: none;
			  text-transform: uppercase;
			}
		</style>
	</head>
	<body>
		<core-header-panel>
			<core-toolbar>
				<paper-tabs class="full-width" selected="configuration" self-end>
					<paper-tab name="configuration">Configuration</paper-tab>
					<paper-tab name="list">List</paper-tab>
				</paper-tabs>
			</core-toolbar>
		</core-header-panel>
		
		
	</body>
</html>