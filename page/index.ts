import { createModal, showToast } from "@zosx/interaction";
import { replace } from "@zosx/router";
import { osImport } from "@zosx/utils";
import { getText as t } from "@zosx/i18n";
import { scrollTo, setScrollLock } from "@zosx/page";
import { ListItem, ListView, SectionHeaderComponent } from "mzfw/device/UiListView";
import { Component } from "mzfw/device/UiComponent";
import { ICON_SIZE } from "mzfw/device/UiProperties";
import { ScreenBoard } from "mzfw/device/ScreenBoard";
import { UNSUPPORTED_REGIONS, VERSION } from "./src/constants";
import { FlowConfigWithPatcher } from "./src/types";
import { detectFlow } from "./src/detectFlow";
import { KNOWN_LANGUAGES } from "./src/languages";

class RootPage extends ListView<{}> {
  private flowInstance: FlowConfigWithPatcher = detectFlow();

  private buildNotFound(): (Component<any> | null)[] {
    return [
      new ListItem({
        title: 'Zepp Flow installation not found',
        description: 'Please, install actual Zepp Flow version to use this tool',
      })
    ]
  }

  protected applyLanguage(code: string) {
    const ret = this.flowInstance.patcher.setConfig(
      code,
    );

    createModal({
      content: ret ? 'Success, reboot device' : 'Something went wrong, check logs',
      show: true,
      onClick(): any {
        replace({ url: 'page/index' });
      },
    });
  }

  protected getAccountRegionStatus(): ListItem | null {
    try {
      const { getProfile } = osImport<any>("@zos/user", "");
      const { region } = getProfile();
      const supported = !UNSUPPORTED_REGIONS.includes(region.toUpperCase());

      return new ListItem({
        title: `Account region: ${region.toUpperCase()}`,
        description: supported ? undefined : 'Flow will not work, create new Zepp account ' +
          'in supported region, for example, in United States.',
        titleColor: supported ? 0xFFFFFF : 0xFF9900,
      })
    } catch {
      return null;
    }
  }

  protected showKeyboard() {
    const kbd = new ScreenBoard({
      forceLayouts: ['en-US']
    });

    kbd.title = "Enter language code to apply";
    kbd.value = '';
    kbd.confirmButtonText = t("Apply");
    kbd.onConfirm = (t: string) => {
      if(t.length != 5 || t[2] != '-') {
        showToast({ content: "Wrong format, example: ru-RU" });
        return;
      }

      const lang = t.substring(0, 2);
      const region = t.substring(3, 5);
      const result = `${lang}-${region.toUpperCase()}`;

      console.log(result);

      this.applyLanguage(result);
    };

    scrollTo({ y: 0 });
    setScrollLock({ lock: true });

    kbd.visible = true;
  }

  protected build(): (Component<any> | null)[] {
    if(!this.flowInstance) {
      return this.buildNotFound();
    }

    let version = 'unknown';

    if(this.flowInstance.version) {
      version = `v${this.flowInstance.version}`;
    }

    return [
      new ListItem({
        title: `Zepp Flow (${version}) detected`,
        description: `ZeppConfig ${VERSION}\nCurrent langauge: ${this.flowInstance.language}`
      }),
      this.getAccountRegionStatus(),
      new SectionHeaderComponent('Change language'),
      new ListItem({
        icon: '',
        title: `Custom language`,
        description: `Enter language code in ISO 639-1 format, for example, "ru-RU"`,
        onClick: () => {
          this.showKeyboard();
        }
      }),
      ...KNOWN_LANGUAGES.map(
        ({ code, name }) => new ListItem({
          title: name,
          description: code,
          icon: `/mzfw/${ICON_SIZE}/${String(this.flowInstance.language == code)}.png`,
          onClick: () => {
            this.applyLanguage(code);
          },
        })
      ),
    ];
  }
}

Page(RootPage.makePage(new RootPage({})));
