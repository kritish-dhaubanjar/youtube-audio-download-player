<template>
  <Page>
    <ActionBar title="Youtube Music Player">
      <ActionItem
        @tap="goBack"
        ios.position="left"
        icon="~/assets/images/back.png"
        android.position="actionBar"
      />
    </ActionBar>
    <GridLayout rows="*,70" colums="*">
      <ListView for="song in music" row="0" col="0" @itemTap="play">
        <v-template>
          <GridLayout rows="*,*" columns="30,*,40">
            <Image class="note" src="~/assets/images/note.png" stretch="aspectFit" row="0" col="0" />
            <Label class="title" :text="song._name" row="0" col="1" />
            <Label class="channel" :text="song._path" row="1" col="1" />
            <Image
              class="delete"
              src="~/assets/images/delete.png"
              stretch="aspectFit"
              row="0"
              col="2"
              @tap="deleteMusic(song)"
            />
          </GridLayout>
        </v-template>
      </ListView>
      <GridLayout backgroundColor="#1a1a1a" rows="*" columns="80,*" row="1" col="0">
        <Image
          class="control"
          :src="button"
          row="0"
          col="0"
          stretch="aspectFill"
          @tap="playorpause"
        />
        <StackLayout row="0" col="1">
          <Label class="music" :text="song" />
          <Slider :value="seek" :maxValue="duration" />
        </StackLayout>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
const audio = require("nativescript-audio-player");
const player = new audio.TNSPlayer();
const timerModule = require("tns-core-modules/timer");
const fileSystemModule = require("tns-core-modules/file-system");

export default {
  data() {
    return {
      button: "",
      duration: 0,
      seek: 0
    };
  },

  computed: {
    song() {
      return this.$store.getters.getPlaying;
    },
    music() {
      return this.$store.getters.getMusic;
    }
  },

  created() {
    if (player.isAudioPlaying()) this.button = "~/assets/images/pause.png";
    else this.button = "~/assets/images/play.png";

    // this.$store.getters.getMusic.forEach(music => {
    //   this.music.push(music);
    // });
  },

  methods: {
    goBack() {
      this.$navigateBack();
    },

    deleteMusic(song) {
      confirm({
        title: "Delete " + song._name,
        message: "Are your sure ?",
        okButtonText: "Delete",
        cancelButtonText: "Cancel"
      }).then(result => {
        if (result) {
          let file = fileSystemModule.File.fromPath(song._path);
          file
            .remove()
            .then(res => {
              console.log("File successfully deleted!");
              this.$store.commit("removeMusic", song);
            })
            .catch(err => {
              console.log(err.stack);
            });
        }
      });
    },

    playorpause() {
      if (this.$store.getters.getPlaying) {
        console.log(player.currentTime);
        console.log(this.duration);
        if (player.isAudioPlaying()) {
          player.pause();
          this.button = "~/assets/images/play.png";
        } else {
          player.resume();
          this.button = "~/assets/images/pause.png";
        }
      }
    },

    play(event) {
      this.$store.commit("setPlaying", event.item._name);
      this.$store.commit("setPath", event.item._path);
      const playerOptions = {
        audioFile: event.item._path,
        loop: false,
        completeCallback: function() {
          console.log("finished playing");
        },
        errorCallback: function(errorObject) {
          console.log(JSON.stringify(errorObject));
        },
        infoCallback: function(args) {
          console.log(JSON.stringify(args));
        }
      };

      this.button = "~/assets/images/pause.png";
      player
        .playFromUrl(playerOptions)
        .then(function(res) {
          //   console.log(res);
        })
        .catch(function(err) {
          console.log("something went wrong...", err);
        });

      player.getAudioTrackDuration().then(duration => {
        this.duration = parseInt(duration);
      });

      timerModule.setInterval(() => {
        this.seek = player.currentTime;
      }, 1000);
    }
  }
};
</script>


<style scoped>
ActionBar {
  background-color: #e64a19;
  color: #ffffff;
}
ListView {
  background-color: #000000;
}
.note {
  margin-top: 15;
  margin-left: 10;
}
.control {
  margin: 10;
}
.title {
  background-color: #000000;
  vertical-align: center;
  font-size: 18;
  padding-top: 15;
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
.music {
  background-color: #1a1a1a1a;
  color: #fff;
  margin-left: 12;
  padding-top: 8;
}
.delete {
  margin-right: 7;
  margin-top: 20;
}
</style>