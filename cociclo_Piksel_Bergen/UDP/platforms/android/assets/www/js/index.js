////////////////////////////////////////////////////////////////////////////////////////////////////////
//  lecture d'une valeur du ADC du esp8266                                                            //
//  plugin : npm i cordova-plugin-chrome-apps-sockets-tcp                                             //
//  cordova plugin add cordova-plugin-chrome-apps-sockets-tcp                                         //
//  code arduino : esp8266_server                                                                     //
//  https://github.com/evothings/evothings-examples/blob/master/examples/esp8266/esp8266/esp8266.ino  //
//  utilities : coolTerm (OSX), SocketTest3                                                           //
////////////////////////////////////////////////////////////////////////////////////////////////////////

delToggle = true; // declare et initialise une variable globale
//socketId;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
        ////////// pour ios, pas de 'onClick' //////////////////////////////////////////
        
         document.getElementById('ouibutton').addEventListener('touchend', connexion, false);
         document.getElementById('nobutton').addEventListener('touchend', deconnecte, false);
         document.getElementById('UDP').addEventListener('touchend', UDP, false);
         document.getElementById('horloge').addEventListener('touchend', horloge, false);
        
        ////////////////////////////////////////////////////////////////////////////////
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        alert('Received Event: ' + id);
       
        // ?? voir si je peux enlever tout ??a ...
        
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');     
    }
};

//////////////////////////////////////////////////////////////////////////////////////
//                         Ouvrir la connexion avec le esp8266                      //
//////////////////////////////////////////////////////////////////////////////////////
function connexion(){   
    
            var IPa = document.getElementById("IPAddress").value;
            chrome.sockets.udp.create({}, function(createInfo) 
            {
            socketId = createInfo.socketId;
            // Setup event handler and bind socket.
            chrome.sockets.udp.onReceive.addListener(receiveListener); // pour la valeur de retour
            adresseIP = IPa;
            var PORT = 2390;
            chrome.sockets.udp.bind(socketId,'0.0.0.0',0,onConnectedCallback);      
            });
                   
        function onConnectedCallback(result) {
	          
            if (result == 0) {
              alert('Connecte par UDP a : ' + adresseIP);   
    
                document.getElementById("debut").style.display = "none";
                document.getElementById("connecte").style.display = "block";
                document.getElementById("controle").style.display = "block";
        
                }
            else {
                alert('Failed to connect to ' + adresseIP);
                }
        }
    }

/////////////////////////////////////////////////////////////////////////////////////////
//                               Appels automatiques                                   //
/////////////////////////////////////////////////////////////////////////////////////////

function horloge(){
    
    myVar = setInterval(UDP, 75);  // appelle la fonction UDP() ?? chaque 75 ms

    }
/////////////////////////////////////////////////////////////////////////////////////////
//                              Demande le data au huzzah                              //       
/////////////////////////////////////////////////////////////////////////////////////////

function UDP(){
    // il faudrait faire une v??rification que socketid n'existe pas
    sendString = 'valeurSVP';
   // alert('soquette UDP : ' + socketId);
   //alert('on arrive');
    //alert(adresseIP);
      // chrome.sockets.udp.send(socketId,stringToBuffer(sendString),'192.168.0.104',2390,
       chrome.sockets.udp.send(socketId,stringToBuffer(sendString),adresseIP,2390,
		function(sendInfo) {
			if (sendInfo.resultCode < 0) {
				alert('Failed to send data')
			}
        });
    ////alert('envoi reussi');
    }

//////////////////////////////////////////////////////////////////////////////////////////
//              chrome.sockets.tcp.onReceive.addListener(function callback)             //
//                 est-ce qu'on re??oit quelque chose?                                   //
//////////////////////////////////////////////////////////////////////////////////////////

function receiveListener(info) {
    
    //alert('Recv from socket: ');
    CO = bufferToString(info.data); // est un ArrayBuffer
    //alert(CO); 
    document.getElementById("contaminacion").innerHTML = CO;  
    
    var canvas = document.getElementById("monCanvas");
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle="#af6767";
            ctx.fillRect(0,0,30,90);
            ctx.font = "30px Arial";
            ctx.fillStyle ="#765353";
            ctx.fillText(CO,10,50);
}

//////////////////////////////////////////////////////////////////////////////////////////
//                              Conversions de ArrayBuffer                              // 
//////////////////////////////////////////////////////////////////////////////////////////

function stringToBuffer(string){

	var buffer = new ArrayBuffer(string.length)
	var bufferView = new Uint8Array(buffer)
	
	for (var i = 0; i < string.length; ++i) {

		bufferView[i] = string.charCodeAt(i)
	}

	return buffer
}

function bufferToString(buffer) {
    
	return String.fromCharCode.apply(null, new Uint8Array(buffer))
}

//////////////////////////////////////////////////////////////////////////////////////////
//                                    D??connexion                                       //
//////////////////////////////////////////////////////////////////////////////////////////

function deconnecte(){
    
    clearInterval(myVar); // arr??te l'essai d'envoi d'un requ??te alors que la 'socket' sera ferm??e

	chrome.sockets.udp.close(socketId, function() {
        // alert('TCP Socket close finished.')
        document.getElementById("debut").style.display = "block";
        document.getElementById("connecte").style.display = "none";
        document.getElementById("controle").style.display = "none";
	})
}

//////////////////////////////////////////////////////////////////////////////////////////

app.initialize();