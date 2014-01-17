var express		= require("express"),
	request		= require("request"),
	md5			= require("MD5"),

	app			= express();

// configure Express
app.configure(function() {
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.session({
		secret: "keyboard cat yo - publisher test"
	}));
	
	app.use(express.static("./public"));
});


//Be kell tudniuk a partnereknek allitani, hogy mennyi legyen a token eletbenmaradasi ideje, hogy szinkronban legyen a cucc a mienkkel.

function killToken(req, res, next) {
	console.log("kill token");
}

app.post("/token", function(req, res) {
	//ker egy tokent az edm szervertol.
	// - kuldeni kell a kliens ip cimet, sajat azonositojat + egy idobelyeget
	// - kuldeni kell egy md5 saltot, ami a sajat azonositobol, egy idobelyegbol, ip cimbol + egy titkos kulcsbol all.
	console.log("sending token...");

	var publicId = "TEST_API_KEY";
	var magic = "It's a kind of magic.";

	console.log("handshaking");

	var ip = req.connection.remoteAddress;
	var timestamp = new Date().getTime();

	var hash = md5(publicId + ip + timestamp + magic);

	request.post(
		"http://localhost:3000/api/token",
		{
			form: {
				id: publicId,
				uid: req.query.userId,
				ip: ip,
				ts: timestamp,
				hash: hash
			}
		},
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
				res.send(body);
			} else {
				console.log("WTF");
				res.send(error);
			}
		}
	);
});

app.listen(3001, function() {
	console.log('Express server listening on port 3001');
});
