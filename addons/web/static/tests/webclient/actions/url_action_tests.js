/** @odoo-module **/

import { makeTestEnv } from "../../helpers/mock_env";
import { setupWebClientRegistries, doAction, getActionManagerServerData } from "./../helpers";
import { patchWithCleanup } from "@web/../tests/helpers/utils";
import { browser } from "@web/core/browser/browser";

let serverData;

QUnit.module("ActionManager", (hooks) => {
    hooks.beforeEach(() => {
        serverData = getActionManagerServerData();
    });

    QUnit.module("URL actions");

    QUnit.test("execute an 'ir.actions.act_url' action with target 'self'", async (assert) => {
        patchWithCleanup(browser.location, {
            assign: (url) => {
                assert.step(url);
            },
        });
        setupWebClientRegistries();
        const env = await makeTestEnv({ serverData });
        await doAction(env, {
            type: "ir.actions.act_url",
            target: "self",
            url: "/my/test/url",
        });
        assert.verifySteps(["/my/test/url"]);
    });

    QUnit.test("execute an 'ir.actions.act_url' action with onClose option", async (assert) => {
        setupWebClientRegistries();
        patchWithCleanup(browser, {
            open: () => assert.step("browser open"),
        });
        const env = await makeTestEnv({ serverData });
        const options = {
            onClose: () => assert.step("onClose"),
        };
        await doAction(env, { type: "ir.actions.act_url" }, options);
        assert.verifySteps(["browser open", "onClose"]);
    });

    QUnit.test("execute an 'ir.actions.act_url' action with url javascript:", async (assert) => {
        assert.expect(2);
        patchWithCleanup(browser.location, {
            assign: (url) => {
                assert.step(url);
            },
        });
        setupWebClientRegistries();
        const env = await makeTestEnv({ serverData });
        await doAction(env, {
            type: "ir.actions.act_url",
            target: "self",
            url: "javascript:alert()",
        });
        assert.verifySteps(["/javascript:alert()"]);
    });
});
