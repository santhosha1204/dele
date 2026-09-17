sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Theming",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast"
], function (Controller, Theming, Filter, FilterOperator, MessageToast) {
  "use strict";

  return Controller.extend("products.controller.Main", {
    onInit: function () {
      var model = this.getOwnerComponent().getModel();
      model.setProperty("/filters", { search: "", status: "All", price: "All", category: "All", supplier: "", rating: 0 });
      model.setProperty("/hasSelection", false);
      model.setProperty("/productCount", 128);
      this.getView().setModel(model);
      this._applyFilters();
    },

    onFilterChange: function () { this._applyFilters(); },
    onApplyFilters: function () { this._applyFilters(); MessageToast.show("Filters applied"); },
    onClearFilters: function () {
      this.getView().getModel().setProperty("/filters", {
        search: "",
        status: "All",
        price: "All",
        category: "All",
        supplier: "",
        rating: 0
      });
      this._applyFilters();
      MessageToast.show("Filters cleared");
    },
    onToggleTheme: function (event) {
      var button = event.getSource();
      var isDark = Theming.getTheme() === "sap_horizon_dark";
      var nextTheme = isDark ? "sap_horizon" : "sap_horizon_dark";
      Theming.setTheme(nextTheme);
      button.setIcon(isDark ? "sap-icon://dark-mode" : "sap-icon://light-mode");
      button.setTooltip(isDark ? "Switch to dark theme" : "Switch to light theme");
    },

    _applyFilters: function () {
      var view = this.getView();
      var filters = view.getModel().getProperty("/filters");
      var list = view.byId("productTable").getBinding("items");
      var conditions = [];
      if (filters.search) {
        conditions.push(new Filter([new Filter("name", FilterOperator.Contains, filters.search), new Filter("id", FilterOperator.Contains, filters.search)], false));
      }
      if (filters.status && filters.status !== "All") conditions.push(new Filter("availability", FilterOperator.EQ, filters.status));
      if (filters.category && filters.category !== "All") conditions.push(new Filter("category", FilterOperator.EQ, filters.category));
      if (filters.supplier) conditions.push(new Filter("supplier", FilterOperator.Contains, filters.supplier));
      if (filters.price === "0-500") conditions.push(new Filter("priceValue", FilterOperator.LE, 500));
      if (filters.price === "500+") conditions.push(new Filter("priceValue", FilterOperator.GT, 500));
      if (filters.rating > 0) conditions.push(new Filter("rating", FilterOperator.GE, filters.rating));
      list.filter(conditions);
      view.getModel().setProperty("/productCount", list.getLength());
    },

    onSelectionChange: function (event) { this.getView().getModel().setProperty("/hasSelection", event.getSource().getSelectedItems().length > 0); },
    onDelete: function () { MessageToast.show("Selected products deleted"); },
    onAdd: function () { MessageToast.show("Create product"); },
    onAdaptFilters: function () { MessageToast.show("Filter adaptation is ready"); },
    onProductPress: function (event) { MessageToast.show("Opening " + event.getSource().getBindingContext().getProperty("name")); }
  });
});