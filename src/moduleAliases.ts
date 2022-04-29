import "module-alias/register";
import moduleAliases from "module-alias";
import path from "path";

moduleAliases.addAliases({
  libs: path.resolve(__dirname, "libs"),
});
