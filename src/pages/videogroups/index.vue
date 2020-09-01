<template>
  <div>
    <h3>Video Groups</h3>
    <video-call></video-call>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import VideoCall from './video-call.vue';

export default {
  name: 'videoGroups',
  data() {
    return {
      initOK: false
    };
  },
  methods: {
    ...mapMutations('main', ['setTitle'])
  },
  created() {
    this.setTitle('Video Groups');
  },
  mounted() {},
  components: {
    VideoCall
  }
};
</script>

<style scoped></style>
