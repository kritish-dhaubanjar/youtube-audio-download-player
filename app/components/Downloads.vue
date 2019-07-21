<template>
  <Page>
    <ActionBar title="Youtube Audio">
      <ActionItem
        @tap="goBack"
        ios.position="left"
        icon="~/assets/images/back.png"
        android.position="actionBar"
      />
    </ActionBar>
    <StackLayout>
      <Image :src="thumbnail" stretch="aspectFit" row="0" col="0" />
      <Label class="title" :text="title" row="1" col="0" />
      <Label class="channel" :text="channel" row="2" col="0" />
      <Label class="channel" :text="description" row="3" col="0" />
      <Button text="Download Music" @tap="getAudio" />
      <ActivityIndicator :busy="busy" />
    </StackLayout>
  </Page>
</template>

<script>
const httpModule = require("tns-core-modules/http");

const fileSystemModule = require("tns-core-modules/file-system");
const path = fileSystemModule.path.join(
  android.os.Environment.getExternalStoragePublicDirectory(
    android.os.Environment.DIRECTORY_DOWNLOADS
  ).getAbsolutePath()
);

/*
path = fileSystemModule.knownFolders.documents();
*/

export default {
  props: ["videoId", "title", "thumbnail", "channel", "description"],

  data() {
    return {
      busy: false
    };
  },

  methods: {
    goBack() {
      this.$navigateBack();
    },

    getAudio() {
      this.busy = true;

      const filePath = fileSystemModule.path.join(path, this.title + ".mp3");
      console.log(filePath);
      httpModule
        .getFile("https://yt-node-api.herokuapp.com/" + this.videoId, filePath)
        .then(
          resultFile => {
            this.busy = false;
            alert({
              title: "Download Complete",
              message: this.title + " downloaded.",
              okButtonText: "Close"
            }).then(() => {
              this.$navigateBack();
            });
            // Vuex
            this.$store.commit("addMusic", resultFile);
            console.log(resultFile);
          },
          e => {
            this.busy = false;
            alert({
              title: "Download Error",
              message: this.title + " can't be downloaded.",
              okButtonText: "Close"
            }).then(() => {
              this.$navigateBack();
            });
            console.log(e);
          }
        );
    }
  }
};
</script>


<style scoped>
ActionBar {
  background-color: #e64a19;
  color: #ffffff;
}
StackLayout {
  background-color: #000000;
}
.title {
  background-color: #000000;
  vertical-align: center;
  font-size: 20;
  padding-top: 10;
  padding-left: 10;
  padding-right: 10;
  color: #fff;
}
.channel {
  color: #5f5f5f;
  vertical-align: center;
  padding-left: 10;
  font-size: 15;
  padding-right: 10;
  padding-bottom: 20;
}
button {
  background-color: #e64a19;
  color: #fff;
}
ActivityIndicator {
  margin-top: 25;
}
</style>
