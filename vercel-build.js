require("tsconfig-paths").register({
  baseUrl: "./src",
  paths: {
    "@/*": ["*"],
    "@/types/*": ["types/*"],
    "@/utils/*": ["utils/*"],
    "@/middleware/*": ["middleware/*"],
    "@/services/*": ["services/*"],
    "@/controllers/*": ["controllers/*"],
    "@/routes/*": ["routes/*"],
    "@/config/*": ["config/*"],
  },
});
