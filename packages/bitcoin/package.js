Npm.depends({bitcoin: "1.7.0"});

Package.on_use(function (api) {
  api.export("BITCOIN");
  api.add_files("bitcoin.js", "server");
});