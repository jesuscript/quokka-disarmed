Npm.depends({bitcoin: "1.6.2"});

Package.on_use(function (api) {
  api.add_files("bitcoin.js", "server");
});