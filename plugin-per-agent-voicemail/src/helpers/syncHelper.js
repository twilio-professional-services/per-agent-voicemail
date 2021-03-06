import { Manager } from "@twilio/flex-ui";
import { SyncClient } from "twilio-sync";
import { PLUGIN_NAME } from "../PerAgentVoicemailPlugin";

const SYNC_CLIENT = new SyncClient(Manager.getInstance().user.token);

function tokenUpdateHandler() {
  console.log(PLUGIN_NAME, "Refreshing SYNC_CLIENT Token");

  const loginHandler =
    Manager.getInstance().store.getState().flex.session.loginHandler;

  const tokenInfo = loginHandler.getTokenInfo();
  const accessToken = tokenInfo.token;

  SYNC_CLIENT.updateToken(accessToken);
}

export default class SyncHelper {
  static init(manager) {
    console.log(PLUGIN_NAME, " SyncHelper add tokenUpdateHandler for sync");
    manager.store
      .getState()
      .flex.session.loginHandler.on("tokenUpdated", tokenUpdateHandler);
  }

  static async addList(listName) {
    await SYNC_CLIENT.list(listName);
    console.log(PLUGIN_NAME, " SyncHelper Adding ", listName);
    return true;
  }

  static async removeList(listName) {
    const listObj = await SYNC_CLIENT.list(listName);
    await listObj.removeList();
    console.log(PLUGIN_NAME, " SyncHelper Deleting ", listName);
  }

  static async listExists(listName) {
    // Add the options otherwise it would have just created a new list
    const listOpenOptions = { id: listName, mode: "open_existing" };

    try {
      await SYNC_CLIENT.list(listOpenOptions);
      console.log(PLUGIN_NAME, " SyncHelper ", listName, " exists");
      return true;
    } catch {
      console.log(PLUGIN_NAME, " SyncHelper ", listName, " doesn't exist");
      return false;
    }
  }

  static pageHandler(paginator) {
    const listItems = [];
    paginator.items.forEach(function (item) {
      listItems.push({
        item,
      });
    });
    return paginator.hasNextPage
      ? paginator.nextPage().then(pageHandler)
      : listItems;
  }

  static async getListItems(listName) {
    try {
      // creates the list if it doesn't exist
      const listOpenOptions = { id: listName };
      const listObj = await SYNC_CLIENT.list(listOpenOptions);
      const paginator = await listObj.getItems({ from: 0, order: "asc" });
      return this.pageHandler(paginator);
    } catch (err) {
      console.error("list getItems() failed", err);
    }
  }

  static async deleteListItem(listName, itemId) {
    return new Promise((resolve, reject) => {
      const listOpenOptions = { id: listName, mode: "open_existing" };
      SYNC_CLIENT.list(listOpenOptions).then((listObj) => {
        listObj
          .remove(itemId)
          .then(() => true)
          .catch((err) => {
            console.error("deleteListItem() failed", err);
            return false;
          });
      });
    });
  }

  static async subscribeForListUpdates(
    listId,
    onSyncItemAdded,
    onSyncItemRemoved,
    onSyncItemUpdated
  ) {
    const listOpenOptions = { id: listId, mode: "open_existing" };
    const listObj = await SYNC_CLIENT.list(listOpenOptions);

    listObj.on("itemAdded", (args) => onSyncItemAdded(args)),
      listObj.on("itemRemoved", (args) => onSyncItemRemoved(args)),
      listObj.on("itemUpdated", (args) => onSyncItemUpdated(args));
  }
}
