import React from "react";
import { VERSION } from "@twilio/flex-ui";
import { FlexPlugin } from "flex-plugin";
import SyncHelper from "./helpers/syncHelper";
import VoicemailHelper from "./helpers/voicemailHelper";
import reducers, { namespace } from "./states";
import { Actions } from "./states/VoiceMailListState";
import VoiceMailListContainer from "./components/VoiceMailList/VoiceMailList.Container";
import SupervisorExtensionConfig from "./components/Supervisor/SupervisorExtensionConfig";
import { registerDirectCallChannel } from "./helpers/directVoiceTaskChannel";
import registerVoicemailTaskChannel, {
  autoAcceptVoicemailTask,
} from "./helpers/voicemailTaskChannel";
import VoicemailIconWithBadgeContainer from "./components/VoicemailIconWithBadge/VoicemailIconWithBadge.Container";

export const PLUGIN_NAME = "PerAgentVoicemailPlugin";

export default class PerAgentVoicemailPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);
    const options = { sortOrder: -1 };

    SyncHelper.init(manager);
    console.log(PLUGIN_NAME, " running");
    console.log(
      PLUGIN_NAME,
      " TWILIO_SERVERLESS_DOMAIN=",
      process.env.TWILIO_SERVERLESS_DOMAIN
    );
    registerDirectCallChannel(flex);
    registerVoicemailTaskChannel(flex);
    autoAcceptVoicemailTask(flex, manager);

    flex.ViewCollection.Content.add(
      <flex.View name="voicemail-list" key="my-voicemail-list-key">
        <VoiceMailListContainer
          deleteHandler={VoicemailHelper.deleteVoicemail}
          openHandler={VoicemailHelper.openVoicemail}
        />
      </flex.View>
    );

    flex.SideNav.Content.add(
      <flex.SideLink
        showLabel={true}
        icon={<VoicemailIconWithBadgeContainer />}
        isActive={false}
        onClick={() => {
          flex.Actions.invokeAction("HistoryPush", `/voicemail-list`);
        }}
        key="voicemailListSideLink"
      >
        Voicemail List
      </flex.SideLink>
    );

    flex.WorkerSkills.Content.add(
      <SupervisorExtensionConfig key="voicemail-extension" />,
      { align: "end" }
    );

    // pulls initial voicemail list value from sync
    manager.store.dispatch(Actions.initVoicemail());

    // call method in voicemail helper that subscribes to sync store.
    VoicemailHelper.subscribeToVoicemails();
  }

  /**
   * Registering the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on version ${VERSION}.`
      );
      return;
    }
    manager.store.addReducer(namespace, reducers);
  }
}
