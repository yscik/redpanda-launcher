
browser.commands.onCommand.addListener(function(command) {

  browser.tabs.create({url: browser.runtime.getManifest().chrome_url_overrides.newtab})
});