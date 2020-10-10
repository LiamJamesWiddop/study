const path = require("path");
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/assets/style.scss";
        `
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
        .set('@', path.resolve(__dirname, 'src'))
        .set('@store', path.resolve(__dirname, 'store'))
  }
};