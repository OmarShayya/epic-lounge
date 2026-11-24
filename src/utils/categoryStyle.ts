import type { SvgIconComponent } from "@mui/icons-material";
import {
  LocalCafe,
  LocalDrink,
  Bolt,
  Cookie,
  Cake,
  LunchDining,
  SmokingRooms,
  Icecream,
  Restaurant,
} from "@mui/icons-material";

export interface CategoryStyle {
  color: string;
  Icon: SvgIconComponent;
}

/** Keyword → colour + icon. First match wins, so more specific rules go first. */
const RULES: { test: RegExp; style: CategoryStyle }[] = [
  { test: /hot ?dog/i, style: { color: "#FF6464", Icon: LunchDining } },
  { test: /energy|red ?bull|monster/i, style: { color: "#A3E635", Icon: Bolt } },
  { test: /coffee|hot|tea|espresso|nescaf|cappuc|latte|mocha/i, style: { color: "#FFB547", Icon: LocalCafe } },
  { test: /ice ?cream|frozen|gelato/i, style: { color: "#7DD3FC", Icon: Icecream } },
  { test: /choc|sweet|candy|dessert|cake|biscuit/i, style: { color: "#FF7AA8", Icon: Cake } },
  { test: /snack|chip|crisp|nut|popcorn|cookie/i, style: { color: "#FF9447", Icon: Cookie } },
  { test: /food|sandwich|burger|pizza|toast|meal|croissant|hot ?dog|manou?ch/i, style: { color: "#FF6464", Icon: LunchDining } },
  { test: /shisha|argil|arguil|hookah|narg/i, style: { color: "#C084FC", Icon: SmokingRooms } },
  { test: /cold|soft|soda|juice|drink|water|beverage|bev|cola|pepsi|smoothie|shake/i, style: { color: "#38E1E4", Icon: LocalDrink } },
];

const FALLBACK = ["#B57CFF", "#38E1E4", "#FFB547", "#FF7AA8", "#A3E635", "#5AA9FF", "#FF9447"];

export const getCategoryStyle = (name: string, index: number): CategoryStyle => {
  const hit = RULES.find((r) => r.test.test(name));
  return hit ? hit.style : { color: FALLBACK[index % FALLBACK.length], Icon: Restaurant };
};
