<template>
  <div>
    <div v-if="!initOK">
      <q-card class="frameCard">
        <q-card-section>
          <div class="row justify-center">
            <q-card
              :class="{ fileSelected: fileMD !== null }"
              class="col fileCard text-white shadow-11"
              style="background: radial-gradient(circle, #44aaff 0%, #4488bb 100%)"
            >
              <q-card-section>
                <div class="text-h6">Ejemplos</div>
                <div class="text-subtitle2">Archivo *.md</div>
                <div class="q-pa-xs">
                  <q-file
                    style="margin-top:20px"
                    clearable
                    bg-color="white"
                    filled
                    color="white"
                    v-model="fileMD"
                    bottom-slots
                    counter
                    label="subir archivo"
                    :filter="checkMD"
                    @rejected="onRejected"
                  >
                  </q-file>
                </div>
              </q-card-section>
            </q-card>
            <q-card
              :class="{ fileSelected: fileCSV !== null }"
              class="col fileCard text-white shadow-11"
              style="background: radial-gradient(circle, #44aaff 0%, #4488bb 100%)"
            >
              <q-card-section>
                <div class="text-h6">Respuestas</div>
                <div class="text-subtitle2">Archivo *.csv</div>
                <div class="q-pa-xs">
                  <q-file
                    style="margin-top:20px"
                    clearable
                    bg-color="white"
                    filled
                    color="white"
                    v-model="fileCSV"
                    bottom-slots
                    counter
                    label="subir archivo"
                    :filter="checkCSV"
                    @rejected="onRejected"
                  >
                  </q-file>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="row justify-center" v-if="fileMD && fileCSV">
            <q-btn
              glossy
              color="purple"
              icon="school"
              icon-right="send"
              label="Continuar..."
              @click="processFiles"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-splitter v-if="initOK" v-model="splitterModel">
      <template v-slot:before>
        <Intentions />
      </template>
      <template v-slot:after>
        <Detail />
      </template>
    </q-splitter>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import Intentions from './Intentions.vue';
import Detail from './Detail.vue';

export default {
  name: 'bot',
  data() {
    return {
      initOK: false,
      fileMD: null,
      fileCSV: null,
      splitterModel: 25,
      statusEjemplos: '',
      statusRespuestas: '',
      intentions: []
    };
  },
  methods: {
    ...mapMutations('main', ['setTitle']),
    ...mapMutations('bot', ['setIntentions']),
    ...mapActions('bot', ['getIntentions']),
    checkMD(files) {
      return files.filter(file => {
        const res = file.type === 'text/markdown' || file.type === '';
        console.log('checkMD:', res);
        return res;
      });
    },
    checkCSV(files) {
      return files.filter(file => {
        const res =
          file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';
        console.log('checkMD:', res);
        return res;
      });
    },
    onRejected(rejectedEntries) {
      console.log('rejectedEntries:', rejectedEntries);
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} El archivo no posee la extension solicitada`
      });
    },
    processFiles() {
      this.initOK = true;
      this.parseFiles();
    },
    parseFiles() {
      var frMD = new FileReader();
      frMD.onload = e => {
        let dataStr = e.target.result;
        dataStr = dataStr.replace(/<!--.*?-->/gs, '');
        const regexNLU = /(##(\sintent:(.+?))\n\n)/gms;
        let md;
        while ((md = regexNLU.exec(dataStr)) !== null) {
          if (md.index === regexNLU.lastIndex) {
            regexNLU.lastIndex++;
          }
          let intencion;
          md.forEach((match, groupIndex) => {
            if (groupIndex === 3) {
              const info = match.split('- ');
              // La intencion es el primer match
              intencion = info.shift().trim();

              const newInt = {
                text: intencion,
                ejemplos: [],
                dirty: false
              };
              this.intentions.push(newInt);
              info.forEach(ejText => {
                newInt.ejemplos.push({
                  text: ejText
                });
              });
            }
          });
        }
        console.log('intenciones: ', this.intentions.length);

        const frCSV = new FileReader();
        frCSV.onload = ev => {
          const dataStr = ev.target.result;
          const regexCSV = /(.+?,)(".+?")/gms;
          let mr;
          while ((mr = regexCSV.exec(dataStr)) !== null) {
            if (mr.index === regexCSV.lastIndex) {
              regexCSV.lastIndex++;
            }

            let intencion;
            mr.forEach((match, groupIndex) => {
              if (groupIndex === 1) {
                intencion = match.trim().slice(0, -1);
              }

              if (groupIndex === 2) {
                const found = this.intentions.find(x => x.text === intencion);

                if (found) {
                  // console.log('found intention:', found);
                  found.respuesta = {
                    text: match.trim().slice(1, -1)
                  };
                } else {
                  const newInt = {
                    text: intencion,
                    dirty: false,
                    respuesta: { text: match.trim().slice(1, -1) }
                  };
                  // console.log('NOT found!!!!!', newInt);
                  this.intentions.push(newInt);
                }
              }
            });
          }
          this.setIntentions(this.intentions);
        };
        frCSV.readAsText(this.fileCSV);
      };
      frMD.readAsText(this.fileMD);
    }
  },
  created() {
    this.setTitle('Bot Trainer');
    // this.getIntentions();
  },
  components: {
    Intentions,
    Detail
  }
};
</script>

<style scoped>
.frameCard {
  width: 80vw;
  height: 400px;
  margin: 30px;
  background: lightgray;
}
.fileCard {
  max-width: 40vw;
  height: 250px;
  margin: 5vw;
}
.fileSelected {
  box-shadow: inset 2px 2px 5px black;
}
</style>
