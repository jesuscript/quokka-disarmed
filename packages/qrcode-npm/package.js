Npm.depends({"qrcode-npm": "0.0.3"});

Package.on_use(function (api) {
  api.export("QRCODE");
  api.add_files("qrcode-npm.js", "server");
});