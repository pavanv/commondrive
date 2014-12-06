var Lock = function () {

    return {
        //main function to initiate the module
        init: function () {

             $.backstretch([
		        "/static/metronic_1.5.5/admin/img/bg/1.jpg",
		        "/static/metronic_1.5.5/admin/img/bg/2.jpg",
		        "/static/metronic_1.5.5/admin/img/bg/3.jpg",
		        "/static/metronic_1.5.5/admin/img/bg/4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		      });
        }

    };

}();
