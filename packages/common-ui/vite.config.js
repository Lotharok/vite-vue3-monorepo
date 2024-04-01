import * as path from "path";
import { getBaseConfig } from "../../vite.config";

export default getBaseConfig({
   lib: {
      // eslint-disable-next-line no-undef
      entry: path.resolve(__dirname, "src/index.js"),
      name: "common-ui",
      formats: ["es", "umd"],
      fileName: (format) => `common-ui.${format}.js`,
   },
});
