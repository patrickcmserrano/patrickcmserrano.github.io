import "clsx";
import { p as pop, a as push } from "../../chunks/index.js";
import { i as initSimpleI18n } from "../../chunks/simple-i18n.js";
function _layout($$payload, $$props) {
  push();
  initSimpleI18n();
  let { children } = $$props;
  children($$payload);
  $$payload.out += `<!---->`;
  pop();
}
export {
  _layout as default
};
