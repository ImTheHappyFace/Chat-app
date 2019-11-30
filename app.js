var connection = new autobahn.Connection({url: 'wss://ws.syrow.com:443/ws', realm: 'default'});
var app = angular.module("PubSubAngApp", []);

app.controller("PublishingCtrl", function($scope) {
    $scope.model = [{ message: " " }];

    $scope.clickMe = function(outgoingMsg) {
        if (connection.session) {
           connection.session.publish("com.myapp.mytopic1", [outgoingMsg]);
           console.log("event published!");
           $scope.model = {message: " "};
        } else {
           console.log("cannot publish: no session");
        }
    };

});

app.controller("ReceivingCtrl", ['$scope', function($scope) {
   $scope.model = { message: "" };
   
   $scope.showMe = function(incomingMsg) {
       $scope.model.message = incomingMsg;
   };
}]);

connection.onopen = function (session) {

   console.log("Connected");


   function onevent1(arg1) {
      console.log("got event:", arg1);
      var scope = angular.element(document.getElementById('Receiver')).scope();
      scope.$apply(function() {
          scope.showMe(arg1[0]);
      });
   };


   session.subscribe('com.myapp.mytopic1', onevent1);
};


connection.onclose = function (reason, details) {
   console.log("connection lost");
}
connection.open();