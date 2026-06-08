import AppComponent from "sap/fe/core/AppComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

/**
 * @namespace spacefarer-adventure
 */
export default class Component extends AppComponent {

	public static metadata = {
		manifest: "json"
	};

	public override init(): void {
		super.init();

		const oModel = this.getModel("i18n") as ResourceModel;
		const oBundle = oModel.getResourceBundle();

		if (oBundle instanceof ResourceBundle) {
			document.title = String(oBundle.getText("appTitle"));
		}
	}
}