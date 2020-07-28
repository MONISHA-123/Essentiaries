sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator"
], function (Controller, History, UIComponent, JSONModel, MessageToast,BusyIndicator) {
	"use strict";

	return Controller.extend("com.inkathon.Grocery.controller.Product", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.inkathon.Grocery.view.Product
		 */
		onInit: function () {
				var oRouter = this.getRouter();
			oRouter.getRoute("Product").attachMatched(this._onRouteMatched, this);
			

		},
			getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		_onRouteMatched: function (oEvent) {
			
			this.id = oEvent.getParameter("arguments").CategoryId;
		/*	this.GETMethod_PROD();
				this.GETMethod_CATE();
			this.GETMethod_BRAND();*/
		},
	fnFilter: function () {
			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("idFilter", "com.inkathon.Grocery.fragments.Filter", this);

			}

			this.getView().addDependent(this._oDialog);

			this._oDialog.open();

		},
			onNavBack: function () {
			UIComponent.getRouterFor(this).navTo("TargetHome");
		/*	var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("TargetHome", {}, true);

			}*/
		},
			fnOnCancel:function(){
				this._oDialog.close();

			this._oDialog.destroy();

			this._oDialog = null;
		}
	});

});