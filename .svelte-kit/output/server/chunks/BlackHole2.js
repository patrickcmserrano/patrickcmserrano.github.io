import "clsx";
import { p as pop, b as push } from "./index.js";
function BlackHole($$payload, $$props) {
  push();
  let { isAmbient = false } = $$props;
  $$payload.out += `<canvas class="block w-full h-full"></canvas>`;
  pop();
}
export {
  BlackHole as B
};
