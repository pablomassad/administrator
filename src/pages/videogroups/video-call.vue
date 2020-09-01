<template>
  <div class="videoFrame">
    <video ref="videoRef" autoplay class="videoStyle">
      Video stream not available
    </video>
    <!-- <q-item>
      <q-item-section avatar>
        <q-icon color="primary" name="volume_up" />
      </q-item-section>
      <q-item-section>
        <q-slider v-model="volume" :min="0" :max="100" label color="primary" />
      </q-item-section>
    </q-item> -->
    <q-slider
      v-model="volumen"
      :min="0"
      :max="100"
      color="blue"
      markers
      snap
      vertical
      reverse
      label-always
    />
  </div>
</template>
<script>
export default {
  name: 'videocall',
  data() {
    return {
      vol: 10
    };
  },
  mounted() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true
      })
      .then(vid => {
        const vidRef = this.$refs;
        vidRef.videoRef.srcObject = vid;
      })
      .catch(console.error);
  },
  computed: {
    volumen: {
      get() {
        console.log('vol: ', this.vol);
        return this.dirtyFlag;
      },
      set(v) {
        this.vol = v;
        this.$refs.videoRef.volumen = v;
      }
    }
  }
};
</script>
<style scoped>
.videoFrame {
  width: 250px;
  display: flex;
}
.videoStyle {
  border-radius: 50%;
  width: 200px;
  height: 200px;
  object-fit: cover;
  box-shadow: 1px 1px 5px black;
  padding: 10px;
  background: lightgray;
  margin: auto;
}
</style>
