<template>
  <div>
    <q-card v-if="selIntention">
      <q-tabs
        v-model="tab"
        dense
        class="bg-grey-3"
        align="justify"
        narrow-indicator
      >
        <q-tab name="examples" label="Ejemplos" />
        <q-tab name="response" label="Respuesta" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="examples">
          <q-input
            ref="filterExamples"
            filled
            v-model="filterExamples"
            label="Filtro"
          >
            <template v-slot:append>
              <q-icon
                v-if="filterExamples !== ''"
                name="clear"
                class="cursor-pointer"
                @click="filterExamples = ''"
              />
              <q-chip icon="event" text-color="white" color="primary"
                >Total: {{ examplesList.length }}</q-chip
              >
            </template>
          </q-input>

          <q-scroll-area style="height: 84vh">
            <q-list bordered separator :filter="filterExamples">
              <q-slide-item
                @left="onLeft"
                @right="onRight"
                left-color="secondary"
                right-color="negative"
                v-for="(ej, i) in examplesList"
                :key="i"
              >
                <template v-slot:left>
                  <div
                    class="row items-center cursor-pointer"
                    @click="editExample(ej, i)"
                  >
                    <q-icon left name="create" /> Editar
                  </div>
                </template>
                <template v-slot:right>
                  <div
                    class="row items-center cursor-pointer"
                    @click="removeExample(ej)"
                  >
                    Eliminar <q-icon right name="delete_forever" />
                  </div>
                </template>

                <q-item>
                  <q-item-section>
                    <div v-if="editExampId !== i">{{ ej.text }}</div>
                    <q-input
                      v-if="editExampId === i"
                      v-model="editExampText"
                      label="Ejemplo"
                      autofocus
                      @blur="confirmSaveExample"
                      @keyup.enter="confirmSaveExample"
                    />
                  </q-item-section>
                  <q-item-section v-if="ej.dirty" avatar>
                    <q-avatar
                      color="negative"
                      text-color="white"
                      icon="star"
                      class="shadow-2"
                    />
                  </q-item-section>
                </q-item>
              </q-slide-item>
            </q-list>
          </q-scroll-area>
        </q-tab-panel>

        <q-tab-panel name="response">
          <div class="q-pa-md">
            <q-slide-item
              @left="onLeft"
              @right="onRight"
              left-color="secondary"
              right-color="negative"
            >
              <template v-slot:left>
                <div
                  class="row items-center cursor-pointer"
                  @click="editResponse"
                >
                  <q-icon left name="create" /> Editar
                </div>
              </template>
              <template v-slot:right>
                <div
                  class="row items-center cursor-pointer"
                  @click="removeResponse"
                >
                  Eliminar <q-icon right name="delete_forever" />
                </div>
              </template>
              <q-item>
                <q-item-section>
                  <div v-if="editResText === '' && selIntention.respuesta">
                    {{ selIntention.respuesta.text }}
                  </div>
                  <q-input
                    v-if="editResText !== ''"
                    v-model="editResText"
                    label="Respuesta"
                    autofocus
                    type="textarea"
                    @blur="confirmSaveResponse"
                    @keyup.enter="confirmSaveResponse"
                  />
                </q-item-section>
                <q-item-section
                  v-if="selIntention.respuesta && selIntention.respuesta.dirty"
                  avatar
                >
                  <q-avatar
                    color="orange"
                    text-color="white"
                    icon="star"
                    class="shadow-6"
                  />
                </q-item-section>
              </q-item>
            </q-slide-item>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        vertical-actions-align="right"
        color="primary"
        glossy
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action color="secondary" glossy @click="saveFiles" icon="save">
          <q-tooltip
            :delay="1000"
            anchor="center left"
            self="center right"
            transition-show="scale"
            transition-hide="rotate"
            :offset="[10, 10]"
          >
            <div class="tt">Guardar cambios</div></q-tooltip
          >
        </q-fab-action>
        <q-fab-action
          color="accent"
          glossy
          @click="trainTest"
          icon="psychology"
        >
          <q-tooltip
            :delay="1000"
            anchor="center left"
            self="center right"
            transition-show="scale"
            transition-hide="scale"
            :offset="[10, 10]"
          >
            <div class="tt">Entrenar en TEST</div></q-tooltip
          >
        </q-fab-action>
        <q-fab-action color="accent" glossy @click="trainProd" icon="school">
          <q-tooltip
            :delay="1000"
            anchor="center left"
            self="center right"
            transition-show="rotate"
            transition-hide="rotate"
            :offset="[10, 10]"
          >
            <div class="tt">PROD</div></q-tooltip
          >
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'detail',
  data() {
    return {
      filterExamples: '',
      tab: 'examples',
      disableResponse: true,
      editExampId: -1,
      editExampText: '',
      editResText: ''
    };
  },
  computed: {
    ...mapState('bot', ['intentions', 'selIntention', 'dirtyFlag']),
    examplesList() {
      console.log('Detail examplesList dirtyFlag: ', this.dirtyFlag);
      const lst = this.selIntention.ejemplos.filter(
        x =>
          (x.text.toLowerCase().indexOf(this.filterExamples.toLowerCase()) >
            -1 &&
            this.dirtyFlag === false) ||
          x.dirty === true
      );
      console.log('examplesList: ', lst.length);
      return lst;
    }
  },
  watch: {
    status(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);
      if (newValue === 'success') {
        this.complex = {
          deep: 'some deep object'
        };
      }
    }
  },
  methods: {
    ...mapActions('bot', ['saveExample', 'saveResponse']),
    onLeft({ reset }) {
      this.finalize(reset);
    },

    onRight({ reset }) {
      this.finalize(reset);
    },

    finalize(reset) {
      this.timer = setTimeout(() => {
        reset();
      }, 1000);
    },
    editExample(ej, i) {
      this.editExampText = ej.text;
      this.editExampId = i;
    },
    removeExample(i) {},
    confirmSaveExample() {
      this.$q
        .dialog({
          title: 'Atención',
          message: 'Desea guardar el cambio?',
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
            this.saveExample({
              text: this.editExampText,
              id: this.editExampId
            });
            this.editExampId = -1;
            this.editExampText = '';
          } catch (error) {
            console.log(error);
          }
        });
    },
    editResponse() {
      const found = this.intentions.find(
        x => x.text === this.selIntention.text
      );
      this.editResText = found.respuesta.text;
    },
    removeResponse() {},
    confirmSaveResponse() {
      this.$q
        .dialog({
          title: 'Atención',
          message: 'Desea guardar la respuesta?',
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
            this.saveResponse(this.editResText);
            this.editResText = '';
          } catch (error) {
            console.log(error);
          }
        });
    },
    saveFiles() {
      let str = '';
      this.intentions.forEach((intent, i) => {
        if (intent.ejemplos) {
          str = str + '## intent:' + intent.text + '\n';
          intent.ejemplos.forEach(ej => {
            // console.log('ej: ', ej.text);
            str = str + '- ' + ej.text; //  + '\n';
          });
          str = str + '\r\n\r\n';
        }
      });
      this.download(str, 'nluKBS.md', 'markdown');

      str = '';
      this.intentions.forEach((intent, i) => {
        str = str + intent.text + ',';
        if (intent.respuesta) {
          str = str + '"' + intent.respuesta + '"\n';
        }
      });
      this.download(str, 'respuestas.csv', 'csv');
    },
    trainTest() {},
    trainProd() {},
    download(str, filename, mime) {
      var a = document.createElement('a');
      a.href = `data:text/${mime};charset=utf-8,` + encodeURIComponent(str);
      a.download = filename;
      a.click();
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
};
</script>

<style scoped>
.edited {
  background-color: lightsalmon;
}
</style>
