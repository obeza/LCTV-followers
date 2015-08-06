
(function(){
	
console.log('func ');


	var app = {
		followers :{},
		url: "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&q=https://www.livecoding.tv/rss/obez/followers/?key=BGsuKYxWYBcXw3pB",
		loadFollowers: 	function (){
							var promise = new Promise( function (result, rej){


								var request = new XMLHttpRequest();
								request.open('GET', app.url, true);

								request.onload = function() {
								  if (request.status >= 200 && request.status < 400) {
								    // Success!
								    var data = JSON.parse(request.responseText);
								    //console.log('data ' + JSON.stringify(data) );
								    data = data.responseData.feed.entries;
									var dernier = data.pop();
									dernier = dernier.title;
									var dataCheck = {
									    nb:data.length,
									    dernier:dernier
									};
									result(dataCheck);
								  } else {
								    // We reached our target server, but it returned an error

								  }
								};

								request.onerror = function() {
								  // There was a connection error of some sort
								};

								request.send();
	
							});

							return promise;
	
		},
		notifPermission : function(){
			Notification.requestPermission();
		},
		notifEnvoyer : function(nom){	
			var audio = new Audio('austin_yeahbaby.wav');
				audio.play();		
			var options = {
			      body: "Bienvenue au nouveau follower !!! \nTotal : " + app.followers.total,
			      icon: "powers.jpg"
			  }
			var notification = new Notification( nom, options);

			var fermer = setTimeout(function(){
				notification.close();
			}, 5000);
		},
		check:function(){
			setInterval(function(){
				app.loadFollowers().then( function(data){
					if ( data.nb > app.followers.total ){
						app.notifEnvoyer(data.dernier);
					}
					console.log("check");
				});
			}, 10000);
		},
		init: function(){
				app.notifPermission();
				app.loadFollowers().then(function(data){
					//console.log('data ' + data);
					app.followers.total = data.nb;
					app.followers.dernier = data.dernier;
					app.check();
				});
			
		}


	}

	app.init();

})();

