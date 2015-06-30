//Adiciona o módulo ['jlgI18n'] ao módulo Shopping list
		var app = angular.module("ShoppingList",['jlgI18n']);

		//É necessário adicionar ao controlador os serviços '$locale', 'jlgI18nService',
		app.controller("shoppingListCtrl", ['$scope', '$locale', 'jlgI18nService', 'localeFunctions',
			function ($scope, $locale, i18nService, localeFunctions) {

			$scope.app = "Shopping list";
			$scope.list = [
				{name: "Chocolate", price: 4.50, date: new Date()},
				{name: "Cookies", price: 3.00, date: new Date()},
				{name: "Potatoes", price: 5.00, date: new Date()}
			];

			//Variável que define a localização
            $scope.locale = $locale;

            //Função que altera a localização de acordo com o usuário
            $scope.changeLocale = i18nService.changeLocale;

			$scope.currency = function(number, fractionSize ) {
				return localeFunctions.currency($locale, number, fractionSize);
			};

			$scope.number = function (ammount, fractionSize) {
		 	 	return localeFunctions.number($locale, ammount, fractionSize);
			};

		}]);

		//Configura o módulo
		app.config(['jlgI18nServiceProvider', function(jlgI18nServiceProvider) {
        	jlgI18nServiceProvider.localeDir('bower_components/jlg-i18n/locale');
        
    	}]);