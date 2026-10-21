import "clsx";
import { b as push, p as pop } from "./index.js";
function BlackHole($$payload, $$props) {
  push();
  $$payload.out += `<canvas class="block w-full h-full"></canvas>`;
  pop();
}
export {
  BlackHole as default
};
