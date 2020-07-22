sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device",
	"sap/ui/core/Popup"

], function (Controller, UIComponent, MessageToast, BusyIndicator, JSONModel, Fragment, Filter, FilterOperator, Device, Popup) {
	"use strict";

	return Controller.extend("com.inkathon.Grocery.controller.Home", {
		onInit: function () {
			this.token = "";
			this.forgotOTP=0;
			this.oRegistration = {
				"email": "",
				"fname": "",
				"lname": "",
				"phoneno": "",
				"password": "",
				"role": "user"
			};

			var oEmptyModel = new JSONModel();
			oEmptyModel.setProperty("/ForgotPassword",{"email":""});
			this.getView().setModel(oEmptyModel, "oEmptyModel");
			this.GETMethod_CATE();
		},
		GETMethod_CATE: function () {
			var that = this;

			var sUrl = "/AdminModule/api/category";
			$.ajax({
				url: sUrl,
				data: null,
				async: true,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				headers: {
					"x-CSRF-Token": "fetch"
				},
				error: function (err) {
					MessageToast.show("Category Fetch Destination Failed");
				},
				success: function (data, status, xhr) {

					MessageToast.show("Succussfully consumed destination from CF!");
					that.cateCount = data.length;

					that.getOwnerComponent().getModel("oProductModel").setProperty("/Category", data);
					//console.log(data);

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");
				//console.log(that.token);
			});
		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		//fragment for zip code
		fnOnZipCode: function (oEvent) {
			var oButton = oEvent.getSource();
			if (!this._oPopover) {

				Fragment.load({

					name: "com.inkathon.Grocery.fragments.zipPopover",

					controller: this

				}).then(function (oPopover) {

					this._oPopover = oPopover;

					this.getView().addDependent(this._oPopover);

					this._oPopover.openBy(oButton);

				}.bind(this));

			} else {

				this._oPopover.openBy(oButton);

			}

		},
		fnPopCloseButton: function (oEvent) {

			this._oPopover.close();

		},
		//fragment for user
		fnOnUser: function () {

			if (this._oDialog) {

				this._oDialog.close();

				this._oDialog.destroy();

				this._oDialog = null;

			}

			this.getView().byId("idConfirmation").setVisible(false);

			this.getView().getModel("oEmptyModel").setProperty("/oList", []);

			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("idUserLogin", "com.inkathon.Grocery.fragments.UserLogin", this);

			}

			this.getView().addDependent(this._oDialog);

			// Fragment.byId("idUserLogin", "idContent").addStyleClass("bgDialog"); 

			this._oDialog.open();

		},

		fnOnCancel: function () {

			this._oDialog.close();

			this._oDialog.destroy();

			this._oDialog = null;

		},
		//fragment for reset password
		fnOnResetPass: function () {
			
			this._oDialog.close();

			this._oDialog.destroy();

			this._oDialog = null;

			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("idForgetPass", "com.inkathon.Grocery.fragments.ResetPassword", this);

			}

			this.getView().addDependent(this._oDialog);

			Fragment.byId("idForgetPass", "fogetPass").setVisible(true);

			Fragment.byId("idForgetPass", "forgetPassOTP").setVisible(false);

			Fragment.byId("idForgetPass", "resetPassPage").setVisible(false);

			// Fragment.byId("idForgetPass", "navBack").setPress(this.fnOnUser); 

			this._oDialog.open();

		},

		fnforgetPassOTP: function () {
			var sEmail = this.getView().getModel("oEmptyModel").getProperty("/ForgotPassword/email");
				var mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
					var that = this;

			var sUrl = "/AdminModule/api/forgotpassword?email="+sEmail;
	// console.log(this.getView().getModel("oEmptyModel"));
			if (mailregex.test(sEmail))
				{
						this.busyIndicator(4000);
		
			
			$.ajax({
				url: sUrl,
				data: null,
				async: true,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				headers: {
					"x-CSRF-Token": "fetch"
				},
				error: function (err) {
					MessageToast.show("Category Fetch Destination Failed");
				},
				success: function (data, status, xhr) {

				
					that.forgotOTP = data;
				console.log(that.forgotOTP);
				
				},
				complete: function (xhr, status) {
						that._oDialog.close();

			that._oDialog.destroy();

			that._oDialog = null;
					
			if (!that._oDialog) {

				that._oDialog = sap.ui.xmlfragment("idForgetPass", "com.inkathon.Grocery.fragments.ResetPassword", that);

			}

			that.getView().addDependent(that._oDialog);

			Fragment.byId("idForgetPass", "fogetPass").setVisible(false);

			Fragment.byId("idForgetPass", "forgetPassOTP").setVisible(true);

			Fragment.byId("idForgetPass", "resetPassPage").setVisible(false);

			// Fragment.byId("idForgetPass", "NavBack").setVisible(false);

			// Fragment.byId("idForgetPass", "info").setText("We've sent an OTP to the email . Please enter it below to complete verification.");
			// Fragment.byId("idForgetPass", "resend").setEnabled(false);
			that._oDialog.open();

			var time = Fragment.byId("idForgetPass", "timer");

			var fiveMinutesLater = new Date();

			var scs = fiveMinutesLater.setMinutes(fiveMinutesLater.getMinutes() + 3);

			var countdowntime = scs;

			var x = setInterval(function () {

				var now = new Date().getTime();

				var cTime = countdowntime - now;

				var minutes = Math.floor((cTime % (1000 * 60 * 60)) / (1000 * 60));

				var second = Math.floor((cTime % (1000 * 60)) / 1000);

				time.setText("OTP Expires in " + minutes + ":" + second + " Minutes");

				if (cTime < 0) {

					clearInterval(x);

					time.setText("OTP Expires in 0:0 Minutes");
					// Fragment.byId("idForgetPass", "resend").setEnabled(true);

				}

			});
					
					},
				type: "GET"
			});


		}
			else
			MessageToast.show("Invalid Email ID");
		},

		fnOTP: function (oEvent) {
			var temp="";
			this.otp = oEvent.getSource().getValue();
			if(this.otp){
			for(var i=0;i<=10;i=i+2){
			temp+=this.otp[i];}
			this.otp=parseInt(temp, 10);
			/*if(this.forgotOTP===this.opt)
			MessageToast.show("Crct");*/
			}
			

		},
		fnResetPassLogin: function () {
			console.log(this.forgotOTP);
			console.log(typeof(this.forgotOTP));
			console.log(this.otp);
			console.log(typeof(this.otp));
			var a=this.forgotOTP;
			var b=this.opt;
			if(a==b)
			{
			this._oDialog.close();

			this._oDialog.destroy();

			this._oDialog = null;

			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("ForgetPass", "com.inkathon.Grocery.fragments.ResetPassword", this);

			}

			this.getView().addDependent(this._oDialog);

			Fragment.byId("ForgetPass", "fogetPass").setVisible(false);

			Fragment.byId("ForgetPass", "forgetPassOTP").setVisible(false);

			Fragment.byId("ForgetPass", "resetPassPage").setVisible(true);
this._oDialog.open();
			}
			else
			MessageToast.show("Incorrect OTP");
	
		},
		fnOnLoginValidation: function () {

			var sEmail = this.getView().getModel("oEmptyModel").getProperty("/oList/Email");

			var sPassword = this.getView().getModel("oEmptyModel").getProperty("/oList/password");

			var mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

			if (sPassword == undefined || sEmail == undefined)

				MessageToast.show("Mandatory fields cannot be blank");

			else if (!(mailregex.test(sEmail)))

				MessageToast.show("Invalid Email");

			else {
				var sCredentials = "email=" + sEmail + "&password=" + sPassword;
				console.log(sCredentials);
				var that = this;
				this.busyIndicator(2000);
				var sUrl = "/AdminModule/api/login?" + sCredentials;
				$.ajax({
					url: sUrl,
					data: null,
					async: true,
					dataType: "json",
					contentType: "application/json; charset=utf-8",
					headers: {
						"x-CSRF-Token": "fetch"
					},
					error: function (err) {
						MessageToast.show("Category Fetch Destination Failed");
					},
					success: function (data, status, xhr) {
						console.log(data);
						if (data.email =="" )
							MessageToast.show("Email ID does not exist");
						else if (data.email == sEmail && data.password != sPassword)
							MessageToast.show("Password does not match with the id provided");
						else {
							if (data.email == sEmail && data.password == sPassword && data.role == "user") {
								that.getOwnerComponent().getModel("oProductModel").setProperty("/LoginUser", data);
								var sInitial = (data.fname).charAt(0) + (data.lname).charAt(0);

								that.getView().byId("accountMenu").setInitials(sInitial);
								that.getView().byId("accountMenu").setVisible(true);

								that.getView().byId("signIn").setVisible(false);
								that._oDialog.close();

								that._oDialog.destroy();

								that._oDialog = null;
							}
							if (data.email == sEmail && data.password == sPassword && data.role == "admin")
								that.getRouter().navTo("Admin");
						}

					},
					type: "GET"
				}).always(function (data, status, xhr) {
					that.token = xhr.getResponseHeader("x-CSRF-Token");
					console.log(that.token);
				});

			}

		},
		fnLogOut: function () {
			this.getOwnerComponent().getModel("oProductModel").setProperty("/LoginUser", []);
			this.getView().byId("accountMenu").setVisible(false);

			this.getView().byId("signIn").setVisible(true);
		},
		fnGuestLogin: function () {

		},
		fnOnCreateAcc: function () {

			this.count = 0;

			this._oDialog.close();

			this._oDialog.destroy();

			this._oDialog = null;

			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("idRegistration", "com.inkathon.Grocery.fragments.CreateAccount", this);

			}

			this.getView().addDependent(this._oDialog);
			this.getView().getModel("oEmptyModel").setProperty("/Registration", this.oRegistration);

			this._oDialog.open();

		},
		fnOnFNameChange: function (oEvent) {

			var regex_name = /^[A-Za-z\s]*$/;

			if (!(regex_name.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == "")) {

				Fragment.byId("idRegistration", "idFName").setValueState("Error");

				Fragment.byId("idRegistration", "idFName").setValueStateText("Invalid Entry");

			} else

				Fragment.byId("idRegistration", "idFName").setValueState("None");

		},

		fnOnLNameChange: function (oEvent) {

			var regex_name = /^[A-Za-z\s]*$/;

			if (!(regex_name.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == "")) {

				Fragment.byId("idRegistration", "idLName").setValueState("Error");

				Fragment.byId("idRegistration", "idLName").setValueStateText("Invalid Entry");

			} else

				Fragment.byId("idRegistration", "idLName").setValueState("None");

		},

		fnOnEmailChange: function (oEvent) {

			var mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

			if (!(mailregex.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == "")) {

				Fragment.byId("idRegistration", "idEmail").setValueState("Error");

				Fragment.byId("idRegistration", "idEmail").setValueStateText("Invalid email address");

			} else

				Fragment.byId("idRegistration", "idEmail").setValueState("None");

		},

		fnOnEmailLiveChange: function (oEvent) {

			var mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

			if (!(mailregex.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == ""))

				Fragment.byId("idRegistration", "idEmail").setValueStateText("Invalid email address");

			else

				Fragment.byId("idRegistration", "idEmail").setValueState("None");

		},

		fnOnPwdChange: function (oEvent) {

			var regex_passcode = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

			if (!(regex_passcode.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == "")) {

				Fragment.byId("idRegistration", "idPwd").setValueState("Error");

				Fragment.byId("idRegistration", "idPwd").setValueStateText(

					"An 8 digit password with atleast one Uppercase, one Lowecase, one symbol, one number is required.");

			} else

				Fragment.byId("idRegistration", "idPwd").setValueState("None");

		},

		fnOnPwdLiveChange: function (oEvent) {

			var regex_passcode = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

			if (!(regex_passcode.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == ""))

				Fragment.byId("idRegistration", "idPwd").setValueStateText(

				"An 8 digit password with atleast one Uppercase, one Lowecase, one symbol, one number is required.");

			else

				Fragment.byId("idRegistration", "idPwd").setValueState("None");

		},

		fnOnConfirmPwdChange: function (oEvent) {

			var sPassword = this.getView().getModel("oEmptyModel").getProperty("/Registration/password");

			var sCPassword = this.getView().getModel("oEmptyModel").getProperty("/Registration/confirmPass");

			if (sCPassword != sPassword) {

				Fragment.byId("idRegistration", "idConfirmPwd").setValueState("Error");

				Fragment.byId("idRegistration", "idConfirmPwd").setValueStateText("Password and Confirm Password does not match.");

			} else

				Fragment.byId("idRegistration", "idConfirmPwd").setValueState("None");

		},

		fnOnConfirmPwdLiveChange: function (oEvent) {

			var sPassword = this.getView().getModel("oEmptyModel").getProperty("/Registration/password");

			var sCPassword = oEvent.getParameters().value;

			if (sCPassword === sPassword)

				Fragment.byId("idRegistration", "idConfirmPwd").setValueState("None");

		},

		fnOnSubmit: function () {

			var regex_name = /^[A-Za-z\s]*$/;

			var mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

			var regex_passcode = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

			var sFirstName = this.getView().getModel("oEmptyModel").getProperty("/Registration/fname");

			var sLastName = this.getView().getModel("oEmptyModel").getProperty("/Registration/lname");

			var sPassword = this.getView().getModel("oEmptyModel").getProperty("/Registration/password");

			var sCPassword = this.getView().getModel("oEmptyModel").getProperty("/Registration/confirmPass");

			var sEmail = this.getView().getModel("oEmptyModel").getProperty("/Registration/email");

			var sTerms = this.getView().getModel("oEmptyModel").getProperty("/Registration/terms");

			//this.getView().getModel("oEmptyModel").setProperty("/oList", []); 

			if (sFirstName == undefined || sLastName == undefined || sPassword == undefined || sCPassword == undefined || sEmail == undefined)

				MessageToast.show("Mandatory fields cannot be blank");

			else if (!(regex_name.test(sFirstName)) || (sFirstName.trim() == ""))

				MessageToast.show("Invalid First Name");

			else if (!(regex_name.test(sLastName)))

				MessageToast.show("Invalid Last Name");

			else if (!(mailregex.test(sEmail)))

				MessageToast.show("Invalid Email id");

			else if (!(regex_passcode.test(sPassword)))

				MessageToast.show("minimum of 8 digit password with atleast 1 symbol,1 number,1 uppercase, 1 lowercase is required");

			else if (sCPassword != sPassword)

				MessageToast.show("password and Confirm Password does not match");

			else if (sTerms != true)

				MessageToast.show("Agree with the terms and condition");

			else {

				var that = this;

				var oData = this.getView().getModel("oEmptyModel").getProperty("/Registration");
				delete oData.terms;
				delete oData.confirmPass;
				console.log(oData);
				/*	var oRegistrationModel = new JSONModel();

					oRegistrationModel.setData(oDetails);

					this.getView().setModel(oRegistrationModel, "ORegistrationModel");*/

				// this.getView().byId("idConfirmation").setVisible(true);
				this.busyIndicator(2000);
				var sUrl = "/AdminModule/api/signup/";

				$.ajax({
					type: "POST",
					url: sUrl,
					data: JSON.stringify(oData),
					dataType: "json",
					"headers": {
						"Content-Type": "application/json",
						"x-CSRF-Token": that.token
					},

					success: function (data) {
						if (data.email == "")
							MessageToast.show("Email ID does not exist");
						else {
							that._oDialog.close();
							that._oDialog.destroy();
							that._oDialog = null;
							MessageToast.show("Acccount created successfully!!!Login to Shop");
							//that.getView().byId("idConfirmation").setVisible(true);
							that.fnOnUser();
						}

					},
					error: function (xhr, status) {
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
						MessageToast.show("Registration failed");
					},
					complete: function (xhr, status) {

					}
				});

			}

		},

		fnOnShowPassword: function (oEvent) {

			this.count++;

			if (this.count % 2 == 1) {

				Fragment.byId("idRegistration", "idPwd").setType("Text");

				Fragment.byId("idRegistration", "idShowPwd").setIcon("sap-icon://hide");

			} else {

				Fragment.byId("idRegistration", "idPwd").setType("Password");

				Fragment.byId("idRegistration", "idShowPwd").setIcon("sap-icon://show");

			}

		},
		//Till now login fragments functions/////

		fnAccountMenu: function (oEvent) {

			var oButton = oEvent.getSource();

			// create menu only once 

			if (!this._menu) {

				Fragment.load({

					name: "com.inkathon.Grocery.fragments.account",

					controller: this

				}).then(function (oMenu) {

					this._menu = oMenu;

					this.getView().addDependent(this._menu);

					this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);

				}.bind(this));

			} else {

				this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);

			}

		},
		hideBusyIndicator: function () {
			BusyIndicator.hide();
		},

		showBusyIndicator: function (iDuration, iDelay) {
			BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					clearTimeout(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = setTimeout(function () {
					this.hideBusyIndicator();
				}.bind(this), iDuration);
			}
		},
		busyIndicator: function (sec) {
			this.showBusyIndicator(sec);
		}
	});
});