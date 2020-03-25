<template>
  <Page>
    <ActionBar title="Youtube Audio">
      <ActionItem ios.position="right" icon="~/assets/images/playlist.png" @tap="music" />
    </ActionBar>
    <GridLayout rows="50,*" colums="*">
      <SearchBar v-model="searchQuery" hint="eg Luciana Zogbi" row="0" col="0" @submit="search" />
      <!-- <ListView
        for="video in videos"
        @itemTap="onItemTap('pV0bCq0yeWQ', 'Megadeth - Symphony of Destruction (Studio Version)' , 'https://i.ytimg.com/vi/K5jvUXij7nU/hqdefault.jpg', 'megadethvevo','REMASTERED IN HD! Official video of Megadeth performing Sweating Bullets from the album. Buy It Here: http://smarturl.it/t1po3x Like Megadeth on Facebook: ...')"
        row="1"
        col="0"
      >
        <v-template>
          <GridLayout rows="*,*,*" colums="*,*,*">
            <Image
              src="https://i.ytimg.com/vi/K5jvUXij7nU/hqdefault.jpg"
              stretch="aspectFill"
              row="0"
              col="0"
            />
            <Label
              class="title"
              text="Megadeth - Symphony of Destruction (Studio Version)"
              row="1"
              col="0"
            />
            <Label class="channel" text="megadethvevo" row="2" col="0" />
          </GridLayout>
        </v-template>
      </ListView>-->
      <ListView for="video in videos" @itemTap="onItemTap" row="1" col="0">
        <v-template>
          <GridLayout rows="*,*,*" colums="*,*,*">
            <Image :src="video.snippet.thumbnails.high.url" stretch="aspectFill" row="0" col="0" />
            <Label class="title" :text="video.snippet.title" row="1" col="0" />
            <Label class="channel" :text="video.snippet.channelTitle" row="2" col="0" />
          </GridLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script >
import Downloads from "./Downloads";
import Music from "./Music";

export default {
  data() {
    return {
      searchQuery: "",
      videos: []
    };
  },

  methods: {
    onItemTap(event) {
      //video.id.videoId, video.snippet.title, video.snippet.thumbnails.high.url,video.snippet.channelTitle, video.snippet.description
      // console.log(event.item);
      this.$navigateTo(Downloads, {
        props: {
          videoId: event.item.id.videoId,
          title: event.item.snippet.title,
          thumbnail: event.item.snippet.thumbnails.high.url,
          channel: event.item.snippet.channelTitle,
          description: event.item.snippet.description
        }
      });
    },

    music() {
      this.$navigateTo(Music);
    },

    search() {
      fetch(
        this.buildUrl("https://www.googleapis.com/youtube/v3/search", {
          part: "snippet",
          q: this.searchQuery,
          key: "AIzaSyDcGXhH-zAna5c5o-cR6ngK_C8Rknt8izg"
        })
      ).then(res => res.json()).then(data=>{
        this.videos = data.items || [];
      });
    },

    buildUrl(url, parameters) {
      let qs = "";
      for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          const value = parameters[key];
          qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
      }
      if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
      }
      console.log(url);
      return url;
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
.title {
  background-color: #000000;
  vertical-align: center;
  padding-top: 8;
  padding-left: 10;
  padding-right: 10;
  color: #fff;
}
.channel {
  color: #5f5f5f;
  vertical-align: center;
  padding-left: 10;
  padding-right: 10;
  padding-bottom: 20;
}
</style>
