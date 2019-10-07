import Store from "./Store";
import FamilyMap from "@/family";

window.onload = function () {
    let fm = new FamilyMap(document.getElementById('app'), Store);
    fm.build();
}
