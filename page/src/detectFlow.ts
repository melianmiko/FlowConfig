import { FlowConfig, FlowConfigWithPatcher } from "./types";
import { Path } from "mzfw/device/Path";
import { FlowConfigureTool } from "./configureFlow";

const ROOT_DASH_PATCH_OPTIONS: Path[] = [
  // T-Rex Ultra, Cheetah and others edition (1.7)
  new Path("full", "/storage/js_apps/data/00105A2C"),
  // Active 2 edition (1.8)
  new Path("full", "/storage/js_apps/data/0010660A"),
  // T-Rex 3 edition (1.8)
  new Path("full", "storage/js_apps/data/00105A1B"),
  // Balance 2 edition (2.0)
  new Path("full", "storage/js_apps/data/00106815"),
  // Bip 6 edition (1.8)
  new Path("full", "storage/js_apps/data/00106C54"),
  // Active 2 (Square) edition (1.8-2.0)
  new Path("full", "storage/js_apps/data/00107609"),
];

export const detectFlow = (): FlowConfigWithPatcher | null => {
  for(const root of ROOT_DASH_PATCH_OPTIONS) {
    if(root.isFolder()) {
      console.log(`Using release at ${root.absolutePath}`);

      try {
        const fileLoc = root.get("flex_set.txt");
        const configJson = fileLoc.fetchJSON();
        const entry: FlowConfig = {
          version: configJson.lastVersion,
          language: configJson.flowLanguageCodeZone,
          voice: configJson.audioGender,
          fileLocation: fileLoc.path,
        };

        return {
          ...entry,
          patcher: new FlowConfigureTool(entry),
        }
      } catch(e) {
        console.error(`FAIL ${e}`);
      }
    }
  }

  return null;
}
